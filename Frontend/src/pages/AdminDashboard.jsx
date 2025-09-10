import React, { useState, useEffect } from "react";
import { FaTasks, FaCheckCircle, FaClock, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  // Sample data – replace with API call
  useEffect(() => {
    setTasks([
      {
        id: 1,
        user_name: "Vishal",
        project: "ML Model",
        module: "Preprocessing",
        status: "Completed",
        date: "2025-09-10",
        activity_lead: "Subodh Sir",
        subactivity: "Data Cleaning",
        remarks: "No blockers",
        time_duration: "3h",
      },
      {
        id: 2,
        user_name: "Dilip",
        project: "GIS Mapping",
        module: "Layer Setup",
        status: "In Progress",
        date: "2025-09-10",
        activity_lead: "Aditya Sir",
        subactivity: "Layer Integration",
        remarks: "Waiting for GIS data",
        time_duration: "2h 30m",
      },
      {
        id: 3,
        user_name: "Sandeep",
        project: "ML Model",
        module: "Training",
        status: "Pending",
        date: "2025-09-10",
        activity_lead: "Atul Sir",
        subactivity: "Model Tuning",
        remarks: "Blocked by missing dataset",
        time_duration: "1h 45m",
      },
    ]);
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status !== "Completed").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-indigo-700">
          Admin Dashboard
        </h1>
        <button
          onClick={() => navigate("/")}
          className="flex items-center bg-red-600 text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-300"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>

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
            <p className="text-2xl font-bold text-gray-800">{completedTasks}</p>
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
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-indigo-50">
            <tr>
              {[
                "#",
                "User",
                "Project",
                "Module",
                "Status",
                "Date",
                "Activity Lead",
                "Sub-Activity",
                "Remarks",
                "Time Duration",
              ].map((head) => (
                <th
                  key={head}
                  className="px-4 py-3 text-left font-semibold text-gray-600"
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
                  colSpan="10"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No tasks available
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{task.id}</td>
                  <td className="px-4 py-3">{task.user_name}</td>
                  <td className="px-4 py-3">{task.project}</td>
                  <td className="px-4 py-3">{task.module}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      task.status === "Completed"
                        ? "text-green-500"
                        : task.status === "Pending"
                        ? "text-yellow-500"
                        : "text-indigo-500"
                    }`}
                  >
                    {task.status}
                  </td>
                  <td className="px-4 py-3">{task.date}</td>
                  <td className="px-4 py-3">{task.activity_lead}</td>
                  <td className="px-4 py-3">{task.subactivity}</td>
                  <td className="px-4 py-3">{task.remarks}</td>
                  <td className="px-4 py-3">{task.time_duration}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
