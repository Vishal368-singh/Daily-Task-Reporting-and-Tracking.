import React, { useState, useEffect } from "react";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import Tooltip from "@mui/material/Tooltip";
import { updateTaskRemark } from "../api/taskApi";

const TaskTable = ({ tasks, loggedInUserRole, onUpdate }) => {
  const statusColors = {
    Completed: "bg-green-500/20 text-green-400 border border-green-500/30",
    "In Progress": "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    "On Hold": "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    Cancelled: "bg-red-500/20 text-red-400 border border-red-500/30",
  };

  const [localTasks, setLocalTasks] = useState(tasks);
  const [editingRemarks, setEditingRemarks] = useState({});
  const [editedRemarks, setEditedRemarks] = useState({});

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleToggleEdit = async (taskId, remarkIdx) => {
    const key = `${taskId}-${remarkIdx}`;
    const isEditing = editingRemarks[key] || false;
    if (isEditing) {
      // Save changes for this remark
      try {
        const data = editedRemarks[key];
        if (data) {
          await updateTaskRemark(taskId, remarkIdx, data);
          // Refetch tasks to reflect changes, including visibility updates
          if (onUpdate) {
            await onUpdate();
          }
          // Clear editedRemarks for this remark
          setEditedRemarks((prev) => {
            const newEdited = { ...prev };
            delete newEdited[key];
            return newEdited;
          });
        }
      } catch (error) {
        console.error("Error saving remark:", error);
        // Handle error, perhaps show toast
      }
    } else {
      // Start editing, initialize editedRemarks with current values for this remark
      const task = localTasks.find((t) => t._id === taskId);
      if (task && task.remarks[remarkIdx]) {
        const remark = task.remarks[remarkIdx];
        setEditedRemarks((prev) => ({
          ...prev,
          [key]: {
            minutes: 0,
            status: remark.status || "",
          },
        }));
      }
    }
    setEditingRemarks((prev) => ({ ...prev, [key]: !isEditing }));
  };

  return (
    <div className="overflow-hidden bg-gradient-to-br from-zinc-900 to-black rounded-2xl shadow-xl border border-zinc-800">
      {/* Desktop Table */}
      <div className="max-h-[450px] hidden md:block overflow-x-auto overflow-y-auto">
        <table className="min-w-full border-separate border-spacing-0">
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
                "Time Spent",
                "Status",
                loggedInUserRole === "user" && "Update",
              ].map((col) => (
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
                task.remarks?.filter((r) => r.status !== "Completed") || [];
              return (
                <tbody
                  key={task._id}
                  className="divide-y divide-zinc-800 group"
                >
                  {(visibleRemarks.length > 0 ? visibleRemarks : [null]).map(
                    (remark, idx) => {
                      const originalIdx = remark
                        ? task.remarks.indexOf(remark)
                        : -1;
                      const isEditing =
                        editingRemarks[`${task._id}-${originalIdx}`] || false;
                      return (
                        <tr
                          key={remark ? `${task._id}-${originalIdx}` : task._id}
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
                              <td className="px-4 py-3 text-sm text-zinc-300 whitespace-pre-wrap">
                                {idx + 1}. {remark.text || "N/A"}
                              </td>
                              <td className="px-4 py-3 text-sm text-center text-zinc-300">
                                {isEditing ? (
                                  <input
                                    type="number"
                                    value={
                                      editedRemarks[
                                        `${task._id}-${originalIdx}`
                                      ]?.minutes || 0
                                    }
                                    onChange={(e) => {
                                      const value =
                                        parseInt(e.target.value) || 0;
                                      setEditedRemarks((prev) => ({
                                        ...prev,
                                        [`${task._id}-${originalIdx}`]: {
                                          ...prev[`${task._id}-${originalIdx}`],
                                          minutes: value,
                                        },
                                      }));
                                    }}
                                    className="w-16 px-2 py-1 text-center bg-zinc-800 text-zinc-300 border border-zinc-600 rounded"
                                    placeholder="Add minutes"
                                  />
                                ) : (
                                  `${remark.minutes || 0}m`
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {isEditing ? (
                                  <select
                                    value={
                                      editedRemarks[
                                        `${task._id}-${originalIdx}`
                                      ]?.status ||
                                      remark.status ||
                                      ""
                                    }
                                    onChange={(e) => {
                                      setEditedRemarks((prev) => ({
                                        ...prev,
                                        [`${task._id}-${originalIdx}`]: {
                                          ...prev[`${task._id}-${originalIdx}`],
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

                          {loggedInUserRole == "user" && remark && (
                            <td className="px-4 py-3 text-center text-sm font-semibold">
                              <Tooltip
                                title={isEditing ? "Save" : "Edit"}
                                arrow
                              >
                                <button
                                  className="p-2 rounded-full border-2 border-red-700 transition-colors"
                                  onClick={() =>
                                    handleToggleEdit(task._id, originalIdx)
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
                          {loggedInUserRole == "user" && !remark && (
                            <td className="px-4 py-3 text-center text-sm font-semibold">
                              {/* No remarks */}
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

      {/* TODO: Add mobile/tablet responsive table if needed */}
    </div>
  );
};

export default TaskTable;

// import React, { useState } from 'react';
// import EditRoundedIcon from '@mui/icons-material/EditRounded';
// import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

// function IconEditComponent() {
//   // State to track if we are in "editing" mode
//   const [isEditing, setIsEditing] = useState(false);

//   // Function to toggle the state when the button is clicked
// const handleToggleEdit = () => {
//   setIsEditing(!isEditing); // Toggles between true and false
// };

//   return (
//     <div>
//       <p>Current mode: {isEditing ? "Editing" : "Ready"}</p>

//       {/* The button now contains the icons.
//         We add styling to make it look like a proper icon button.
//       */}
// <button
//   onClick={handleToggleEdit}
//   aria-label={isEditing ? "Save changes" : "Edit item"}
//   className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
// >
//   {isEditing ? <SaveRoundedIcon /> : <EditRoundedIcon />}
// </button>
//     </div>
//   );
// }

// export default IconEditComponent;
