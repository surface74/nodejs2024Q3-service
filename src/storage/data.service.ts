import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/entities/user.entity';
import * as users from './fake-data/users.json';

class DataService {
  static instance: DataService = new DataService();

  public userStorage: User[] = new Array<User>();

  private constructor() {
    if (!DataService.instance) DataService.instance = this;

    this.fillUsers();
  }

  public static getInstance(): DataService {
    return DataService.instance;
  }

  private fillUsers(): void {
    users.forEach((user: Pick<User, 'login' | 'password'>) => {
      const { login, password } = user;
      const newUser = {
        id: uuidv4(),
        login,
        password,
        version: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      this.userStorage.push(newUser);
    });
  }
}

export default DataService.getInstance();
