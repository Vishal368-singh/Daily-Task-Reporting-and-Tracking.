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
    const isEditing = editingRemarks[key] || false;

    if (isEditing) {
      try {
        const data = editedRemarks[key];
        if (data) {
          await updateTaskRemark(taskId, remarkId, {
            minutes: Number(data.minutes || 0),
            status: data.status,
          });
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
      const task = localTasks.find((t) => t._id === taskId);
      const remark = task?.remarks.find((r) => r._id === remarkId);
      if (remark) {
        setEditedRemarks((prev) => ({
          ...prev,
          [key]: { minutes: remark.minutes || 0, status: remark.status || "" },
        }));
      }
    }

    setEditingRemarks((prev) => ({ ...prev, [key]: !isEditing }));
  };

  return (
    <div className="overflow-hidden bg-[#1f1f1f] rounded-2xl shadow-xl border border-zinc-800">
      <div className="max-h-[500px] overflow-x-auto overflow-y-auto">
        <table className="min-w-full border-collapse text-sm text-gray-300">
          <thead className="sticky top-0 bg-gray-800/90 backdrop-blur-sm z-10 text-xs uppercase tracking-wider">
            <tr className="text-gray-200">
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
                    className="px-6 py-4 font-semibold text-left border-b border-zinc-700"
                  >
                    {col}
                  </th>
                ))}
            </tr>
          </thead>

          {localTasks.length === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan={12}
                  className="text-center py-10 text-zinc-500 italic"
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
                <tbody key={task._id} className="divide-y divide-zinc-800">
                  {(visibleRemarks.length > 0 ? visibleRemarks : [null]).map(
                    (remark, idx) => {
                      const key = remark
                        ? `${task._id}-${remark._id}`
                        : task._id;
                      const isEditing = editingRemarks[key] || false;

                      return (
                        <tr
                          key={key}
                          className="hover:bg-gray-700/30 transition-colors duration-200"
                        >
                          {idx === 0 && (
                            <>
                              <td
                                rowSpan={visibleRemarks.length || 1}
                                className="px-4 py-3 text-center text-sm font-medium text-gray-400"
                              >
                                {taskIdx + 1}
                              </td>
                              <td
                                rowSpan={visibleRemarks.length || 1}
                                className="px-4 py-3 text-sm font-semibold text-gray-200"
                              >
                                {task.user_name || "N/A"}
                              </td>
                              <td
                                rowSpan={visibleRemarks.length || 1}
                                className="px-4 py-3 text-sm text-gray-400"
                              >
                                {task.employeeId || "N/A"}
                              </td>
                              <td
                                rowSpan={visibleRemarks.length || 1}
                                className="px-4 py-3 text-sm text-gray-200"
                              >
                                {Array.isArray(task.projects)
                                  ? task.projects.join(", ")
                                  : task.projects || task.project || "N/A"}
                              </td>
                              <td
                                rowSpan={visibleRemarks.length || 1}
                                className="px-4 py-3 text-sm text-gray-200"
                              >
                                {Array.isArray(task.modules)
                                  ? task.modules.join(", ")
                                  : task.modules || task.module || "N/A"}
                              </td>
                              <td
                                rowSpan={visibleRemarks.length || 1}
                                className="px-4 py-3 text-sm text-gray-400"
                              >
                                {task.date
                                  ? new Date(task.date).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td
                                rowSpan={visibleRemarks.length || 1}
                                className="px-4 py-3 text-sm text-gray-300"
                              >
                                {(() => {
                                  const lead =
                                    task.activity_leads || task.activity_lead;
                                  return Array.isArray(lead)
                                    ? lead.join(", ")
                                    : lead || "N/A";
                                })()}
                              </td>
                              <td
                                rowSpan={visibleRemarks.length || 1}
                                className="px-4 py-3 text-sm text-gray-300"
                              >
                                {task.team || "N/A"}
                              </td>
                            </>
                          )}

                          {remark ? (
                            <>
                              <td className="px-4 py-3 text-sm text-gray-300 whitespace-pre-wrap w-[350px]">
                                {idx + 1}. {remark.text || "N/A"}
                              </td>

                              <td className="px-4 py-3 text-sm text-center text-gray-300">
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
                                    className="w-20 px-2 py-1 text-center bg-gray-800 text-gray-300 border border-gray-600 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="Minutes"
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
                                    className="px-2 py-1 bg-gray-800 text-gray-300 border border-gray-600 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                  >
                                    <option value="">Select</option>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">
                                      In Progress
                                    </option>
                                    <option value="On Hold">On Hold</option>
                                    <option value="Completed">Completed</option>
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
                            <td className="px-4 py-3 text-center">
                              <Tooltip
                                title={isEditing ? "Save" : "Edit"}
                                arrow
                                placement="top"
                              >
                                <button
                                  className={`p-2 rounded-full transition-colors border-2 ${
                                    isEditing
                                      ? "border-green-600 text-green-400 hover:bg-green-600/20"
                                      : "border-blue-600 text-blue-400 hover:bg-blue-600/20"
                                  }`}
                                  onClick={() =>
                                    handleToggleEdit(task._id, remark._id)
                                  }
                                >
                                  {isEditing ? (
                                    <SaveRoundedIcon fontSize="small" />
                                  ) : (
                                    <EditRoundedIcon fontSize="small" />
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
