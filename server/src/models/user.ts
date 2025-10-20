// src/models/user.ts

import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserRole } from '../types/User.types.ts'; // Assuming IUser is defined in this directory

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, 'Please add a username'],
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please use a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: 6,
            select: false, // Do not return password by default on queries
        },
        role: {
            type: String,
            enum: ['Agent', 'Buyer', 'Admin'] as UserRole[],
            default: 'Buyer', // Default role for new sign-ups
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Mongoose Pre-Save Hook: Hash the password before saving a new user or updating the password.
 */
UserSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) {
        return next();
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
});

/**
 * Instance Method: Compare input password with hashed password in the database.
 */
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
    // Note: We use bcrypt.compare on the string password and the hashed password
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = model<IUser>('User', UserSchema);

export default User;
