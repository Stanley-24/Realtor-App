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
  if (!userData._id && !userData.id) {
   throw new Error("User data must contain either _id or id");
  }
  
   const authUser = {
     _id: userData._id || userData.id || "",
     fullName: userData.fullName,
     email: userData.email,
    role: userData.role?.toLowerCase() ?? "user", 
   };
   useAuthStore.setState({ user: authUser, initializing: false });
 };


