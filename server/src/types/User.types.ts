// src/types/User.types.ts

import { Document } from 'mongoose';

// Define the available roles for authorization
export type UserRole = 'Agent' | 'Buyer' | 'Admin';

// Interface for the Mongoose Document (what is stored in MongoDB)
export interface IUser extends Document {
    fullName: string;
    email: string;
    password?: string; // Hashed password is required for local users
    role: UserRole;
    isVerified: boolean;
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Interface for User data sent in the request body during registration
export interface IUserRegisterBody {
    fullName: string;
    email: string;
    profilePicture?: string;
    password?: string;
    role: UserRole;

}