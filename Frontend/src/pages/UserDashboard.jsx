import React, { useState, useEffect, useContext } from "react";
import { FaTasks, FaCheckCircle, FaClock } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import TaskFilters from "../report/TaskFilters";
import TaskTable from "../report/TaskTable";
import { getUserTasks } from "../api/taskApi";

const UserDashboard = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const loggedInUser = location.state?.username || "User";

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filters, setFilters] = useState({ date: "", status: "", search: "" });
  const [error, setError] = useState("");

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const todayStr = today.toISOString().split("T")[0];
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await getUserTasks();

        const twoDayTasks = response.data.filter((task) => {
          const taskDate = new Date(task.date).toISOString().split("T")[0];
          return taskDate === todayStr || taskDate === yesterdayStr;
        });

        setTasks(twoDayTasks);
        setFilteredTasks(twoDayTasks);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching tasks");
        setLoading(false);
      }
    };

    fetchTasks();
  }, [todayStr, yesterdayStr]);

  useEffect(() => {
    let result = [...tasks];

    if (filters.date) {
      result = result.filter(
        (task) =>
          new Date(task.date).toLocaleDateString() ===
          new Date(filters.date).toLocaleDateString()
      );
    }

    if (filters.status) {
      result = result.filter((task) => task.status === filters.status);
    }

    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (task) =>
          task.user_name?.toLowerCase().includes(query) ||
          task.employeeId?.toLowerCase().includes(query)
      );
    }

    setFilteredTasks(result);
  }, [filters, tasks]);

  if (loading) return <p className="p-6 text-gray-400">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status !== "Completed").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 text-gray-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 md:mb-0">
          Welcome, {user?.username || loggedInUser || ""}
        </h1>
        <p className="text-gray-400 md:text-lg">{today.toDateString()}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#2a2a2a] p-6 rounded-2xl shadow-lg flex items-center space-x-4 hover:bg-gray-800 transition transform hover:scale-105">
          <FaTasks className="text-red-600 text-4xl" />
          <div>
            <p className="text-gray-400 text-sm uppercase tracking-wider">
              Total Tasks
            </p>
            <p className="text-2xl font-bold text-white">{totalTasks}</p>
          </div>
        </div>
        <div className="bg-[#2a2a2a] p-6 rounded-2xl shadow-lg flex items-center space-x-4 hover:bg-gray-800 transition transform hover:scale-105">
          <FaCheckCircle className="text-green-500 text-4xl" />
          <div>
            <p className="text-gray-400 text-sm uppercase tracking-wider">
              Completed
            </p>
            <p className="text-2xl font-bold text-white">{completedTasks}</p>
          </div>
        </div>
        <div className="bg-[#2a2a2a] p-6 rounded-2xl shadow-lg flex items-center space-x-4 hover:bg-gray-800 transition transform hover:scale-105">
          <FaClock className="text-yellow-500 text-4xl" />
          <div>
            <p className="text-gray-400 text-sm uppercase tracking-wider">
              Pending
            </p>
            <p className="text-2xl font-bold text-white">{pendingTasks}</p>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-[#2a2a2a] rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
        {/* Filters Section */}
        <div className="p-6 border-b border-gray-700">
          <TaskFilters filters={filters} setFilters={setFilters} />
        </div>

        {/* Table Section */}
        <div className="p-6 overflow-x-auto">
          <TaskTable tasks={filteredTasks} />
        </div>
      </div>
    </div>
  );
};


export default UserDashboard;
