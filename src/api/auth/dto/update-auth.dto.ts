import { ApiProperty } from '@nestjs/swagger';
import { Entity } from 'typeorm';

@Entity()
export class UpdateAuthDto {
  @ApiProperty({
    description: 'Access token',
  })
  token: string;
}
