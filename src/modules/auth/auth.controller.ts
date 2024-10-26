import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenService } from './refresh-token.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly refreshTokenService: RefreshTokenService
	) {}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async register(
		@Res({ passthrough: true }) res: Response,
		@Body() registerDto: RegisterDto
	) {
		const { refreshToken, ...response } =
			await this.authService.register(registerDto);

		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken);

		return response;
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(
		@Res({ passthrough: true }) res: Response,
		@Body() loginDto: LoginDto,
		@Req() req: Request
	) {
		const { refreshToken, ...response } = await this.authService.login(
			loginDto,
			req
		);

		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken);

		return response;
	}

	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	async refresh(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const refreshTokenFromCookies =
			req.cookies[this.refreshTokenService.REFRESH_TOKEN_NAME];

		const { refreshToken, ...response } = await this.authService.refresh(
			refreshTokenFromCookies
		);

		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken);

		return response;
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	async logout(@Res({ passthrough: true }) res: Response) {
		this.refreshTokenService.removeRefreshTokenFromResponse(res);
	}
}
