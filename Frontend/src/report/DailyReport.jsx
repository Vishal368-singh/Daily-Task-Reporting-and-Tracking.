import React, { useEffect, useState } from "react";
import { getAdminTasks } from "../api/taskApi";
import TaskFilters from "./TaskFilters";
import TaskTable from "./TaskTable";

const DailyReport = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    status: "",
    search: "",
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await getAdminTasks();
        setTasks(response.data);

        // Default to prev 1 month
        const today = new Date();
        const prevMonth = new Date();
        prevMonth.setDate(today.getDate() - 30);

        setFilters((prev) => ({
          ...prev,
          fromDate: prevMonth.toISOString().split("T")[0],
          toDate: today.toISOString().split("T")[0],
        }));

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching tasks");
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // ✅ filter logic
  useEffect(() => {
    let result = [...tasks];

    // Date range filter
    if (filters.fromDate && filters.toDate) {
      result = result.filter((task) => {
        const taskDate = new Date(task.date).toISOString().split("T")[0];
        return taskDate >= filters.fromDate && taskDate <= filters.toDate;
      });
    }

    // Status filter (look inside remarks of each task)
    if (filters.status) {
      result = result.filter((task) =>
        task.remarks?.some(
          (r) => r?.status?.toLowerCase() === filters.status.toLowerCase()
        )
      );
    }

    // Search filter (username or employeeId only)
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

      <TaskFilters filters={filters} setFilters={setFilters} />

      <TaskTable tasks={filteredTasks} />
    </div>
  );
};

export default DailyReport;
