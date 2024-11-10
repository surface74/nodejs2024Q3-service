import { IsOptional, IsPositive, IsUUID, MinLength } from 'class-validator';

export class CreateTrackDto {
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsUUID()
  artistId?: string | null; // refers to Artist

  @IsOptional()
  @IsUUID()
  albumId?: string | null; // refers to Album

  @IsPositive()
  duration: number; // integer number
}
