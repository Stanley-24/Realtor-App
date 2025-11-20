import { Document, Types } from 'mongoose';

export type UserRole = 'Agent' | 'Buyer' | 'Admin';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
  isVerified: boolean;
  profilePicture?: string;
  listings?: Types.ObjectId[]; // References to Property listings
  chats?: Types.ObjectId[]; // References to Chat model
  createdAt: Date;
  updatedAt: Date;

  matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface IUserRegisterBody {
  fullName: string;
  email: string;
  password: string;
  role?: UserRole;
  profilePicture?: string;
}
