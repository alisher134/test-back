import { Controller, Get, Param } from '@nestjs/common';
import { AuthAttemptsLogService } from './auth-attempts-log.service';

@Controller('auth/log')
export class AuthAttemptsLogController {
	constructor(
		private readonly authAttemptsLogService: AuthAttemptsLogService
	) {}

	@Get()
	getAll() {
		return this.authAttemptsLogService.getAll();
	}

	@Get(':userId')
	getLogByUserId(@Param('userId') userId: string) {
		return this.authAttemptsLogService.getLogByUserId(userId);
	}
}
