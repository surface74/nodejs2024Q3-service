import { ApiProperty } from '@nestjs/swagger';
import { IDataEntity } from 'src/database/types/data-entity.interface';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Artist implements IDataEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Artist ID (UUID v4)',
    example: '5564c9e2-c44b-4d71-b7ce-5362244cd201',
  })
  id: string;

  @Column('text')
  @ApiProperty({ description: 'Artist name' })
  name: string;

  @Column('boolean')
  @ApiProperty({ description: 'Has Grammy awards' })
  grammy: boolean;
}
