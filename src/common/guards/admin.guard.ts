import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
} from '@nestjs/common';
import { User, UserRole } from '@prisma/client';

export class AdminGuard implements CanActivate {
	canActivate(ctx: ExecutionContext): boolean {
		const { user } = ctx.switchToHttp().getRequest<{ user: User }>();

		if (user.role !== UserRole.ADMIN)
			throw new ForbiddenException(
				'You do not have the right to perform this action'
			);

		return true;
	}
}
