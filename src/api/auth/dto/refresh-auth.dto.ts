import { ApiProperty } from '@nestjs/swagger';
import { Entity } from 'typeorm';

@Entity()
export class RefreshAuthDto {
  @ApiProperty({
    description: 'Refresh token',
  })
  refreshToken: string;
}
