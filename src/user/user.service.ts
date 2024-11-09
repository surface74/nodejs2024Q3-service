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
  create(createUserDto: CreateUserDto) {
    if (createUserDto.login && createUserDto.password) {
      const user: User = {
        ...createUserDto,
        id: uuidv4(),
        version: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      db.userStorage.push(user);

      return new DbResult({ data: { ...user } });
    }

    return new DbResult({ errorText: ErrorMessage.BAD_REQUEST });
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
    if (validate(id)) {
      const result = await db.userStorage.filter(
        (user: User) => user.id === id,
      );

      if (result.length > 0) {
        const cloneUser = { ...result[0] };
        delete cloneUser.password;
        return new DbResult({ data: cloneUser });
      }

      return new DbResult({
        errorText: ErrorMessage.RECORD_NOT_EXISTS,
      });
    }

    return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    if (validate(id)) {
      const result = await db.userStorage.filter(
        (user: User) => user.id === id,
      );

      if (!result.length) {
        return new DbResult({
          errorText: ErrorMessage.RECORD_NOT_EXISTS,
        });
      }

      if (result[0].password !== updatePasswordDto.oldPassword) {
        return new DbResult({ errorText: ErrorMessage.BAD_PASSWORD });
      }

      result[0].password = updatePasswordDto.newPassword;
      result[0].updatedAt = Date.now();
      result[0].version += 1;

      const cloneUser = { ...result[0] };
      delete cloneUser.password;

      return new DbResult({ data: cloneUser });
    }

    return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
