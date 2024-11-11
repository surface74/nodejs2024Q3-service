import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import db from 'src/storage/data.service';
import { v4 as uuidv4, validate } from 'uuid';
import { ErrorMessage } from 'src/storage/types/error-message.enum';
import { DbResult } from 'src/storage/types/result.types';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
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
    await db.userStorage.push(user);

    const cloneUser = { ...user };
    delete cloneUser.password;

    return new DbResult({ data: cloneUser });
  }

  async findAll() {
    const result = db.userStorage.map((user: User) => {
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

    const result = await db.userStorage.filter((user: User) => user.id === id);

    if (result.length > 0) {
      const cloneUser = { ...result[0] };
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

    const index = await db.userStorage.findIndex(
      (user: User) => user.id === id,
    );

    if (index < 0) {
      return new DbResult({
        errorText: ErrorMessage.RECORD_NOT_EXISTS,
      });
    }

    const user: User = db.userStorage[index];
    if (user.password !== updatePasswordDto.oldPassword) {
      return new DbResult({ errorText: ErrorMessage.BAD_PASSWORD });
    }

    user.password = updatePasswordDto.newPassword;
    user.updatedAt = Date.now();
    user.version += 1;

    const cloneUser = { ...user };
    delete cloneUser.password;

    return new DbResult({ data: cloneUser });
  }

  async remove(id: string) {
    if (!validate(id)) {
      return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
    }

    const index = await db.userStorage.findIndex(
      (user: User) => user.id === id,
    );

    if (index < 0) {
      return new DbResult({ errorText: ErrorMessage.RECORD_NOT_EXISTS });
    }

    await db.userStorage.splice(index, 1);

    return new DbResult({});
  }
}
