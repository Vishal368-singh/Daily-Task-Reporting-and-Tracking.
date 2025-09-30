import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/sendreport",
});

export const sendReport = (payload) => API.post("/send-dashboard", payload);
