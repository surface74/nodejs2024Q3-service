import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DataService } from 'src/storage/data.service';
import { v4 as uuidv4, validate } from 'uuid';
import { ErrorMessage } from 'src/storage/types/error-message.enum';
import { DbResult } from 'src/storage/types/result.types';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private dataService: DataService) {}

  async create(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    const user: User = {
      id: uuidv4(),
      login,
      password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await this.dataService.createUser(user);

    const cloneUser = { ...user };
    delete cloneUser.password;

    return new DbResult({ data: cloneUser });
  }

  async findAll() {
    const result = (await this.dataService.findAllUsers()).map((user: User) => {
      const cloneUser = { ...user };
      delete cloneUser.password;
      return cloneUser;
    });

    return new DbResult({ data: result });
  }

  async findOne(id: string) {
    if (!validate(id)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    const user = await this.dataService.findOneUser(id);

    if (user) {
      const cloneUser = { ...user };
      delete cloneUser.password;
      return new DbResult({ data: cloneUser });
    }

    return new DbResult({
      errorText: ErrorMessage.RECORD_NOT_EXISTS,
    });
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    if (!validate(id)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    const user = await this.dataService.findOneUser(id);
    if (!user) {
      return new DbResult({
        errorText: ErrorMessage.RECORD_NOT_EXISTS,
      });
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      return new DbResult({ errorText: ErrorMessage.BAD_PASSWORD });
    }

    user.password = updatePasswordDto.newPassword;
    user.updatedAt = Date.now();
    user.version += 1;
    await this.dataService.updateUser(user);

    const cloneUser = { ...user };
    delete cloneUser.password;

    return new DbResult({ data: cloneUser });
  }

  async remove(id: string) {
    if (!validate(id)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    const user = await this.dataService.findOneUser(id);
    if (!user) {
      return new DbResult({
        errorText: ErrorMessage.RECORD_NOT_EXISTS,
      });
    }

    await this.dataService.removeUser(id);

    return new DbResult({});
  }
}
