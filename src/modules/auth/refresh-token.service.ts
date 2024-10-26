import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class RefreshTokenService {
	private REFRESH_TOKEN_EXPIRATION_DAY = 1;
	REFRESH_TOKEN_NAME = 'refreshToken';

	constructor(private readonly configService: ConfigService) {}

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date();
		expiresIn.setDate(expiresIn.getDate() + this.REFRESH_TOKEN_EXPIRATION_DAY);

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: this.configService.get<string>('DOMAIN'),
			expires: expiresIn,
			sameSite: 'lax',
			secure: true,
		});
	}

	removeRefreshTokenFromResponse(res: Response) {
		const expiresIn = new Date(0);

		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: this.configService.get<string>('DOMAIN'),
			expires: expiresIn,
			sameSite: 'lax',
			secure: true,
		});
	}
}
