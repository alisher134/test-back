import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
	AcceptLanguageResolver,
	HeaderResolver,
	I18nModule,
	QueryResolver,
} from 'nestjs-i18n';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		I18nModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				fallbackLanguage: configService.get('FALLBACK_LANGUAGE'),
				loaderOptions: {
					path: join(__dirname, '../i18n/'),
					watch: true,
				},
			}),
			resolvers: [
				new QueryResolver(['lang', 'l']),
				new HeaderResolver(['x-custom-lang']),
				AcceptLanguageResolver,
			],
			inject: [ConfigService],
		}),
		PrismaModule,
	],
})
export class AppModule {}
