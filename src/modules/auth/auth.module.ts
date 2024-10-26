import { JwtStrategy } from '@/common/strategies/jwt.strategy';
import { jwtConfig } from '@/config/jwt.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthAttemptsLogModule } from './auth-attempts-log/auth-attempts-log.module';
import { AuthAttemptsLogService } from './auth-attempts-log/auth-attempts-log.service';
import { AuthAttemptsService } from './auth-attempts.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: jwtConfig,
			inject: [ConfigService],
		}),
		AuthAttemptsLogModule,
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		UserService,
		RefreshTokenService,
		AuthAttemptsService,
		AuthAttemptsLogService,
		JwtStrategy,
	],
})
export class AuthModule {}
