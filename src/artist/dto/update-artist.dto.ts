import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateArtistDto {
  @ApiProperty({
    required: false,
    description: 'Artist`s name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Has Grammy awards',
  })
  @IsOptional()
  @IsBoolean()
  grammy?: boolean;
}
