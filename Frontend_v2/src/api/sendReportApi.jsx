import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ,
});

export const sendReport = (payload) => API.post("/sendreport/send-dashboard", payload);
