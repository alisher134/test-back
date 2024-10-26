import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthAttemptsService {
	private MAX_ATTEMPT = 2;
	private LOCK_TIME = 5 * 60 * 1000;

	constructor(
		private readonly userService: UserService,
		private readonly prismaService: PrismaService
	) {}

	async incrementAuthAttempts(email: string) {
		const user = await this.userService.findByEmail(email);

		if (user.failedAuthAttempts >= this.MAX_ATTEMPT) {
			await this.prismaService.user.update({
				where: { email },
				data: {
					failedAuthAttempts: 0,
					lockedUntil: new Date(Date.now() + this.LOCK_TIME),
				},
			});
		}

		await this.prismaService.user.update({
			where: { email },
			data: {
				failedAuthAttempts: {
					increment: 1,
				},
			},
		});
	}

	async resetFailedAuthAttempts(email: string) {
		await this.prismaService.user.update({
			where: { email },
			data: {
				failedAuthAttempts: 0,
				lockedUntil: null,
			},
		});
	}
}
