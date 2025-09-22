import React, { useEffect, useState, useContext } from "react";
import { getAdminTasks } from "../api/taskApi";
import TaskFilters from "./TaskFilters";
import TaskTable from "./TaskTable";
import { AuthContext } from "../context/AuthContext";

const DailyReport = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    status: "",
    search: "",
  });

  // Fetch all admin tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getAdminTasks(); // API call
      const tasksWithStatus = response.data.map((task) => {
        // Determine task status based on remarks
        const hasPendingRemark = task.remarks?.some(
          (r) => r?.status?.toLowerCase() !== "completed"
        );
        return { ...task, status: hasPendingRemark ? "Pending" : "Completed" };
      });
      setTasks(tasksWithStatus);
      setFilteredTasks(tasksWithStatus); // show everything initially
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching tasks");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Apply filters only if user provides them
  useEffect(() => {
    let result = [...tasks];

    // Date range
    if (filters.fromDate && filters.toDate) {
      result = result.filter((task) => {
        const taskDate = new Date(task.date).toISOString().split("T")[0];
        return taskDate >= filters.fromDate && taskDate <= filters.toDate;
      });
    }

    // Status filter
    if (filters.status) {
      result = result.filter(
        (task) => task.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Search filter
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

  if (loading) return <div className="p-6 text-gray-400">Loading tasks...</div>;
  if (error)
    return (
      <div className="p-6 text-red-500 border border-red-700 rounded-lg bg-red-900/30">
        {error}
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-200 mb-6 border-b border-gray-700 pb-2">
        Daily Task Report
      </h1>

      {/* Filters only apply when user changes them */}
      <TaskFilters filters={filters} setFilters={setFilters} />

      <TaskTable
        tasks={filteredTasks}
        loggedInUserRole={user?.role}
        onUpdate={fetchTasks}
      />
    </div>
  );
};

export default DailyReport;
