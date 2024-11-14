import { IDataEntity } from 'src/database/types/data-entity.interface';

export interface IUser extends IDataEntity {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}
