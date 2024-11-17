import { ApiProperty } from '@nestjs/swagger';
import { Artist } from 'src/artist/entities/artist.entity';
import { IDataEntity } from 'src/database/types/data-entity.interface';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Album implements IDataEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Album`s ID (UUID v4)',
    example: '5564c9e2-c44b-4d71-b7ce-5362244cd201',
  })
  id: string;

  @Column('text')
  @ApiProperty({ description: 'Album`s name' })
  name: string;

  @Column('integer')
  @ApiProperty({ description: 'Issue year', example: '2020' })
  year: number;

  @Column('uuid')
  @OneToOne(() => Artist)
  @JoinColumn()
  @ApiProperty({
    description: 'Artist`s ID (UUID v4)',
    example: '5564c9e2-c44b-4d71-b7ce-5362244cd201',
  })
  artistId: string | null;
}
