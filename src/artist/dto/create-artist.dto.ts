import { IsBoolean, MinLength } from 'class-validator';

export class CreateArtistDto {
  @MinLength(1)
  name: string;

  @IsBoolean()
  grammy: boolean;
}
