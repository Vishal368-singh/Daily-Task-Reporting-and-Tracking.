import React from "react";

const TaskFilters = ({ filters, setFilters, onClear }) => {
  const handleClear = () => {
    const cleared = {
      fromDate: "",
      toDate: "",
      status: "",
      search: "",
    };
    setFilters(cleared);
    if (onClear) onClear(cleared);
  };

  return (
    <div className="mb-6 bg-gradient-to-br from-zinc-900 to-black p-4 rounded-xl shadow-lg border border-zinc-800 grid grid-cols-1 md:grid-cols-6 gap-4">
      {/* From Date Filter */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1">From Date</label>
        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
          className="w-full bg-zinc-950 text-zinc-200 border border-zinc-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 outline-none"
        />
      </div>

      {/* To Date Filter */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1">To Date</label>
        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
          className="w-full bg-zinc-950 text-zinc-200 border border-zinc-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 outline-none"
        />
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Status</label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="w-full bg-zinc-950 text-zinc-200 border border-zinc-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 outline-none"
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Search Filter */}
      <div className="md:col-span-2">
        <label className="block text-sm text-zinc-400 mb-1">
          Username / Employee ID
        </label>
        <input
          type="text"
          placeholder="Search by username or employee ID..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Escape") handleClear();
          }}
          className="w-full bg-zinc-950 text-zinc-200 border border-zinc-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 outline-none"
        />
      </div>

      {/* Clear Filters Button */}
      <div className="flex items-end">
        <button
          onClick={handleClear}
          className="flex items-center justify-center w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default TaskFilters;
