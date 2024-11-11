import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsUUID, MinLength } from 'class-validator';

export class CreateTrackDto {
  @ApiProperty({
    required: true,
    description: 'Track name',
  })
  @MinLength(1)
  name: string;

  @ApiProperty({
    required: false,
    description: 'Artist ID (UUID v4)',
    example: '5564c9e2-c44b-4d71-b7ce-5362244cd201',
  })
  @IsOptional()
  @IsUUID()
  artistId?: string | null;

  @ApiProperty({
    required: false,
    description: 'Album ID (UUID v4)',
    example: '5564c9e2-c44b-4d71-b7ce-5362244cd201',
  })
  @IsOptional()
  @IsUUID()
  albumId?: string | null;

  @ApiProperty({
    required: true,
    description: 'Track duration',
  })
  @IsPositive()
  duration: number;
}
