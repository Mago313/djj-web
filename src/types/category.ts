import { IUser } from './admin';

export type Category = {
  card: string;
  price: number;
};

export type Categories = Category[];

export type Appointment = {
  cards: string[];
  dateTime: string;
  price: number;
  createdAt: string;
  _id: string;
  name: string;
  phone: string;
  updatedAt: string;
  user: IUser;
};
