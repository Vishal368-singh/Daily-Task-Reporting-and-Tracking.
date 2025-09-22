import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/tasks",
});

// Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`Bearer ${token}`);
  return req;
});

// Tasks
export const createTask = (data) => API.post("/", data); // user create
export const getUserTasks = () => API.get("/me"); // get only visible tasks
export const getAdminTasks = (filters) => API.get("/", { params: filters }); // admin with filters
export const updateTaskRemark = (taskId, remarkId, data) =>
  API.put(`/${taskId}/remark/${remarkId}`, data);
