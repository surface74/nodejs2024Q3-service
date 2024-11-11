import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ required: true, description: 'Current password' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ required: true, description: 'New password' })
  @IsString()
  newPassword: string;
}
