import { faker } from '@faker-js/faker';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'argon2';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly i18: I18nService
	) {}

	async findByEmail(email: string) {
		return await this.prismaService.user.findUnique({
			where: {
				email,
			},
		});
	}

	async findById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id,
			},
		});

		if (!user) throw new NotFoundException(this.i18.t('user.notFound'));

		return user;
	}

	async create(createUserDto: CreateUserDto) {
		const userData: Prisma.UserCreateInput = {
			email: createUserDto.email,
			firstName: createUserDto.firstName,
			lastName: createUserDto.lastName,
			password: await this.hashedPassword(createUserDto.password),
			avatarPath: faker.image.avatar(),
		};

		return await this.prismaService.user.create({
			data: userData,
		});
	}

	private async hashedPassword(password: string) {
		return await hash(password);
	}
}
