import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, MinLength } from 'class-validator';

export class CreateArtistDto {
  @ApiProperty({
    required: true,
    description: 'Artist name',
  })
  @MinLength(1)
  name: string;

  @ApiProperty({
    required: true,
    description: 'Has Grammy awards',
  })
  @IsBoolean()
  grammy: boolean;
}
