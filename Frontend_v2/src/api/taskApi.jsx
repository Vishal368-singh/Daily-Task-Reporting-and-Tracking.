import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach token to every request
API.interceptors.request.use((req) => {
  const token = sessionStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Tasks

export const createTask = (data) => API.post("/tasks/", data);
export const getUserTasks = () => API.get("/tasks/me");
export const getAdminTasks = (filters = {}) =>
  API.get("/tasks/", { params: filters });

// Update task remark
export const updateTaskRemark = (taskId, remarkId, data) =>
  API.put(`/tasks/${taskId}/remark/${remarkId}`, data);

export const getDailySummary = (filters = {}) =>
  API.get("/tasks/report", { params: filters });

export const getProjectSummaryToday = (filters = {}) =>
  API.get("/tasks/ProjectSummaryToday", { params: filters });

export const fetchUserSuggestions = async (query) => {
  try {
    const response = await API.get("/tasks/search", { params: { q: query } });
    return response.data;
  } catch (error) {
    console.error("Error fetching user suggestions:", error);
    return [];
  }
};
