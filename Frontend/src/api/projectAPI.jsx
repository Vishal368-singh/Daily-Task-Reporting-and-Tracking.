import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/projects",
});

export const createProject = (data) => API.post("/project", data);
export const getProjects = () => API.get("/getProject");
