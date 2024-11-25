import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/entities/user.entity';
import { DataService } from 'src/database/data.service';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(private dataService: DataService) {}

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

    //TODO: return token
  }

  async refresh(token: UpdateAuthDto) {
    //TODO: refesh access token by refresh one

    console.log('token: ', token);
  }
}
