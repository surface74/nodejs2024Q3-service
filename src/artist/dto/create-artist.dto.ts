import { IsBoolean, IsOptional, MinLength } from 'class-validator';

export class CreateArtistDto {
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsBoolean()
  grammy?: boolean;
}
