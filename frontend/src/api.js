import axios from "axios";

const API = axios.create({
  baseURL: process.env.NODE_ENV === "production" 
    ? "https://skillswap-1-f4vs.onrender.com/api" 
    : "http://localhost:5000/api",
});

// attach token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
