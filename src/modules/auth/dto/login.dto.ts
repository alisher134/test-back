import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { PickType } from '@nestjs/mapped-types';

export class LoginDto extends PickType(CreateUserDto, ['email', 'password']) {}
