import express from "express";
import {
  createTask,
  getTasks,
  getUserTasks,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/tasks
// @desc    Create a new daily task
// @access  Private
router.post("/tasks", protect, createTask);
router.get("/getTasks", protect, getTasks);
router.get("/getUserTasks", protect, getUserTasks);

export default router;
