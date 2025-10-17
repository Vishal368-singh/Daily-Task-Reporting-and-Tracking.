import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const home = async (req, res) => {
  res.json({ message: "API start running..." });
};

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

    // Basic format validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!/^\d{10}$/.test(mobileNo)) {
      return res.status(400).json({ message: "Invalid mobile number" });
    }

    const existingUser = await User.findOne({
      $or: [{ username: username.trim() }, { employeeId: employeeId.trim() }],
    });

    // --- Check if user already exists
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or Employee ID already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      username: username.trim(),
      password: hashedPassword,
      employeeId: employeeId.trim(),
      email: email.trim(),
      mobileNo: mobileNo.trim(),
      role: role.toLowerCase(),
      team: role.toLowerCase() === "user" ? team?.trim() : null,
    };
    const user = await User.create(userData);

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

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const user = await User.findOne({ username: username.trim() });

    //  Check if user is active
    if (user.isActive === false) {
      return res
        .status(403)
        .json({ success: false, message: "User is inactive. Contact admin." });
    }
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        team: user.team,
        employeeId: user.employeeId,
        isActive: user.isActive,
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

//Get Users Table
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ isActive: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { employeeId, newPassword } = req.body;

    if (!employeeId || !newPassword) {
      return res
        .status(400)
        .json({ message: "Employee ID and new password are required" });
    }

    const user = await User.findOne({ employeeId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate({ employeeId }, { password: hashedPassword });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit User table
export const editUser = async (req, res) => {
  try {
    const { username, password, employeeId, role, team, email, mobileNo } =
      req.body;

    // Validate required field
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    // Check if user exists
    const user = await User.findOne({ employeeId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare updated fields dynamically
    const updatedData = {};
    if (username) updatedData.username = username;

    // Only update password if provided
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedData.password = hashedPassword;
    }

    if (role) updatedData.role = role;
    if (team) updatedData.team = team;
    if (email) updatedData.email = email;
    if (mobileNo) updatedData.mobileNo = mobileNo;
    updatedData.isActive = user.isActive;

    // Update user in DB
    const updatedUser = await User.findOneAndUpdate(
      { employeeId },
      { $set: updatedData },
      { new: true }
    );

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const isActive = async (req, res) => {
  try {
    const { employeeId, isActive } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID are required" });
    }

    const user = await User.findOne({ employeeId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findOneAndUpdate({ employeeId }, { isActive: isActive });

    res.json({ message: "Employee status changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
