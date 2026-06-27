import axios from "axios";

// VITE_API_BASE_URL must be set in the Vercel dashboard for production builds.
// Local dev: set in frontend/.env
// Fallback: Render backend URL
const baseURL =
  import.meta.env.VITE_API_BASE_URL || "https://babycarewebapp.onrender.com/api";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
