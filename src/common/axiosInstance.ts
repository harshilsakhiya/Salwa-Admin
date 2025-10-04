import axios from "axios";
import { envs } from "./envs";

const axiosInstance = axios.create({
  baseURL: envs?.VITE_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  config.headers["Authorization"] = `Bearer ${localStorage.getItem(
    "authToken"
  )}`;
  config.headers["Content-Type"] =
    config.headers["Content-Type"] ?? "application/json";
  return config;
});

export default axiosInstance;
