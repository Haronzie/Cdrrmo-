import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // pulled from Vite .env
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically if present
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const url = config.url || "";

  // Normalize endpoint check
  const skipAuth =
    url.includes("auth/login") ||
    url.includes("auth/register") ||
    url.includes("auth/refresh");

  if (!skipAuth) {
    const token = localStorage.getItem("access");
    if (token && config.headers) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  }

  // Handle file uploads - remove Content-Type for FormData
  if (config.data instanceof FormData) {
    delete (config.headers as any)["Content-Type"];
  }

  return config;
});

export default api;