import { ApiProperty } from '@nestjs/swagger';
import { IUser } from './user.interface';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'User ID (UUID v4)',
    example: '5564c9e2-c44b-4d71-b7ce-5362244cd201',
  })
  id: string;

  @Column()
  @ApiProperty({ description: 'Login name' })
  login: string;

  @Column()
  @ApiProperty({ description: 'Password' })
  password: string;

  @Column()
  @ApiProperty({ description: 'Autoincremented version' })
  version: number;

  @Column()
  @ApiProperty({ description: 'User creation timestamp', example: 1655000000 })
  createdAt: number;

  @Column()
  @ApiProperty({
    description: 'User modification timestamp',
    example: 1655000000,
  })
  updatedAt: number;
}
