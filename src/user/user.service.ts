import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
    return new DbResult({ data: [...db.userStorage] });
  }

  async findOne(id: string) {
    if (validate(id)) {
      const result = await db.userStorage.filter(
        (user: User) => user.id === id,
      );

      if (result.length > 0) {
        return new DbResult({ data: result[0] });
      }
      return new DbResult({
        errorText: ErrorMessage.RECORD_NOT_EXISTS,
      });
    }

    return new DbResult({ errorText: ErrorMessage.WRONG_UUID });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
