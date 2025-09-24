import React, { useState, useEffect } from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import Tooltip from "@mui/material/Tooltip";
import { getUserTasks, updateTaskRemark } from "../api/taskApi";

const TaskTable = ({ tasks, loggedInUserRole }) => {
  const statusColors = {
    Completed: "bg-green-500/20 text-green-400 border border-green-500/30",
    "In Progress": "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    "On Hold": "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    Pending: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
  };

  const [localTasks, setLocalTasks] = useState(tasks);
  const [editingRemarks, setEditingRemarks] = useState({});
  const [editedRemarks, setEditedRemarks] = useState({});

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleToggleEdit = async (taskId, remarkId) => {
    const key = `${taskId}-${remarkId}`;
    console.log("Toggling edit for:", remarkId);
    const isEditing = editingRemarks[key] || false;

    if (isEditing) {
      // Save changes
      try {
        const data = editedRemarks[key];
        if (data) {
          const visible = data.status !== "Completed";

          await updateTaskRemark(taskId, remarkId, {
            minutes: Number(data.minutes || 0),
            visible,
            status: data.status,
          });
          console.log("Saved remark:", data, taskId, remarkId);
          const updatedTasks = await getUserTasks();
          setLocalTasks(updatedTasks.data);

          setEditedRemarks((prev) => {
            const newEdited = { ...prev };
            delete newEdited[key];
            return newEdited;
          });
        }
      } catch (error) {
        console.error("Error saving remark:", error);
      }
    } else {
      // Enter edit mode: initialize with current remark
      const task = localTasks.find((t) => t._id === taskId);
      const remark = task?.remarks.find((r) => r._id === remarkId);
      if (remark) {
        setEditedRemarks((prev) => ({
          ...prev,
          [key]: { minutes: 0, status: remark.status || "" },
        }));
      }
    }

    setEditingRemarks((prev) => ({ ...prev, [key]: !isEditing }));
  };

  return (
    <div className="overflow-hidden bg-gradient-to-br from-zinc-900 to-black rounded-2xl shadow-xl border border-zinc-800">
      <div className="max-h-[450px] hidden md:block overflow-x-auto overflow-y-auto">
        <table className="min-w-full table-fixed border-separate border-spacing-0">
          <thead>
            <tr>
              {[
                "S. No.",
                "User",
                "Employee ID",
                "Project(s)",
                "Module(s)",
                "Date",
                "Activity Lead",
                "Team",
                "Remark",
                "Duration (In MM)",
                "Status",
                loggedInUserRole === "user" && "Update",
              ]
                .filter(Boolean)
                .map((col) => (
                  <th
                    key={col}
                    className="px-6 py-4 text-left text-sm font-semibold text-zinc-300 border-b border-zinc-700 bg-zinc-950 sticky top-0 backdrop-blur-sm"
                  >
                    {col}
                  </th>
                ))}
            </tr>
          </thead>

          {localTasks.length === 0 ? (
            <tbody className="divide-y divide-zinc-800">
              <tr>
                <td
                  colSpan={12}
                  className="text-center py-12 text-zinc-500 italic"
                >
                  No tasks available to display
                </td>
              </tr>
            </tbody>
          ) : (
            localTasks.map((task, taskIdx) => {
              const visibleRemarks =
                loggedInUserRole === "user"
                  ? task.remarks?.filter(
                      (r) => r.finalStatus === "In Progress"
                    ) || []
                  : task.remarks || [];

              return (
                <tbody
                  key={task._id}
                  className="divide-y divide-zinc-800 group"
                >
                  {(visibleRemarks.length > 0 ? visibleRemarks : [null]).map(
                    (remark, idx) => {
                      const key = remark
                        ? `${task._id}-${remark._id}`
                        : task._id;
                      const isEditing = editingRemarks[key] || false;

                      return (
                        <tr
                          key={key}
                          className="group-hover:bg-zinc-800/40 transition-colors duration-200"
                        >
                          {idx === 0 && (
                            <>
                              <td
                                rowSpan={visibleRemarks.length || 1}
                                className="px-4 py-3 text-center text-sm font-medium text-zinc-400"
                              >
                                {taskIdx + 1}
                              </td>
                              <td
                                rowSpan={visibleRemarks.length || 1}
                                className="px-4 py-3 text-sm font-medium text-zinc-200"
                              >
                                {task.user_name || "N/A"}
                              </td>
                              <td
                                rowSpan={visibleRemarks.length || 1}
                                className="px-4 py-3 text-sm text-zinc-300"
                              >
                                {task.employeeId || "N/A"}
                              </td>
                              <td
                                rowSpan={visibleRemarks.length || 1}
                                className="px-4 py-3 text-sm text-zinc-200"
                              >
                                {Array.isArray(task.project)
                                  ? task.project.join(", ")
                                  : task.project || "N/A"}
                              </td>
                              <td
                                rowSpan={visibleRemarks.length || 1}
                                className="px-4 py-3 text-sm text-zinc-200"
                              >
                                {Array.isArray(task.module)
                                  ? task.module.join(", ")
                                  : task.module || "N/A"}
                              </td>
                              <td
                                rowSpan={visibleRemarks.length || 1}
                                className="px-4 py-3 text-sm text-zinc-400"
                              >
                                {task.date
                                  ? new Date(task.date).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td
                                rowSpan={visibleRemarks.length || 1}
                                className="px-4 py-3 text-sm text-zinc-300"
                              >
                                {task.activity_lead || "N/A"}
                              </td>
                              <td
                                rowSpan={visibleRemarks.length || 1}
                                className="px-4 py-3 text-sm text-zinc-300"
                              >
                                {task.team || "N/A"}
                              </td>
                            </>
                          )}

                          {remark ? (
                            <>
                              <td className="px-4 py-3 text-sm text-zinc-300 whitespace-pre-wrap w-[350px] min-w-[300px]">
                                {idx + 1}. {remark.text || "N/A"}
                              </td>

                              <td className="px-4 py-3 text-sm text-center text-zinc-300">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    min="0"
                                    value={editedRemarks[key]?.minutes || ""}
                                    onChange={(e) => {
                                      const value =
                                        e.target.value === ""
                                          ? ""
                                          : Number(e.target.value);
                                      setEditedRemarks((prev) => ({
                                        ...prev,
                                        [key]: {
                                          ...prev[key],
                                          minutes: value,
                                        },
                                      }));
                                    }}
                                    className="w-16 px-2 py-1 text-center bg-zinc-800 text-zinc-300 border border-zinc-600 rounded
                 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="Add minutes"
                                  />
                                ) : (
                                  `${remark.minutes}m`
                                )}
                              </td>

                              <td className="px-4 py-3 text-center">
                                {isEditing ? (
                                  <select
                                    value={
                                      editedRemarks[key]?.status ||
                                      remark.status
                                    }
                                    onChange={(e) => {
                                      setEditedRemarks((prev) => ({
                                        ...prev,
                                        [key]: {
                                          ...prev[key],
                                          status: e.target.value,
                                        },
                                      }));
                                    }}
                                    className="px-2 py-1 bg-zinc-800 text-zinc-300 border border-zinc-600 rounded"
                                  >
                                    <option value="">Select Status</option>
                                    <option value="Completed">Completed</option>
                                    <option value="In Progress">
                                      In Progress
                                    </option>
                                    <option value="On Hold">On Hold</option>
                                    <option value="Pending">Pending</option>
                                  </select>
                                ) : (
                                  <span
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium inline-block ${
                                      statusColors[remark.status] ||
                                      "bg-zinc-600/20 text-zinc-400 border border-zinc-600/30"
                                    }`}
                                  >
                                    {remark.status || "Unknown"}
                                  </span>
                                )}
                              </td>
                            </>
                          ) : (
                            <td
                              colSpan={3}
                              className="px-4 py-3 text-sm italic text-zinc-500"
                            >
                              No pending remarks for this task.
                            </td>
                          )}

                          {loggedInUserRole === "user" && remark && (
                            <td className="px-4 py-3 text-center text-sm font-semibold">
                              <Tooltip
                                title={isEditing ? "Save" : "Edit"}
                                arrow
                              >
                                <button
                                  className="p-2 rounded-full border-2 border-red-700 transition-colors"
                                  onClick={() =>
                                    handleToggleEdit(task._id, remark._id)
                                  }
                                  aria-label={
                                    isEditing ? "Save changes" : "Edit item"
                                  }
                                >
                                  {isEditing ? (
                                    <SaveRoundedIcon />
                                  ) : (
                                    <EditRoundedIcon />
                                  )}
                                </button>
                              </Tooltip>
                            </td>
                          )}
                        </tr>
                      );
                    }
                  )}
                </tbody>
              );
            })
          )}
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
