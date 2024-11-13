import { ApiProperty } from '@nestjs/swagger';
import { IDataEntity } from 'src/storage/types/data-entity.interface';

export class Album implements IDataEntity {
  @ApiProperty({
    description: 'Album`s ID (UUID v4)',
    example: '5564c9e2-c44b-4d71-b7ce-5362244cd201',
  })
  id: string;

  @ApiProperty({ description: 'Album`s name' })
  name: string;

  @ApiProperty({ description: 'Issue year', example: '2020' })
  year: number;

  @ApiProperty({
    description: 'Artist`s ID (UUID v4)',
    example: '5564c9e2-c44b-4d71-b7ce-5362244cd201',
  })
  artistId: string | null;
}
