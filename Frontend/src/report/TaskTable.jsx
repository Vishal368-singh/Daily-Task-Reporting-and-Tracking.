import React from "react";

const TaskTable = ({ tasks }) => {
  const statusColors = {
    Completed: "bg-green-500/20 text-green-400",
    "In Progress": "bg-blue-500/20 text-blue-400",
    "On Hold": "bg-yellow-500/20 text-yellow-400", // "In Hold" changed to "On Hold" for consistency
    Cancelled: "bg-red-500/20 text-red-400",
  };

  const tableHeaders = [
    { name: "S. No.", minWidth: "4rem" },
    { name: "User", minWidth: "12rem" },
    { name: "Employee ID", minWidth: "8rem" },
    { name: "Project", minWidth: "12rem" },
    { name: "Module", minWidth: "12rem" },
    { name: "Date", minWidth: "8rem" },
    { name: "Activity Lead", minWidth: "12rem" },
    { name: "Team", minWidth: "8rem" },
    { name: "Remark", minWidth: "30rem" }, // Significantly wider for ~200 words
    { name: "Time Spent", minWidth: "8rem" },
    { name: "Status", minWidth: "8rem" },
  ];

  return (
    <div className="overflow-hidden bg-[#18181B] rounded-xl shadow-lg border border-zinc-800 p-2 sm:p-4 ">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800 scrollbar-hide">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              {tableHeaders.map((col) => (
                <th
                  key={col.name}
                  className="px-6 py-4 text-left text-sm font-semibold text-zinc-400 border-b border-zinc-700 bg-[#18181B] sticky top-0"
                  style={{ minWidth: col.minWidth }}
                >
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {tasks.length === 0 ? (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="text-center py-12 text-zinc-500 italic"
                >
                  No tasks available to display
                </td>
              </tr>
            ) : (
              tasks.map((task, taskIdx) => {
                const remarks =
                  task.remarks && task.remarks.length > 0
                    ? task.remarks
                    : [null];
                const rowSpan = remarks.length;

                return remarks.map((remark, remarkIdx) => (
                  <tr
                    key={remark ? `${task._id}-${remarkIdx}` : task._id}
                    className="group hover:bg-zinc-800/50 transition-colors duration-200"
                  >
                    {/* These cells are only rendered for the FIRST row of a task */}
                    {remarkIdx === 0 && (
                      <>
                        <td rowSpan={rowSpan} className="cell text-center">
                          {taskIdx + 1}
                        </td>
                        <td rowSpan={rowSpan} className="cell">
                          {task.user_name || "N/A"}
                        </td>
                        <td rowSpan={rowSpan} className="cell">
                          {task.employeeId || "N/A"}
                        </td>
                        <td rowSpan={rowSpan} className="cell">
                          {task.project?.join(", ") || "N/A"}
                        </td>
                        <td rowSpan={rowSpan} className="cell">
                          {task.module?.join(", ") || "N/A"}
                        </td>
                        <td rowSpan={rowSpan} className="cell">
                          {task.date
                            ? new Date(task.date).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td rowSpan={rowSpan} className="cell">
                          {task.activity_lead || "N/A"}
                        </td>
                        <td rowSpan={rowSpan} className="cell">
                          {task.team || "N/A"}
                        </td>
                      </>
                    )}

                    {/* Remark-specific cells */}
                    {remark ? (
                      <>
                        <td className="cell whitespace-normal">
                          {remark.text || "N/A"}
                        </td>
                        <td className="cell text-center">
                          {remark.hours || 0}h {remark.minutes || 0}m
                        </td>
                        <td className="cell text-center">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                              statusColors[remark.status] ||
                              "bg-zinc-500/20 text-zinc-400"
                            }`}
                          >
                            {remark.status || "Unknown"}
                          </span>
                        </td>
                      </>
                    ) : (
                      <td className="cell text-zinc-500 italic" colSpan={3}>
                        No remarks for this task.
                      </td>
                    )}
                  </tr>
                ));
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Add this to your global CSS to reuse the cell styles
/* In your styles.css */
/*
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .cell {
    @apply px-6 py-4 whitespace-nowrap text-sm text-zinc-300 align-top;
    @apply group-last:border-b-0;
  }
}
*/

export default TaskTable;
