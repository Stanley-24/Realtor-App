interface ApiConfig {
  API_URL: string;
}


export const apiConfig: ApiConfig = {
   API_URL :  import.meta.env.VITE_API_URL || "http://localhost:5000"
}