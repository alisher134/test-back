import { PrismaService } from '@/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, StatusAuthAttempts } from '@prisma/client';

@Injectable()
export class AuthAttemptsLogService {
	constructor(private readonly prismaService: PrismaService) {}

	async getAll() {
		return await this.prismaService.authAttemptsLog.findMany({
			orderBy: {
				createdAt: 'desc',
			},
		});
	}

	async getLogByUserId(userId: string) {
		return await this.prismaService.authAttemptsLog.findMany({
			where: {
				user: {
					id: userId,
				},
			},
		});
	}

	async logAttempt(
		email: string,
		status: StatusAuthAttempts,
		message: string,
		ipAddress?: string
	) {
		const authAttemptsLogData: Prisma.AuthAttemptsLogCreateInput = {
			user: {
				connect: {
					email,
				},
			},
			status,
			ipAddress,
			message,
		};

		return await this.prismaService.authAttemptsLog.create({
			data: authAttemptsLogData,
		});
	}
}
