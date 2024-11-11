import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true, description: 'Login name' })
  @MinLength(1)
  login: string;

  @ApiProperty({ required: true, description: 'Password' })
  @IsString()
  password: string;
}
