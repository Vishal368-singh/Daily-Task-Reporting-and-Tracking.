import React, { useState, useEffect } from "react";
import { FaTasks, FaCheckCircle, FaClock, FaSignOutAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import DailyTaskForm from "../forms/DailyTaskForm";

const UserDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedInUser = location.state?.username || "User";
  const [tasks, setTasks] = useState([]);

  // Sample data for demo
  useEffect(() => {
    setTasks([]);
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status !== "Completed").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            Welcome, {loggedInUser}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 font-medium">
              Today: {new Date().toLocaleDateString()}
            </span>
            <button
              onClick={() => navigate("/")}
              className="flex items-center bg-red-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-300"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 hover:shadow-xl transition">
            <FaTasks className="text-indigo-500 text-4xl" />
            <div>
              <p className="text-gray-500 text-sm">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-800">{totalTasks}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 hover:shadow-xl transition">
            <FaCheckCircle className="text-green-500 text-4xl" />
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <p className="text-2xl font-bold text-gray-800">
                {completedTasks}
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center space-x-4 hover:shadow-xl transition">
            <FaClock className="text-yellow-500 text-4xl" />
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-2xl font-bold text-gray-800">{pendingTasks}</p>
            </div>
          </div>
        </div>

        {/* Task Table */}
        <div className="mb-10 overflow-x-auto">
          <table className="min-w-full bg-white rounded-2xl shadow-lg overflow-hidden">
            <thead className="bg-indigo-50">
              <tr>
                <th className="py-3 px-6 text-left font-semibold text-gray-600">
                  #
                </th>
                <th className="py-3 px-6 text-left font-semibold text-gray-600">
                  Project
                </th>
                <th className="py-3 px-6 text-left font-semibold text-gray-600">
                  Module
                </th>
                <th className="py-3 px-6 text-left font-semibold text-gray-600">
                  Status
                </th>
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
                  <tr key={task.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6">{task.id}</td>
                    <td className="py-3 px-6">{task.project}</td>
                    <td className="py-3 px-6">{task.module}</td>
                    <td
                      className={`py-3 px-6 font-semibold ${
                        task.status === "Completed"
                          ? "text-green-500"
                          : task.status === "Pending"
                          ? "text-yellow-500"
                          : "text-indigo-500"
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

        {/* Daily Task Form */}
        <DailyTaskForm loggedInUser={loggedInUser} />
      </div>
    </div>
  );
};

export default UserDashboard;
