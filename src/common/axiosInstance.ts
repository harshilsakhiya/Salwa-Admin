import axios from "axios";
// import { envs } from "./envs";

const axiosInstance = axios.create({
  baseURL: "https://apisalwa.rushkarprojects.in/api/",
});

axiosInstance.interceptors.request.use((config) => {
  config.headers["Authorization"] = `${localStorage.getItem("authToken")}`;
  config.headers["Content-Type"] =
    config.headers["Content-Type"] ?? "application/json";
  return config;
});

export default axiosInstance;
