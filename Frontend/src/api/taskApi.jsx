import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const createTask = (data) => API.post("/tasks", data);
export const getTasks = () => API.get("/getTasks");
export const getUserTasks = () => API.get("/getUserTasks");
