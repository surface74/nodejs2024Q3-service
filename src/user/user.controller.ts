import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Response } from 'express';

import { DbResult } from 'src/storage/types/result.types';
import { ErrorMessage } from 'src/storage/types/error-message.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = this.userService.create(createUserDto);
    if (result.errorText) {
      res.status(HttpStatus.BAD_REQUEST);
      return result.errorText;
    }
    return result.data;
  }

  @Get()
  async findAll() {
    return (await this.userService.findAll()).data;
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: DbResult = await this.userService.findOne(id);
    if (result.errorText) {
      switch (result.errorText) {
        case ErrorMessage.RECORD_NOT_EXISTS:
          res.status(HttpStatus.NOT_FOUND);
          break;
        default:
          res.status(HttpStatus.BAD_REQUEST);
          break;
      }
      return result.errorText;
    }

    return result.data;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdatePasswordDto) {
    return this.userService.updatePassword(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
