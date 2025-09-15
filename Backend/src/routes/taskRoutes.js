import express from "express";
import {
  createTask,
  getTasks
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/tasks
// @desc    Create a new daily task
// @access  Private
router.post("/", protect, createTask);
router.get("/", protect, getTasks);

export default router;
