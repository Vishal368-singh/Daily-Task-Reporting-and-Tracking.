import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const {
      user_name,
      project,
      module,
      status,
      date,
      activity_lead,
      team,
      remarks
    } = req.body;
    
    // Get the user ID from the authenticated user (added by the 'protect' middleware)
    const userId = req.user.id; 

    // Basic validation
    if (!project || !module || !status || !date || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newTask = new Task({
      user_name,
      project,
      module,
      status,
      date,
      activity_lead,
      team,
      remarks,
      userId
    });

    await newTask.save();
    res.status(201).json({ message: "Task created successfully", task: newTask });

  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};