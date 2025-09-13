import express from "express";
import { createTask } from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/tasks
// @desc    Create a new daily task
// @access  Private
router.post("/", protect, createTask);

export default router;