import express from "express";
import { createproject, getProject } from "../controllers/projectController.js";

const router = express.Router();
router.post("/project", createproject);
router.get("/getProject", getProject);

export default router;
