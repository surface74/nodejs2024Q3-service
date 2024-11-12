import { ApiProperty } from '@nestjs/swagger';
import { IUser } from './user.interface';

export class User implements IUser {
  @ApiProperty({
    description: 'User ID (UUID v4)',
    example: '5564c9e2-c44b-4d71-b7ce-5362244cd201',
  })
  id: string;

  @ApiProperty({ description: 'Login name' })
  login: string;

  @ApiProperty({ description: 'Password' })
  password: string;

  @ApiProperty({ description: 'Autoincremented version' })
  version: number;

  @ApiProperty({ description: 'User creation timestamp', example: 1655000000 })
  createdAt: number;

  @ApiProperty({
    description: 'User modification timestamp',
    example: 1655000000,
  })
  updatedAt: number;
}
