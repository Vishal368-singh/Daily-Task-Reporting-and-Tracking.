import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const {
      user_name,
      project,
      module,
      date,
      activity_lead,
      team,
      remarks,
    } = req.body;

    const employeeId = req.user.employeeId;

    if (!project || !module  || !date || !employeeId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newTask = new Task({
      user_name,
      project,
      module,
      date,
      activity_lead,
      team,
      remarks,
      employeeId, 
    });

    await newTask.save();
    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    // Only allow admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    // Fetch all tasks
    const tasks = await Task.find();

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching all tasks:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
