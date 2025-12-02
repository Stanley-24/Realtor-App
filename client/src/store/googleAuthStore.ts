import { create } from "zustand";
import { apiConfig } from "../config";
import {
  syncGoogleUserToAuthStore,
} from "../lib/googleOAuth.utils";

interface PendingGoogleUser {
  fullName: string;
  email: string;
  profilePicture: string;
  role?: string;
  idToken?: string; // Store Google ID token in state (not localStorage)
}

interface GoogleUser {
  id: string;
  fullName: string;
  email: string;
  profilePicture: string;
  role: string;
}

interface GoogleAuthState {
  loading: boolean;
  error: string | null;

  pendingGoogleUser: PendingGoogleUser | null;
  user: GoogleUser | null;

  googleLogin: (idToken: string) => Promise<string | undefined>;
  googleSignup: () => Promise<string | undefined>;
  setRoleForPendingUser: (role: string) => void;
}

export const useGoogleAuthStore = create<GoogleAuthState>((set, get) => ({
  loading: false,
  error: null,
  pendingGoogleUser: null,
  user: null,

  googleLogin: async (idToken: string) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`${apiConfig.API_URL}/api/v1/auth/google/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Network error" }));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Google login response:", data);

      if (data.status === "EXISTING_USER") {
        // Sync user to authStore - cookie is already set by backend
        syncGoogleUserToAuthStore(data.user);
        
        set({ 
          user: {
            id: data.user._id || data.user.id,
            fullName: data.user.fullName,
            email: data.user.email,
            profilePicture: data.user.profilePicture,
            role: data.user.role,
          }, 
          loading: false 
        });
        console.log("Redirecting to:", data.redirectUrl);
        return data.redirectUrl;
      }

      if (data.status === "NEW_USER") {
        // Store idToken in state for complete-signup flow
        set({
          pendingGoogleUser: {
            fullName: data.fullName,
            email: data.email,
            profilePicture: data.profilePicture,
            idToken: idToken, // Store in state, not localStorage
          },
          loading: false,
        });

        console.log("New user, redirecting to:", data.redirectUrl);
        return data.redirectUrl;
      }

      set({ loading: false, error: "Unexpected response from server" });
      return;
    } catch (error) {
      console.error("Google Login Error:", error);
      set({ error: error instanceof Error ? error.message : "Google Login failed", loading: false });
      return;
    }
  },

  googleSignup: async () => {
    const pending = get().pendingGoogleUser;

    if (!pending || !pending.role) {
      set({ error: "Role not selected" });
      return;
    }

    const idToken = pending.idToken?.trim();
    if (!idToken) {
      const message = "Your Google session expired. Please sign in again.";
      set({ error: message, loading: false, pendingGoogleUser: null });
      return;
    }

    set({ loading: true, error: null });

    try {
      const res = await fetch(`${apiConfig.API_URL}/api/v1/auth/google/complete-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          role: pending.role,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Network error" }));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.status === "SIGNUP_COMPLETE") {
        // Sync user to authStore - cookie is already set by backend
        syncGoogleUserToAuthStore(data.user);

        // Clear pending user data and keep a consistent local user shape
        set({
          user: {
            id: data.user._id || data.user.id,
            fullName: data.user.fullName,
            email: data.user.email,
            profilePicture: data.user.profilePicture,
            role: data.user.role,
          },
          pendingGoogleUser: null,
          loading: false,
        });
        return data.redirectUrl;
      }

      set({ loading: false });
      return;
    } catch (error) {
      console.error("Google Signup Error:", error);
      set({ error: "Google Signup failed", loading: false });
      return;
    }
  },

  setRoleForPendingUser: (role: string) => {
    set((state) => {
      if (!state.pendingGoogleUser) {
        return state;
      }
      return {
        pendingGoogleUser: {
          ...state.pendingGoogleUser,
          role,
        },
      };
    });
  },
}));
