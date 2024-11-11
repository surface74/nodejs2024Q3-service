import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsUUID, MinLength } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({ required: true, description: 'Album name' })
  @MinLength(1)
  name: string;

  @ApiProperty({ required: true, description: 'Issue year', example: '2020' })
  @IsPositive()
  year: number;

  @ApiProperty({
    required: false,
    description: 'Artist ID (UUID v4)',
    example: '5564c9e2-c44b-4d71-b7ce-5362244cd201',
  })
  @IsOptional()
  @IsUUID()
  artistId: string | null;
}
