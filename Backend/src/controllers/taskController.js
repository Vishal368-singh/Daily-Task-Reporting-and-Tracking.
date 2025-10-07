// controllers/taskController.js
import Task from "../models/Task.js";
import { attachAuditContext } from "../utils/auditHelper.js";
import AuditLog from "../models/AuditLog.js";


/**
 * Create a new task (with audit logging)
 */
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
    const employeeId = req.user?.employeeId;

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

    // attach audit info
    attachAuditContext(newTask, req);

    await newTask.save();

    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

/**
 * Get tasks for logged-in user
 */
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

/**
 * Update a specific remark in a task (with audit logging)
 */
export const updateTaskRemark = async (req, res) => {
  try {
    const { taskId, remarkId } = req.params;
    const { minutes, status } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const oldSnapshot = task.toObject();

    // Find remark by _id
    const remark = task.remarks.id(remarkId);
    if (!remark) return res.status(404).json({ message: "Remark not found" });

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

    // Ensure all remarks have required fields
    task.remarks.forEach((r) => {
      if (!r.projectName) {
        r.projectName = task.projects?.[0] || task.project || "Unknown Project";
      }
      if (!r.moduleName) {
        r.moduleName = task.modules?.[0] || task.module || "Unknown Module";
      }
      if (!r.text) {
        r.text = "No description provided";
      }
    });

    // attach audit context
    attachAuditContext(task, req);
    await task.save();

    // Write explicit update log (for clarity)
    await AuditLog.create({
      collection: "Task",
      documentId: task._id,
      action: "UPDATE",
      performedBy:
        req.user?.email || req.user?.employeeId || req.user?.id || "unknown",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      oldValue: oldSnapshot,
      newValue: task.toObject(),
      timestamp: new Date(),
    });

    res.status(200).json({ message: "Remark updated", task });
  } catch (error) {
    console.error("Error updating remark:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

/**
 * Admin: Get all tasks with optional filters
 */
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

    const tasks = await Task.find(filter).sort({ date: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

/**
 * Search employees by name or ID
 */
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

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Generate today's daily summary (by employee & project)
 */
export const getDailySummary = async (req, res) => {
  try {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(18, 0, 0, 0));

    const report = await Task.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      { $unwind: "$projects" },
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

/**
 * Project-wise total for today
 */
export const getProjectSummaryToday = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(18, 0, 0, 0);

    const report = await Task.aggregate([
      { $match: { date: { $gte: startOfDay, $lte: endOfDay } } },
      { $unwind: "$projects" },
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
