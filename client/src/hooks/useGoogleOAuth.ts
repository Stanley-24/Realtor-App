import { useEffect, useState } from "react";
import { apiConfig } from "../config";
import type { GoogleAuthResponse } from "../lib/googleOAuth.utils";


/**
 * Custom hook to initialize Google OAuth
 * Returns isReady state and a function to trigger sign-in
 */
export const useGoogleOAuth = (
  callback: (response: GoogleAuthResponse) => void,
  buttonElementRef: React.RefObject<HTMLDivElement | null>
): { isReady: boolean; triggerSignIn: () => void } => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let checkInterval: ReturnType<typeof setInterval> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let isMounted = true;
    
    const initializeGSI = () => {
      if (!window.google?.accounts?.id) {
        // Script not loaded yet, check again
        setTimeout(initializeGSI, 100);
        return;
      }

      try {
        // Initialize Google Sign-In
        window.google.accounts.id.initialize({
          client_id: apiConfig.VITE_GOOGLE_CLIENT_ID,
          callback,
        });

        // Render button in a hidden container
        if (buttonElementRef.current) {
          buttonElementRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(buttonElementRef.current, {
            theme: "outline",
            size: "large",
            width: 400,
            type: "standard",
          });
        }

        if (isMounted) setIsReady(true);
      } catch (error) {
        console.error("Failed to initialize Google Sign-In:", error);
      }
    };

    // Check if script is already loaded (from index.html)
    if (window.google?.accounts?.id) {
      initializeGSI();
    } else {
      // Script might be loading, wait for it or load it
      checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          if (checkInterval) clearInterval(checkInterval);
          initializeGSI();
        }
      }, 100);

      // Also try to load script if not present
      const existingScript = document.querySelector(
        'script[src*="accounts.google.com/gsi/client"]'
      );
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (checkInterval) clearInterval(checkInterval);
          initializeGSI();
        };
        document.body.appendChild(script);
      }

      // Cleanup interval after 5 seconds
        timeoutId = setTimeout(() => {
        if (checkInterval) clearInterval(checkInterval);
      }, 5000);
    }

    return () => {
      isMounted = false;
      if (checkInterval) clearInterval(checkInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };

  }, [callback, buttonElementRef]);

  const triggerSignIn = () => {
    if (buttonElementRef.current) {
      const googleButton = buttonElementRef.current.querySelector('div[role="button"]') as HTMLElement;
      if (googleButton) {
        googleButton.click();
      } else {
        // Fallback to prompt if button not found
        if (window.google?.accounts?.id?.prompt) {
          window.google.accounts.id.prompt();
        }
      }
    }
  };

  return { isReady, triggerSignIn };
};

/**
 * Trigger Google Sign-In prompt
 * Note: prompt() shows the One Tap prompt. For button-based sign-in, we need to use renderButton or One Tap
 */
export const triggerGoogleSignIn = (): void => {
  if (window.google?.accounts?.id) {
    try {
      // prompt() is for One Tap, but we might need to check if it's available
      if (typeof window.google.accounts.id.prompt === "function") {
        window.google.accounts.id.prompt();
      } else {
        console.error("Google prompt() method not available");
      }
    } catch (error) {
      console.error("Failed to prompt Google Sign-In:", error);
    }
  } else {
    console.warn("Google Sign-In not ready yet");
  }
};

