import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsUUID, MinLength } from 'class-validator';

export class UpdateAlbumDto {
  @ApiProperty({ required: false, description: 'Album`s name' })
  @IsOptional()
  @MinLength(1)
  name?: string;

  @ApiProperty({ required: false, description: 'Issue year', example: '2020' })
  @IsOptional()
  @IsPositive()
  year?: number;

  @ApiProperty({
    required: false,
    description: 'Artist`s ID (UUID v4)',
    example: '5564c9e2-c44b-4d71-b7ce-5362244cd201',
  })
  @IsOptional()
  @IsUUID()
  artistId?: string | null;
}
