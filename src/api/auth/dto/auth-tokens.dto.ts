import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Entity } from 'typeorm';

@Entity()
export class AuthTokensDto {
  @ApiProperty({ description: 'Access token' })
  @IsString()
  access_token: string;

  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  refresh_token: string;
}
