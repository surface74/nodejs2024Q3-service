import { ApiProperty } from '@nestjs/swagger';
import { IUser } from './user.interface';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'User ID (UUID v4)',
    example: '5564c9e2-c44b-4d71-b7ce-5362244cd201',
  })
  id: string;

  @Column('text')
  @ApiProperty({ description: 'Login name' })
  login: string;

  @Column('text')
  @ApiProperty({ description: 'Password' })
  password: string;

  @Column('decimal')
  @ApiProperty({ description: 'Autoincremented version' })
  version: number;

  @Column('decimal')
  @ApiProperty({ description: 'User creation timestamp', example: 1655000000 })
  createdAt: number;

  @Column('decimal')
  @ApiProperty({
    description: 'User modification timestamp',
    example: 1655000000,
  })
  updatedAt: number;
}
