import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', array: true })
  @ApiProperty({ type: [String] })
  artists: string[];

  @Column({ type: 'uuid', array: true })
  @ApiProperty({ type: [String] })
  albums: string[];

  @Column({ type: 'uuid', array: true })
  @ApiProperty({ type: [String] })
  tracks: string[];
}
