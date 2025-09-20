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

// Get logged-in user's tasks (only visible tasks)
export const getUserTasks = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;

    // Fetch visible tasks for the user
    const tasks = await Task.find({ employeeId, visible: { $ne: false } }).sort(
      { date: -1 }
    );

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const updateTaskRemark = async (req, res) => {
  try {
    const { taskId, remarkIndex } = req.params;
    const { status, minutes } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Update the specific remark
    if (task.remarks[remarkIndex]) {
      // Update minutes by adding to existing minutes
      if (minutes !== undefined) {
        task.remarks[remarkIndex].minutes += minutes;
      }
      // Do NOT update status in remark, use provided status for visibility
      // Update workDate timestamp for tracking
      task.remarks[remarkIndex].workDate = new Date();
    } else {
      return res.status(400).json({ message: "Remark not found" });
    }

    // Update visibility and task status if provided
    if (status !== undefined) {
      task.visible = status !== "Completed";
      task.status = status === "Completed" ? "Completed" : "Pending";
    } else {
      // Recalculate based on existing remark statuses
      const hasPendingRemark = task.remarks.some(
        (r) => r.status?.toLowerCase() !== "completed"
      );
      task.visible = hasPendingRemark;
      task.status = hasPendingRemark ? "Pending" : "Completed";
    }

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
