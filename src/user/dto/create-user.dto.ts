import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true, description: 'Login name', example: 'Lora' })
  @MinLength(1)
  login: string;

  @ApiProperty({ required: true, description: 'Password', example: 'q3@er_%1' })
  @IsString()
  password: string;
}
