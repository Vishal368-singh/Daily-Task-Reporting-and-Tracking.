import express from "express";
import { sendDashboardReport } from "../controllers/sendreportController.js";

const router = express.Router();
router.post("/send-dashboard", sendDashboardReport);

export default router;
