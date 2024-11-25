import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/entities/user.entity';
import { DataService } from 'src/database/data.service';
import { RefreshAuthDto } from './dto/refresh-auth.dto';
import { AuthTokensDto } from './dto/auth-tokens.dto';

@Injectable()
export class AuthService {
  constructor(
    private dataService: DataService,
    private jwtService: JwtService,
  ) {}

  readonly salt = process.env.CRYPT_SALT;

  async signUp(createUserDto: CreateUserDto) {
    const hash = await bcrypt.hash(createUserDto.password, +this.salt);

    const user: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: hash,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return new User(await this.dataService.createUser(user));
  }

  async login(userCredentials: CreateUserDto) {
    const { login, password } = userCredentials;
    const user = await this.dataService.findUserByLogin(login);
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new ForbiddenException();
    }

    const payload = { sub: user.id, username: user.login };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    });

    const tokens: AuthTokensDto = { accessToken, refreshToken };

    return tokens;
  }

  async refresh(refreshAutoDto: RefreshAuthDto) {
    const { refreshToken } = refreshAutoDto;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET_KEY,
      });

      const newPayload = { sub: payload.sub, username: payload.username };

      const newAccessToken = await this.jwtService.signAsync(newPayload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      });

      const newRefreshToken = await this.jwtService.signAsync(newPayload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      });

      const tokens: AuthTokensDto = {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };

      return tokens;
    } catch {
      throw new ForbiddenException();
    }
  }
}
