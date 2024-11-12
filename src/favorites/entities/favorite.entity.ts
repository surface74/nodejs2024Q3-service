import { ApiProperty } from '@nestjs/swagger';

export class Favorite {
  @ApiProperty({ type: [String] })
  artists: string[];

  @ApiProperty({ type: [String] })
  albums: string[];

  @ApiProperty({ type: [String] })
  tracks: string[];
}
