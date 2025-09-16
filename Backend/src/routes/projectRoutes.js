import express from "express";
import { createproject, getProject } from "../controllers/projectController.js";

const router = express.Router();
router.post("/", createproject);
router.get("/", getProject);

export default router;
