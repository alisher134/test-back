import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const config = app.get(ConfigService);
	const port = config.getOrThrow<number>('PORT');

	app.use(cookieParser());
	app.useGlobalPipes(new ValidationPipe());
	app.setGlobalPrefix('api/v1');
	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
	});

	await app.listen(port);
}
bootstrap();
