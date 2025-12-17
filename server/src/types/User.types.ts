import { Document, Types,  } from 'mongoose';
import mongoose from 'mongoose';

export type UserRole = 'Agent' | 'Buyer' | 'Admin';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
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
  authProvider: 'local' | 'google';
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  // Methods
  matchPassword(enteredPassword: string): Promise<boolean>;
  generatePasswordResetToken(): string;
}

export interface IUserRegisterBody {
  fullName: string;
  email: string;
  password: string;
  role?: UserRole;
  profilePicture?: string;
}
