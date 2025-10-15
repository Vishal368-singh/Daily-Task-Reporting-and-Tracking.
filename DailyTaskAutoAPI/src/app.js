import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import home from "./routes/authRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
// import "./controllers/autoReportMailer.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: false,
  })
);

// Increase JSON & URL-encoded payload limits
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api", home);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);

export default app;
