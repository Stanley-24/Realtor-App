import { useAuthStore } from "../store/authStore";

/**
 * Google OAuth Types
 */
export interface GoogleAuthResponse {
  credential: string;
}

export interface GoogleAuthConfig {
  client_id: string;
  callback: (response: GoogleAuthResponse) => void;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: GoogleAuthConfig) => void;
          prompt: () => void;
          renderButton: (
            element: HTMLElement,
            config?: {
              theme?: string;
              size?: string;
              width?: number;
              type?: string;
            }
          ) => void;
        };
      };
    };
  }
}

/**
 * Sync Google user to authStore for ProtectedRoute compatibility
 */
export const syncGoogleUserToAuthStore = (userData: {
  _id?: string;
  id?: string;
  fullName: string;
  email: string;
  role: string;
}) => {
  const authUser = {
    _id: userData._id || userData.id || "",
    fullName: userData.fullName,
    email: userData.email,
    role: userData.role.toLowerCase(), // Normalize role to match ProtectedRoute format
  };
  useAuthStore.setState({ user: authUser, initializing: false });
};

/**
 * Store token in localStorage
 */
export const storeAuthToken = (token: string | null | undefined) => {
  if (token) {
    localStorage.setItem("token", token);
  }
};

/**
 * Store Google ID token in localStorage
 */
export const storeGoogleIdToken = (idToken: string) => {
  try {
    localStorage.setItem("google_id_token", idToken);
  } catch (error) {
    console.error("Failed to store Google ID token:", error);
  }
};

/**
 * Get Google ID token from localStorage
 */
export const getGoogleIdToken = (): string | null => {
  return localStorage.getItem("google_id_token");
};

