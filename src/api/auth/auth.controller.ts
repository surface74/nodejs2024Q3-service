import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpStatus,
  Inject,
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
import { CustomLogger } from 'src/common/custom-logger/custom-logger.service';
import { Request, Response } from 'express';
import { AuthMessages } from './enums/auth-messages.enum';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthTokensDto } from './dto/auth-tokens.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(CustomLogger)
    private customLogger: CustomLogger,
  ) {
    this.customLogger.setContext(AuthController.name);
  }

  @Post('signup')
  @ApiCreatedResponse({
    description: AuthMessages.UserCreated,
    type: String,
  })
  @ApiBadRequestResponse({ description: 'Not contains required fields' })
  async signUp(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    this.customLogger.logRequest(req);

    await this.authService.signUp(createUserDto);
    res.status(HttpStatus.CREATED);

    this.customLogger.logResponse(res);

    return AuthMessages.UserCreated;
  }

  @Post('login')
  @ApiOkResponse({
    description: AuthMessages.LoginSuccessful,
    type: AuthTokensDto,
  })
  @ApiForbiddenResponse({ description: AuthMessages.LoginFailedByUser })
  @ApiBadRequestResponse({ description: AuthMessages.LoginFailedByData })
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    this.customLogger.logRequest(req);

    const result: AuthTokensDto = await this.authService.login(createUserDto);

    this.customLogger.logResponse(res);

    return result;
  }

  @Post('refresh')
  @ApiOkResponse({ description: AuthMessages.RefreshSuccessful })
  @ApiUnauthorizedResponse({ description: AuthMessages.TokenExpired })
  @ApiBadRequestResponse({ description: AuthMessages.NoTokenPassed })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() token: UpdateAuthDto,
  ) {
    this.customLogger.logRequest(req);

    await this.authService.refresh(token);

    this.customLogger.logResponse(res);

    return AuthMessages.RefreshSuccessful;
  }
}
