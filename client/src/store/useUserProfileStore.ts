// src/stores/useUserProfileStore.ts

import { create } from "zustand";
import { apiConfig } from "@/config";
import type { UserProfileState } from "@/lib/types";




export const useUserProfileStore = create<UserProfileState>((set) => ({
  profile: null,
  loading: false,
  error: null,

  setProfile: (profile) => set({ profile }),

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiConfig.API_URL}/api/v1/user/profile`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      set({ profile: data.profile, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      set({ error: message, loading: false });
    }
  },

  updateProfile: async (updates, avatarFile = null) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string);
        }
      });

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await fetch(`${apiConfig.API_URL}/api/v1/user/profile`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await res.json();
      set({ profile: data.profile, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed";
      set({ error: message, loading: false });
      throw err; // Re-throw so UI can handle (e.g. toast)
    }
  },
}));