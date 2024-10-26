import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
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

	app.useGlobalFilters(
		new I18nValidationExceptionFilter({
			detailedErrors: false,
		})
	);
	app.useGlobalPipes(new I18nValidationPipe());

	await app.listen(port);
}
bootstrap();
