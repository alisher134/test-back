import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StatusAuthAttempts, User, UserRole } from '@prisma/client';
import { verify } from 'argon2';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { AuthAttemptsLogService } from './auth-attempts-log/auth-attempts-log.service';
import { AuthAttemptsService } from './auth-attempts.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
	private ACCESS_TOKEN_EXPIRATION = '15m';
	private REFRESH_TOKEN_EXPIRATION = '1d';

	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly authAttemptsService: AuthAttemptsService,
		private readonly authAttemptsLogService: AuthAttemptsLogService,
		private readonly i18n: I18nService
	) {}

	async register(registerDto: RegisterDto) {
		const isExists = await this.userService.findByEmail(registerDto.email);

		if (isExists) throw new BadRequestException(this.i18n.t('auth.exists'));

		const user = await this.userService.create(registerDto);

		return await this.buildResponse(user);
	}

	async login(loginDto: LoginDto, req: Request) {
		const ipAddress: string =
			(req.headers['x-forwarded-for'] as string)?.split(',').pop()?.trim() ||
			(req.headers['x-real-ip'] as string) ||
			req.connection?.remoteAddress ||
			req.socket?.remoteAddress;

		try {
			const user = await this.validate(loginDto);

			await this.authAttemptsLogService.logAttempt(
				loginDto.email,
				StatusAuthAttempts.SUCCESS,
				this.i18n.t('auth.loggedSuccess'),
				ipAddress
			);

			return await this.buildResponse(user);
		} catch (error) {
			const user = await this.userService.findByEmail(loginDto.email);
			if (user) {
				await this.authAttemptsLogService.logAttempt(
					loginDto.email,
					StatusAuthAttempts.FAILURE,
					error.message,
					ipAddress
				);
			}

			throw error;
		}
	}

	async refresh(refreshToken: string) {
		if (!refreshToken)
			throw new UnauthorizedException(this.i18n.t('auth.refreshNotProvided'));
		const result = await this.jwtService.verifyAsync(refreshToken);

		if (!result)
			throw new UnauthorizedException(
				this.i18n.t('auth.refreshTokenIncorrect')
			);

		const user = await this.userService.findById(result.id);

		return await this.buildResponse(user);
	}

	private async validate(loginDto: LoginDto) {
		const user = await this.userService.findByEmail(loginDto.email);

		if (user?.lockedUntil >= new Date())
			throw new BadRequestException(this.i18n.t('auth.blocked'));

		if (!user) {
			throw new UnauthorizedException(this.i18n.t('auth.validate'));
		}

		const isCorrectPassword = await this.passwordMatches(
			user.password,
			loginDto.password
		);
		if (!isCorrectPassword) {
			await this.authAttemptsService.incrementAuthAttempts(loginDto.email);

			throw new UnauthorizedException(this.i18n.t('auth.validate'));
		}

		await this.authAttemptsService.resetFailedAuthAttempts(loginDto.email);

		return user;
	}

	private async passwordMatches(userPassword: string, password: string) {
		return await verify(userPassword, password);
	}

	private async issueTokens(userId: string, role: UserRole) {
		const payload = {
			id: userId,
			role,
		};

		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.ACCESS_TOKEN_EXPIRATION,
		});

		const refreshToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.REFRESH_TOKEN_EXPIRATION,
		});

		return { accessToken, refreshToken };
	}

	private async buildResponse(user: Partial<User>) {
		const tokens = await this.issueTokens(user.id, user.role);

		return {
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
			},
			...tokens,
		};
	}
}
