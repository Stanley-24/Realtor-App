interface ApiConfig {
  API_URL: string;
  VITE_GOOGLE_CLIENT_ID: string;
  ICON_URL: string;
}


export const apiConfig: ApiConfig = {
   API_URL :  import.meta.env.VITE_API_URL || "http://localhost:5500",
   VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || (() => {
     throw new Error('VITE_GOOGLE_CLIENT_ID environment variable is required');
   })(),
   ICON_URL: import.meta.env.VITE_ICON_URL || (() => {
     throw new Error('ICON_URL environment variable is required');
   })(),
}