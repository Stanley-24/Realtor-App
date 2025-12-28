// src/lib/types.ts
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";
import type { ZodSchema } from "zod";

export const typedZodResolver = <
  TFieldValues extends FieldValues
>(
  schema: ZodSchema<TFieldValues>
): Resolver<TFieldValues> =>
  zodResolver(schema);


export interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  headline: string;
  about: string;
  location: string;
  role: string;
  verified: boolean;
  registrationYear: number;
  avatar: string;
}

export interface ProfileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile;
  onSave?: (updatedUser: UserProfile) => void;
}

export interface UserProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>, avatarFile?: File | null) => Promise<void>;
  setProfile: (profile: UserProfile) => void;
}