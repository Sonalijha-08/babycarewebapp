import axios from "axios";

let baseUrl = import.meta.env.VITE_API_BASE_URL || "https://babycarewebapp-production.up.railway.app/api", data;
if (!baseUrl.endsWith("/api")) {
  baseUrl = baseUrl.replace(/\/$/, "") + "/api";
}

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
