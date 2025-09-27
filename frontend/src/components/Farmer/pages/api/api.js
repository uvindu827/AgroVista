import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // Adjust your backend base URL if needed
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
