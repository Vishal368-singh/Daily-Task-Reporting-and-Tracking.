import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { FaTasks, FaCheckCircle, FaClock, FaSignOutAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const UserDashboard = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const loggedInUser = location.state?.username || "User";
  const [tasks, setTasks] = useState([]);

  const today = new Date();
  // Sample data for demo
  useEffect(() => {
    setTasks([]);
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status !== "Completed").length;

  return (
    <div className="min-h-screen bg-[#121212] flex p-6">
      {/* Main Content */}
      <div className="flex-1 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 md:mb-0">
            Welcome, {user?.username || loggedInUser || ""}
          </h1>
          <p className="text-gray-400 md:text-lg">{today.toDateString()}</p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <FaTasks className="text-red-500 text-4xl" />,
              label: "Total Tasks",
              value: totalTasks,
            },
            {
              icon: <FaCheckCircle className="text-green-500 text-4xl" />,
              label: "Completed",
              value: completedTasks,
            },
            {
              icon: <FaClock className="text-yellow-500 text-4xl" />,
              label: "Pending",
              value: pendingTasks,
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-[#1f1f1f] p-6 rounded-2xl shadow-lg flex items-center space-x-4 hover:shadow-xl transition"
            >
              {card.icon}
              <div>
                <p className="text-gray-400 text-sm">{card.label}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Task Table */}
        <div className="overflow-x-auto bg-[#1f1f1f] rounded-2xl shadow-lg">
          <table className="min-w-full">
            <thead className="bg-gray-800">
              <tr>
                {["#", "Project", "Module", "Status"].map((head) => (
                  <th
                    key={head}
                    className="py-3 px-6 text-left font-semibold text-gray-400"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No tasks available
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-gray-700 hover:bg-gray-700"
                  >
                    <td className="py-3 px-6 text-gray-200">{task.id}</td>
                    <td className="py-3 px-6 text-gray-200">{task.project}</td>
                    <td className="py-3 px-6 text-gray-200">{task.module}</td>
                    <td
                      className={`py-3 px-6 font-semibold ${
                        task.status === "Completed"
                          ? "text-green-500"
                          : task.status === "Pending"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {task.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
