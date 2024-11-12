import { ApiProperty } from '@nestjs/swagger';

export class Artist {
  @ApiProperty({
    description: 'Artist ID (UUID v4)',
    example: '5564c9e2-c44b-4d71-b7ce-5362244cd201',
  })
  id: string;

  @ApiProperty({ description: 'Artist name' })
  name: string;

  @ApiProperty({ description: 'Has Grammy awards' })
  grammy: boolean;
}
