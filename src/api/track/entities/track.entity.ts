import { ApiProperty } from '@nestjs/swagger';
import { IDataEntity } from 'src/database/types/data-entity.interface';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Track implements IDataEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'Track ID (UUID v4)',
    example: '5564c9e2-c44b-4d71-b7ce-5362244cd201',
  })
  id: string;

  @Column('text')
  @ApiProperty({ description: 'Track name' })
  name: string;

  @Column({ type: 'uuid', nullable: true })
  // @OneToOne(() => Artist)
  // @JoinColumn()
  @ApiProperty({
    description: 'Artist ID (UUID v4)',
    example: '5564c9e2-c44b-4d71-b7ce-5362244cd201',
  })
  artistId: string | null;

  @Column({ type: 'uuid', nullable: true })
  // @OneToOne(() => Album)
  // @JoinColumn()
  @ApiProperty({
    description: 'Albums ID (UUID v4)',
    example: '5564c9e2-c44b-4d71-b7ce-5362244cd201',
  })
  albumId: string | null;

  @Column('decimal')
  @ApiProperty({ description: 'Track duration' })
  duration: number;
}
