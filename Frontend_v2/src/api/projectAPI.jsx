import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL,
});

export const createProject = (data) => API.post("/projects/project", data);
export const getProjects = () => API.get("/projects/getProject");
