import Task from "../models/Task.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    const {
      user_name,
      project,
      module,
      date,
      activity_lead,
      team,
      moduleRemarks,
    } = req.body;
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
      moduleRemarks,
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

export const getUserTasks = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;

    const tasks = await Task.find({ employeeId }).sort({ date: -1 }).lean();

    const tasksWithPendingRemarks = tasks
      .map((task) => {
        const pendingRemarks = task.remarks.filter(
          (r) => r.finalStatus === "In Progress"
        );
        return { ...task, remarks: pendingRemarks };
      })
      .filter((task) => task.remarks.length > 0);

    res.status(200).json(tasksWithPendingRemarks);
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Update a task remark
export const updateTaskRemark = async (req, res) => {
  try {
    const { taskId, remarkId } = req.params;
    const { visible, minutes, status } = req.body;

    console.log("Update request:", {
      taskId,
      remarkId,
      visible,
      minutes,
      status,
    });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Find remark by _id
    const remark = task.remarks.id(remarkId);
    if (!remark) return res.status(404).json({ message: "Remark not found" });
    console.log("Found remark:", remark);

    // Update fields
    if (status) {
      remark.finalStatus = status;
      remark.visible = status !== "Completed";
    }

    if (minutes !== undefined) {
      remark.totalRemarkDuration += Number(minutes);
    }

    remark.completedAt =
      status === "Completed" ? new Date() : remark.completedAt;
    remark.workDate = new Date();

    console.log("Updated remark:", remark);

    await task.save();

    res.status(200).json({ message: "Remark updated", task });
  } catch (error) {
    console.error("Error updating remark:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Admin: get all tasks
export const getTasks = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const { date, employeeId, team, status, finalStatus } = req.query;

    const filter = {};
    if (date) filter.date = new Date(date);
    if (employeeId) filter.employeeId = employeeId;
    if (team) filter.team = team;
    if (status) filter.status = status;
    if (finalStatus) filter.finalStatus = finalStatus;
    let tasks = [];

    if (Object.keys(filter).length === 0) {
      tasks = await Task.find(filter).sort({ date: -1 });
    } else {
      tasks = await Task.find(filter).sort({ date: -1 });
    }
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const searchEmployee = async (req, res) => {
  const q = req.query.q || "";
  if (!q.trim()) return res.json([]);

  try {
    const escaped = escapeRegex(q);

    const results = await Task.find({
      $or: [
        { user_name: { $regex: escaped, $options: "i" } },
        { employeeId: { $regex: escaped, $options: "i" } },
      ],
    })
      .limit(10)
      .select("user_name employeeId");

    // remove duplicates
    const unique = new Map();
    results.forEach((t) => {
      unique.set(t.employeeId, {
        user_name: t.user_name,
        employeeId: t.employeeId,
      });
    });

    res.json([...unique.values()]);
  } catch (err) {
    console.error("Error searching employees:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Escape special characters for MongoDB regex
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
