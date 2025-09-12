import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const registerUser = async (req, res) => {
  try {
    // Standardize on 'role' instead of 'accessLevel'
    const { username, password, role, team, employeeId } = req.body;

    // **FIX 1: Correct Validation**
    // Core fields that are always required.
    if (!username || !password || !employeeId || !role) {
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      password: hashedPassword,
      employeeId,
      // **FIX 2: Use 'role' consistently and ensure it's lowercase**
      role: role.toLowerCase(),
      // **IMPROVEMENT: Only set team if the role is 'user'**
      team: role.toLowerCase() === "user" ? team : null,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        role: user.role, // Use 'role' here
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
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      // **FIX 2: Use 'role' consistently in the JWT payload**
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role, // Use 'role' here
        team: user.team,
        employeeId: user.employeeId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout (This was already correct)
export const logoutUser = async (req, res) => {
  res.json({ message: "Logout successful (delete token on client)" });
};
