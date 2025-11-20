import { create } from "zustand";
import { apiConfig } from "../config";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  initializing: boolean; // Track if initial auth check is in progress
  error: string | null;

  login: (email: string, password: string) => Promise<string | undefined>;
  signup: (fullName: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;

  // New: check current session on app load
  checkAuth: () => Promise<void>;
}


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initializing: true, // Start as true, will be set to false after first check
  error: null,

  // LOGIN
  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiConfig.API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Include cookies for JWT
      });

      const data = await res.json();

      if (!res.ok) {
        set({ error: data.message || "Login failed", loading: false });
        return;
      }

      // Normalize role
      const normalizedUser = { ...data.user, role: data.user.role.toLowerCase() };
      set({ user: normalizedUser, loading: false });

      return data.redirectUrl;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      set({ error: message, loading: false });
      return;
    }
  },

  // SIGNUP
  signup: async (fullName, email, password, role) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${apiConfig.API_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, role }),
        credentials: "include", // Include cookies for JWT
      });

      const data = await res.json();

      if (!res.ok) {
        return set({ error: data.message || "Signup failed", loading: false });
      }

      // Normalize role
      const normalizedUser = { ...data.user, role: data.user.role.toLowerCase() };
      set({ user: normalizedUser, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      set({ error: message, loading: false });
    }
  },

  // LOGOUT
  logout: async () => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`${apiConfig.API_URL}/api/v1/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        return set({ error: data.message || "Logout failed", loading: false });
      }

      set({ user: null, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      set({ error: message, loading: false });
    }
  },

  // CHECK AUTH (new)
  checkAuth: async () => {
    set({ initializing: true, error: null });
    try {
      const res = await fetch(`${apiConfig.API_URL}/api/v1/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      // If backend returns 204 or empty body when not authenticated, handle accordingly
      let data: { user?: User } | null = null;
      try {
        data = (await res.json()) as { user?: User } | null;
      } catch {
        data = null;
      }
  
      if (!res.ok || !data?.user) {
        // Not authenticated
        set({ user: null, initializing: false, loading: false });
        return;
      }

      const normalizedUser = { ...data.user, role: data.user.role.toLowerCase() };
      set({ user: normalizedUser, initializing: false, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      set({ error: message, initializing: false, loading: false, user: null });
    }
  },
}));
