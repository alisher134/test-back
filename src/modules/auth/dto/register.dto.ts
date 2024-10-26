import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { PickType } from '@nestjs/mapped-types';

export class RegisterDto extends PickType(CreateUserDto, [
	'email',
	'firstName',
	'lastName',
	'password',
]) {}
