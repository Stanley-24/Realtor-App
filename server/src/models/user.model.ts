import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserRole } from '../types/User.types'; // Assuming IUser is defined in this directory

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
    profilePicture: {
      type: String,
      default: '', // ✅ starts empty, can be updated later
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
  if (!this.password) {
    throw new Error(
      'Password field not populated. Ensure the document is queried with .select("+password")'
    );
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = model<IUser>('User', UserSchema);

export default User;
