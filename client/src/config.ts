interface ApiConfig {
  API_URL: string;
  VITE_GOOGLE_CLIENT_ID: string;
}


export const apiConfig: ApiConfig = {
   API_URL :  import.meta.env.VITE_API_URL || "http://localhost:5500",
   VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || (() => {
     throw new Error('VITE_GOOGLE_CLIENT_ID environment variable is required');
   })(),
}