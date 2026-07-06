import axios from "axios";

const resolveApiBaseURL = () => {
  const raw = (import.meta.env.VITE_API_URL || "").trim();
  if (!raw) return "http://localhost:5000/api";

  const normalized = raw.replace(/\/+$/, "");
  if (/\/api$/i.test(normalized)) return normalized;
  return `${normalized}/api`;
};

const api = axios.create({
  baseURL: resolveApiBaseURL(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
