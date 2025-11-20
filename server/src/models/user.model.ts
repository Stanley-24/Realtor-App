import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserRole } from '../types/User.types';

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Please add a Full Name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please use a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['Agent', 'Buyer', 'Admin'] as UserRole[],
      default: 'Buyer',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: '',
    },

    // ✅ References
    listings: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Property', // Will be connected to Property model
      },
    ],
    chats: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Chat', // Will be connected to Chat model
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * Hash password before saving the user
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt);
  next();
});

/**
 * Compare entered password with hashed password
 */
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  if (!this.password) {
    throw new Error(
      'Password field not populated. Ensure the document is queried with .select("+password")'
    );
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = model<IUser>('User', UserSchema);

export default User;
