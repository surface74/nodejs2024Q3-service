import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Response } from 'express';
import { AuthMessages } from './enums/auth-messages.enum';
import { RefreshAuthDto } from './dto/refresh-auth.dto';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { Public } from './public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiCreatedResponse({
    description: AuthMessages.UserCreated,
    type: String,
  })
  @ApiBadRequestResponse({ description: 'Not contains required fields' })
  @UseInterceptors(ClassSerializerInterceptor)
  async signup(
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    const result = await this.authService.signUp(createUserDto);
    res.status(HttpStatus.CREATED);

    return result;
  }

  @Public()
  @Post('login')
  @ApiOkResponse({
    description: AuthMessages.LoginSuccessful,
    type: AuthTokensDto,
  })
  @ApiForbiddenResponse({ description: AuthMessages.LoginFailedByUser })
  @ApiBadRequestResponse({ description: AuthMessages.LoginFailedByData })
  async login(@Body() createUserDto: CreateUserDto) {
    return await this.authService.login(createUserDto);
  }

  @Public()
  @Post('refresh')
  @ApiOkResponse({
    description: AuthMessages.RefreshSuccessful,
    type: AuthTokensDto,
  })
  @ApiUnauthorizedResponse({ description: AuthMessages.TokenExpired })
  @ApiBadRequestResponse({ description: AuthMessages.NoTokenPassed })
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Body() token: RefreshAuthDto,
  ) {
    const tokens: AuthTokensDto = await this.authService.refresh(token);
    res.status(HttpStatus.OK);

    return tokens;
  }
}
