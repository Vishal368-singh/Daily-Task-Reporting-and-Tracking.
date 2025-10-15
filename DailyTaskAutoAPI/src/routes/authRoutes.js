import express from "express";
import {
  home,
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/", home);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/users", getUsers);

export default router;
