import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
	@IsEmail(
		{},
		{
			message: i18nValidationMessage('validation.user.email.format'),
		}
	)
	@IsNotEmpty({
		message: i18nValidationMessage('validation.user.email.notEmpty'),
	})
	email: string;

	@IsString({
		message: i18nValidationMessage('validation.user.firstName.format'),
	})
	@MinLength(3, {
		message: i18nValidationMessage('validation.user.firstName.min'),
	})
	@IsNotEmpty({
		message: i18nValidationMessage('validation.user.firstName.notEmpty'),
	})
	firstName: string;

	@IsString({
		message: i18nValidationMessage('validation.user.lastName.format'),
	})
	@MinLength(3, {
		message: i18nValidationMessage('validation.user.lastName.min'),
	})
	@IsNotEmpty({
		message: i18nValidationMessage('validation.user.lastName.notEmpty'),
	})
	lastName: string;

	@MinLength(8, {
		message: i18nValidationMessage('validation.user.password.min'),
	})
	@IsNotEmpty({
		message: i18nValidationMessage('validation.user.password.notEmpty'),
	})
	password: string;
}
