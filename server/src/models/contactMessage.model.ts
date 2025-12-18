import { Schema, model, Document } from 'mongoose';

export interface IContactMessage extends Document {
  fullName: string;
  email: string;
  message: string;
  createdAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please use a valid email address',
      ],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      minlength: [10, 'Message must be at least 10 characters'],
    },
  },
  { timestamps: true }
);

const ContactMessage = model<IContactMessage>('ContactMessage', ContactMessageSchema);

export default ContactMessage;