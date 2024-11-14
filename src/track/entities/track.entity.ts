import { ApiProperty } from '@nestjs/swagger';
import { IDataEntity } from 'src/database/types/data-entity.interface';

export class Track implements IDataEntity {
  @ApiProperty({
    description: 'Track ID (UUID v4)',
    example: '5564c9e2-c44b-4d71-b7ce-5362244cd201',
  })
  id: string;

  @ApiProperty({ description: 'Track name' })
  name: string;

  @ApiProperty({
    description: 'Artist ID (UUID v4)',
    example: '5564c9e2-c44b-4d71-b7ce-5362244cd201',
  })
  artistId: string | null;

  @ApiProperty({
    description: 'Albums ID (UUID v4)',
    example: '5564c9e2-c44b-4d71-b7ce-5362244cd201',
  })
  albumId: string | null;

  @ApiProperty({ description: 'Track duration' })
  duration: number;
}
