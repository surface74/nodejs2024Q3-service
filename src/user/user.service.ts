import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DataService } from 'src/storage/data.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { UserResponse } from './entities/user-responce.entity';

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

    return new UserResponse(await this.dataService.createUser(user));
  }

  async findAll() {
    const users = (await this.dataService.findAllUsers()).map((user: User) => {
      return new UserResponse(user);
    });

    return users;
  }

  async findOne(id: string) {
    const user = await this.dataService.findOneUser(id);
    if (!user) {
      throw new NotFoundException();
    }

    return new UserResponse(user);
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.dataService.findOneUser(id);
    if (!user) {
      throw new NotFoundException();
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException();
    }

    user.password = updatePasswordDto.newPassword;
    user.updatedAt = Date.now();
    user.version += 1;
    await this.dataService.updateUser(user);

    return new UserResponse(user);
  }

  async remove(id: string) {
    await this.dataService.removeUser(id);
  }
}
