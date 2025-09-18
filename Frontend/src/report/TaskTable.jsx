import React from "react";

const TaskTable = ({ tasks }) => {
  const statusColors = {
    Completed: "bg-green-500/20 text-green-400 border border-green-500/30",
    "In Progress": "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    "On Hold": "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    Cancelled: "bg-red-500/20 text-red-400 border border-red-500/30",
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
                "Remark Status",
                "Task Status",
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

          {tasks.length === 0 ? (
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
            tasks.map((task, taskIdx) => (
              <tbody key={task._id} className="divide-y divide-zinc-800 group">
                {(task.remarks?.length > 0 ? task.remarks : [null]).map(
                  (remark, remarkIdx) => (
                    <tr
                      key={remark ? `${task._id}-${remarkIdx}` : task._id}
                      className="group-hover:bg-zinc-800/40 transition-colors duration-200"
                    >
                      {remarkIdx === 0 && (
                        <>
                          <td
                            rowSpan={task.remarks?.length || 1}
                            className="px-4 py-3 text-center text-sm font-medium text-zinc-400"
                          >
                            {taskIdx + 1}
                          </td>
                          <td
                            rowSpan={task.remarks?.length || 1}
                            className="px-4 py-3 text-sm font-medium text-zinc-200"
                          >
                            {task.user_name || "N/A"}
                          </td>
                          <td
                            rowSpan={task.remarks?.length || 1}
                            className="px-4 py-3 text-sm text-zinc-300"
                          >
                            {task.employeeId || "N/A"}
                          </td>
                          <td
                            rowSpan={task.remarks?.length || 1}
                            className="px-4 py-3 text-sm text-zinc-200"
                          >
                            {Array.isArray(task.project)
                              ? task.project.join(", ")
                              : task.project || "N/A"}
                          </td>
                          <td
                            rowSpan={task.remarks?.length || 1}
                            className="px-4 py-3 text-sm text-zinc-200"
                          >
                            {Array.isArray(task.module)
                              ? task.module.join(", ")
                              : task.module || "N/A"}
                          </td>
                          <td
                            rowSpan={task.remarks?.length || 1}
                            className="px-4 py-3 text-sm text-zinc-400"
                          >
                            {task.date
                              ? new Date(task.date).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td
                            rowSpan={task.remarks?.length || 1}
                            className="px-4 py-3 text-sm text-zinc-300"
                          >
                            {task.activity_lead || "N/A"}
                          </td>
                          <td
                            rowSpan={task.remarks?.length || 1}
                            className="px-4 py-3 text-sm text-zinc-300"
                          >
                            {task.team || "N/A"}
                          </td>
                        </>
                      )}

                      {remark ? (
                        <>
                          <td className="px-4 py-3 text-sm text-zinc-300 whitespace-pre-wrap">
                            {remarkIdx + 1}. {remark.text || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm text-center text-zinc-300">
                            {remark.minutes || 0}m
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-medium inline-block ${
                                statusColors[remark.status] ||
                                "bg-zinc-600/20 text-zinc-400 border border-zinc-600/30"
                              }`}
                            >
                              {remark.status || "Unknown"}
                            </span>
                          </td>
                        </>
                      ) : (
                        <td
                          colSpan={3}
                          className="px-4 py-3 text-sm italic text-zinc-500"
                        >
                          No remarks for this task.
                        </td>
                      )}

                      {remarkIdx === 0 && (
                        <td
                          rowSpan={task.remarks?.length || 1}
                          className={`px-4 py-3 text-center text-sm font-semibold ${
                            task.status === "Completed"
                              ? "text-green-400"
                              : "text-blue-400"
                          }`}
                        >
                          {task.status || "Pending"}
                        </td>
                      )}
                    </tr>
                  )
                )}
              </tbody>
            ))
          )}
        </table>
      </div>

      {/* TODO: Add mobile/tablet responsive table if needed */}
    </div>
  );
};

export default TaskTable;
