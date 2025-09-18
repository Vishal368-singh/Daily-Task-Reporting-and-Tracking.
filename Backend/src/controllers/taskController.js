import Task from "../models/Task.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { user_name, project, module, date, activity_lead, team, remarks } =
      req.body;
    const employeeId = req.user.employeeId;

    if (!project || !module || !date || !employeeId) {
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

// Get logged-in user's tasks (only tasks with pending remarks)
export const getUserTasks = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;

    // Fetch all tasks for the user
    const tasks = await Task.find({ employeeId }).sort({ date: -1 });

    // Only include tasks with at least one non-completed remark
    const pendingTasks = tasks
      .map((task) => {
        // Filter remarks: keep only non-completed
        const pendingRemarks = task.remarks.filter(
          (remark) => remark.status !== "Completed"
        );

        if (pendingRemarks.length === 0) return null; // skip fully completed tasks

        return {
          ...task.toObject(),
          remarks: pendingRemarks, // only pending/incomplete remarks
        };
      })
      .filter(Boolean); // remove nulls

    res.status(200).json(pendingTasks);
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Update a single remark in a task
export const updateTaskRemark = async (req, res) => {
  try {
    const { taskId, remarkIndex } = req.params;
    const { text, status, minutes } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Update the specific remark
    if (task.remarks[remarkIndex]) {
      if (text !== undefined) task.remarks[remarkIndex].text = text;
      if (status !== undefined) task.remarks[remarkIndex].status = status;
      if (minutes !== undefined) task.remarks[remarkIndex].minutes = minutes;
    } else {
      return res.status(400).json({ message: "Remark not found" });
    }

    // Recalculate task-level visibility & status
    const hasPendingRemark = task.remarks.some(
      (r) => r.status?.toLowerCase() !== "completed"
    );
    task.visible = hasPendingRemark;
    task.status = hasPendingRemark ? "Pending" : "Completed";

    await task.save();
    res.status(200).json({ message: "Remark updated", task });
  } catch (error) {
    console.error("Error updating remark:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Admin: get all tasks (optional filters)
export const getTasks = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const { date, employeeId, team, status } = req.query;

    const filter = {};
    if (date) filter.date = new Date(date);
    if (employeeId) filter.employeeId = employeeId;
    if (team) filter.team = team;
    if (status) filter.status = status;

    const tasks = await Task.find(filter).sort({ date: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
