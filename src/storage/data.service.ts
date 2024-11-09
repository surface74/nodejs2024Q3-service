import { User } from 'src/user/entities/user.entity';

class DataService {
  static instance: DataService = new DataService();

  public userStorage: User[] = new Array<User>();

  private constructor() {
    if (!DataService.instance) DataService.instance = this;
  }

  public static getInstance(): DataService {
    return DataService.instance;
  }
}

export default DataService.getInstance();
