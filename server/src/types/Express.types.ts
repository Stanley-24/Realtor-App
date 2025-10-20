// src/types/Express.types.ts

import { Request } from 'express';
import { Types } from 'mongoose';
import { UserRole } from './User.types.ts';

// Data contained within the JWT payload after verification
export interface IJwtPayload {
    id: Types.ObjectId;
    email: string;
    role: UserRole;
}

// Extends the standard Express Request object to include the verified user data
export interface IAuthRequest extends Request {
    user?: IJwtPayload; // The decoded user information will be attached here by auth middleware
}