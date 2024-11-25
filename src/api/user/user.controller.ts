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
  Req,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Request, Response } from 'express';

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

import { CustomLogger } from 'src/common/custom-logger/custom-logger.service';
import { User } from './entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(CustomLogger)
    private customLogger: CustomLogger,
  ) {
    this.customLogger.setContext(UserController.name);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @ApiCreatedResponse({
    description: 'Created',
    type: OmitType(User, ['password']),
  })
  @ApiBadRequestResponse({ description: 'Not contains required fields' })
  async create(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    this.customLogger.logRequest(req);

    const result = await this.userService.create(createUserDto);
    res.status(HttpStatus.CREATED);

    this.customLogger.logResponse(res);

    return result;
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOkResponse({ description: 'OK', type: [OmitType(User, ['password'])] })
  async findAll(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.customLogger.logRequest(req);

    const result = await this.userService.findAll();

    this.customLogger.logResponse(res);

    return result;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @ApiOkResponse({ description: 'OK', type: OmitType(User, ['password']) })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async findOne(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.customLogger.logRequest(req);

    const result = await this.userService.findOne(id);

    this.customLogger.logResponse(res);

    return result;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  @ApiOkResponse({ description: 'OK', type: OmitType(User, ['password']) })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiForbiddenResponse({ description: 'Invalid password' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async update(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    this.customLogger.logRequest(req);

    const result = await this.userService.updatePassword(id, updatePasswordDto);

    this.customLogger.logResponse(res);

    return result;
  }

  @Delete(':id')
  @ApiNoContentResponse({ description: 'Deleted' })
  @ApiBadRequestResponse({ description: 'Invalid UUID' })
  @ApiNotFoundResponse({ description: 'Not found' })
  async remove(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    this.customLogger.logRequest(req);

    await this.userService.remove(id);
    res.status(HttpStatus.NO_CONTENT);

    this.customLogger.logResponse(res);

    return '';
  }
}
