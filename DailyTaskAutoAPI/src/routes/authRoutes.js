import express from "express";
import {
  home,
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
  changePassword,
  editUser,
  isActive,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/", home);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/users", getUsers);
router.post("/changePassword", changePassword);
router.post("/editUser", editUser);
router.post("/isActive", isActive);

export default router;
