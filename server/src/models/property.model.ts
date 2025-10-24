import { Schema, model } from 'mongoose';
import { IProperty } from '../types/Property.types';

const PropertySchema = new Schema<IProperty>(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [1, 'Price must be a positive number'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    bedrooms: {
      type: Number,
      default: 0,
      min: [0, 'Bedrooms must be non-negative'],
    },
    bathrooms: {
      type: Number,
      default: 0,
      min: [0, 'Bathrooms must be non-negative'],
    },
    squareFootage: {
      type: Number,
      default: 0,
      min: [0, 'Square footage must be non-negative'],
    },
    type: {
      type: String,
      enum: ['House', 'Apartment', 'Land', 'Commercial', 'Other'],
      default: 'House',
    },
    status: {
      type: String,
      enum: ['Available', 'Under Contract', 'Sold', 'Rented'],
      default: 'Available',
    },
    images: {
      type: [String],
      default: [],
    },
    agent: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Every listing must be linked to an Agent
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: index for faster searches (location + price)
PropertySchema.index({ location: 1, price: 1 });

const Property = model<IProperty>('Property', PropertySchema);

export default Property;
