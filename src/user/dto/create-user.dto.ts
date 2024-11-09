import { IUser } from '../entities/user.interface';

export class CreateUserDto implements IUser {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}
