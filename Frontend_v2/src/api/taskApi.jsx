import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
export const createTask = (data) => API.post("/tasks/", data);
export const getUserTasks = () => API.get("/tasks/me");
export const getAdminTasks = (filters) =>
  API.get("/tasks/", { params: filters });
export const updateTaskRemark = (taskId, remarkId, data) =>
  API.put(`/tasks/${taskId}/remark/${remarkId}`, data);

export const getDailySummary = (data) => API.get("/tasks/report", data);
export const getProjectSummaryToday = (data) =>
  API.get("/tasks/ProjectSummaryToday", data);

export const fetchUserSuggestions = async (query) => {
  try {
    const response = await API.get("/tasks/search", { params: { q: query } });
    console.log("Fetched suggestions:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user suggestions:", error);
    return [];
  }
};
