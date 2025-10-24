import { Document, Types } from 'mongoose';

// --- Enums ---
export type PropertyType = 'House' | 'Apartment' | 'Land' | 'Commercial' | 'Other';
export type ListingStatus = 'Available' | 'Under Contract' | 'Sold' | 'Rented';

// --- Property Document Interface ---
export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  type: PropertyType;
  status: ListingStatus;
  images: string[]; // Array of Cloudinary URLs
  agent: Types.ObjectId; // Refers to User model (Agent)
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// --- Request Body Interface ---
export interface IPropertyRequestBody {
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  type: PropertyType;
  status?: ListingStatus;
  images?: string[];
  isFeatured?: boolean; // ✅ Added field (optional)
}
