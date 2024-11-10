import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(1)
  login: string;

  @IsString()
  password: string;
}
