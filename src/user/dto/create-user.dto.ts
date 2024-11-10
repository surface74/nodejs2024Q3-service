import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  login: string;

  @MinLength(6)
  password: string;
}
