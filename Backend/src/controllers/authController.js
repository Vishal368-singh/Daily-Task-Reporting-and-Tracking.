import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const registerUser = async (req, res) => {
  try {
    const { username, password, role, email, mobileNo, team, employeeId } =
      req.body;

    // Core fields that are always required.
    if (!username || !password || !employeeId || !role || !email || !mobileNo) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // Team is only required if the role is 'user'.
    if (role.toLowerCase() === "user" && !team) {
      return res.status(400).json({ message: "Team is required for users" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { employeeId }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Employee ID already exists" });
    }

    const user = await User.create({
      username,
      password: password,
      employeeId,
      email,
      mobileNo,
      role: role.toLowerCase(),
      team: role.toLowerCase() === "user" ? team : null,
    });

    res.status(201).json({
      message: "Resource added successfully !",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        team: user.team,
        employeeId: user.employeeId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        team: user.team,
        employeeId: user.employeeId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout
export const logoutUser = async (req, res) => {
  res.json({ message: "Logout successful (delete token on client)" });
};
