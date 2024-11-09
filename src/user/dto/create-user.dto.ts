import { IUser } from '../entities/user.interface';

export class CreateUserDto implements Pick<IUser, 'login' | 'password'> {
  login: string;
  password: string;
}
