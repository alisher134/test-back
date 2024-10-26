import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AdminGuard } from '../guards/admin.guard';
import { JwtGuard } from '../guards/jwt.guard';

export const Auth = (
	role: UserRole = UserRole.STUDENT
): ClassDecorator & MethodDecorator =>
	applyDecorators(
		role === UserRole.ADMIN
			? UseGuards(JwtGuard, AdminGuard)
			: UseGuards(JwtGuard)
	);
