// src/store/lostPassStore.ts
import { create } from "zustand";
import { apiConfig } from "../config";

interface PasswordResetState {
  loading: boolean;
  error: string | null;
  success: string | null;

  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  clearMessages: () => void;
}

export const usePasswordResetStore = create<PasswordResetState>((set) => ({
  loading: false,
  error: null,
  success: null,

  forgotPassword: async (email: string) => {
    set({ loading: true, error: null, success: null });
    try {
      const res = await fetch(`${apiConfig.API_URL}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        set({
          error: data.message || "Failed to send reset link",
          loading: false,
        });
        return;
      }

      set({
        success: data.message || "If an account exists, a reset link has been sent to your email.",
        loading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error. Please try again.";
      set({ error: message, loading: false });
    }
  },

  resetPassword: async (token: string, password: string) => {
    set({ loading: true, error: null, success: null });
    try {
      const res = await fetch(`${apiConfig.API_URL}/api/v1/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword: password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        set({
          error: data.message || "Failed to reset password",
          loading: false,
        });
        return;
      }

      set({
        success: data.message || "Password successfully reset! You can now log in.",
        loading: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error. Please try again.";
      set({ error: message, loading: false });
    }
  },

  clearMessages: () => set({ error: null, success: null }),
}));