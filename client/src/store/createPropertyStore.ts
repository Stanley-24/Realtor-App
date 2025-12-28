// src/stores/createPropertyStore.ts
import { create } from "zustand";
import { apiConfig } from "@/config";

interface CreatePropertyState {
  isLoading: boolean;
  success: boolean;
  error: string | null;

  createProperty: (formData: FormData) => Promise<void>;
  reset: () => void;
}

// Properly typed error without 'any'
type ApiError = {
  message?: string;
};

export const useCreatePropertyStore = create<CreatePropertyState>((set) => ({
  isLoading: false,
  success: false,
  error: null,

  createProperty: async (formData: FormData) => {
    set({ isLoading: true, error: null, success: false });

    try {
      const response = await fetch(`${apiConfig.API_URL}/api/v1/properties/createProperty`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        // Type the error properly
        const apiError = data as ApiError;
        throw new Error(apiError.message || "Failed to create property");
      }

      set({ success: true, isLoading: false });
    } catch (err) {
      // Type assertion instead of 'any'
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";

      set({ error: errorMessage, isLoading: false });
    }
  },

  reset: () => {
    set({ success: false, error: null, isLoading: false });
  },
}));