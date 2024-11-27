import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  Put,
  ParseUUIDPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Response } from 'express';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';

import { User } from './entities/user.entity';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @ApiCreatedResponse({
    description: 'Created',
    type: OmitType(User, ['password']),
  })
  @ApiBadRequestResponse({ description: 'Not contains required fields' })
  async create(
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    const result = await this.userService.create(createUserDto);
    res.status(HttpStatus.CREATED);

    return result;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOkResponse({ description: 'OK', type: [OmitType(User, ['password'])] })
  async findAll() {
    return await this.userService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @ApiOkResponse({ description: 'OK', type: OmitType(User, ['password']) })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.userService.findOne(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  @ApiOkResponse({ description: 'OK', type: OmitType(User, ['password']) })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiForbiddenResponse({ description: 'Invalid password' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @ApiNoContentResponse({ description: 'Deleted' })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async remove(
    @Res({ passthrough: true }) res: Response,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.userService.remove(id);
    res.status(HttpStatus.NO_CONTENT);

    return '';
  }
}
