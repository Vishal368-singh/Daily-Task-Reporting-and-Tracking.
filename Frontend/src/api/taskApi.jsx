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
export const createTask = (data) => API.post("/", data);
export const getUserTasks = () => API.get("/me");
export const getAdminTasks = (filters) => API.get("/", { params: filters });
export const updateTaskRemark = (taskId, remarkId, data) =>
  API.put(`/${taskId}/remark/${remarkId}`, data);


export const getDailySummary = (data) =>
  API.get("/report", data);
export const getProjectSummaryToday = (data) =>
  API.get("/ProjectSummaryToday", data);


export const fetchUserSuggestions = async (query) => {
  try {
    const response = await API.get("/search", { params: { q: query } });
    console.log("Fetched suggestions:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user suggestions:", error);
    return [];
  }
};
