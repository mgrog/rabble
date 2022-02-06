import { User } from './user.interface';

export interface Room {
  id: number;
  title: string;
  users: User[];
}
