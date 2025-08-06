import axios from 'axios';

// This apiClient is used by all other services (authService, cvService, etc.)
const apiClient = axios.create({
  // Vite exposes environment variables on the `import.meta.env` object.
  // This line reads the URL from your .env file.
  baseURL: import.meta.env.VITE_API_URL, 
});

export default apiClient;