import { IsOptional, IsPositive, IsUUID, MinLength } from 'class-validator';

export class UpdateAlbumDto {
  @IsOptional()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsPositive()
  year?: number;

  @IsOptional()
  @IsUUID()
  artistId?: string | null; // refers to Artist
}
