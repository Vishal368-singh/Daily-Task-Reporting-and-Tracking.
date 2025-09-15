import React from "react";

const TaskFilters = ({ filters, setFilters }) => {
  return (
    <div className="mb-6 bg-[#2a2a2a] p-4 rounded-xl shadow-md border border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Date Filter */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Date</label>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 outline-none"
        />
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Status</label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 outline-none"
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Search Filter */}
      <div className="md:col-span-2">
        <label className="block text-sm text-gray-400 mb-1">
          Username / Employee ID
        </label>
        <input
          type="text"
          placeholder="Search by username or employee ID..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full bg-gray-800 text-gray-200 border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 outline-none"
        />
      </div>
    </div>
  );
};

export default TaskFilters;
