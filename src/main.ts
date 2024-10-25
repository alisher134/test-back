import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './modules/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const config = app.get(ConfigService);
	const port = config.getOrThrow<number>('PORT');

	app.use(cookieParser());
	app.setGlobalPrefix('api/v1');
	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
	});

	app.useGlobalPipes(new ValidationPipe());

	await app.listen(port);
}
bootstrap();
