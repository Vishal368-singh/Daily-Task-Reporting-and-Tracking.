import express from "express";
import {
  createTask,
  updateTaskRemark,
  getUserTasks,
  getTasks,
  searchEmployee,
  getDailySummary,
  getProjectSummaryToday,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", protect, createTask); // create
router.put("/:taskId/remark/:remarkId", protect, updateTaskRemark);
// update remark
router.get("/me", protect, getUserTasks); // user's visible tasks
router.get("/", protect, getTasks); // admin list (filters)

router.get("/search", searchEmployee); // search employee by name or ID
router.get("/report", getDailySummary); // daily report)
router.get("/ProjectSummaryToday", getProjectSummaryToday); // daily summary                   
export default router;
