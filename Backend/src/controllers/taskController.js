import Task from "../models/Task.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    const {
      user_name,
      projects,
      modules,
      date,
      activity_leads,
      team,
      moduleRemarks,
    } = req.body;
    const employeeId = req.user.employeeId;

    if (!projects || !modules || !date || !employeeId || !activity_leads) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newTask = new Task({
      user_name,
      projects,
      modules,
      date,
      activity_leads,
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
    const { minutes, status } = req.body;

    console.log("Update request:", {
      taskId,
      remarkId,
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
      remark.status = status;
      remark.finalStatus = status;
    }

    if (minutes !== undefined) {
      remark.minutes += Number(minutes);
    }

    remark.completedAt =
      status === "Completed" ? new Date() : remark.completedAt;
    remark.onHoldAt = status === "On Hold" ? new Date() : remark.onHoldAt;
    remark.workDate = new Date();

    console.log("Updated remark:", remark);

    // Ensure all remarks have required fields to prevent validation errors
    task.remarks.forEach((r) => {
      if (!r.projectName) {
        r.projectName =
          task.projects && task.projects.length > 0
            ? task.projects[0]
            : task.project || "Unknown";
      }
      if (!r.moduleName) {
        r.moduleName =
          task.modules && task.modules.length > 0
            ? task.modules[0]
            : task.module || "Unknown";
      }
      if (!r.text) {
        r.text = "No description provided";
      }
    });

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

// Daily summary report (grouped by date, employee, project for email)
export const getDailySummary = async (req, res) => {
  try {
    const today = new Date();

    // start of today (00:00:00)
    const start = new Date(today.setHours(0, 0, 0, 0));

    // end of today (18:00:00)
    const end = new Date(today.setHours(18, 0, 0, 0));

    const report = await Task.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
        },
      },
      {
        $unwind: "$projects",
      },
      {
        $group: {
          _id: {
            employee: "$user_name",
            employeeId: "$employeeId",
            project: "$projects",
          },
          totalDuration: { $sum: "$totalTimeSpent" },
        },
      },
      {
        $group: {
          _id: {
            employee: "$_id.employee",
            employeeId: "$_id.employeeId",
          },
          projects: {
            $push: {
              project: "$_id.project",
              duration: "$totalDuration",
            },
          },
          totalDuration: { $sum: "$totalDuration" },
        },
      },
      { $sort: { "_id.employee": 1 } },
    ]);

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProjectSummaryToday = async (req, res) => {
  try {
    // Define today’s start and end
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(18, 0, 0, 0);

    const report = await Task.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $unwind: "$projects",
      },
      {
        $group: {
          _id: "$projects",
          totalTimeSpent: { $sum: "$totalTimeSpent" },
        },
      },
      {
        $project: {
          project: "$_id",
          totalTimeSpent: 1,
          _id: 0,
        },
      },
      { $sort: { project: 1 } },
    ]);

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
