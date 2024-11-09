import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import db from 'src/storage/data.service';
import { validate } from 'uuid';
import { ErrorMessage } from 'src/storage/types/error-message.enum';
import { Result } from 'src/storage/types/result.types';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    return new Result({ data: [...db.userStorage] });
  }

  async findOne(id: string) {
    if (validate(id)) {
      const result = await db.userStorage.filter(
        (user: User) => user.id === id,
      );

      if (result.length > 0) {
        return new Result({ data: result[0] });
      }
      return new Result({
        isError: true,
        errorText: ErrorMessage.RecordNotExist,
      });
    }

    return new Result({ isError: true, errorText: ErrorMessage.WrongUUID });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
