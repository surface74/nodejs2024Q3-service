import { IsOptional, IsPositive, IsUUID, MinLength } from 'class-validator';

export class CreateAlbumDto {
  @MinLength(1)
  name: string;

  @IsPositive()
  year: number;

  @IsOptional()
  @IsUUID()
  artistId: string | null; // refers to Artist
}
