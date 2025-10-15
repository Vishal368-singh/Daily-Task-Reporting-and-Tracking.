import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const logout = () => API.post("/auth/logout");
export const fetchUsers = () => API.get("/auth/users");
