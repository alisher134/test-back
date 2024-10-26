import { Module } from '@nestjs/common';
import { AuthAttemptsLogController } from './auth-attempts-log.controller';
import { AuthAttemptsLogService } from './auth-attempts-log.service';

@Module({
	controllers: [AuthAttemptsLogController],
	providers: [AuthAttemptsLogService],
	exports: [AuthAttemptsLogService],
})
export class AuthAttemptsLogModule {}
