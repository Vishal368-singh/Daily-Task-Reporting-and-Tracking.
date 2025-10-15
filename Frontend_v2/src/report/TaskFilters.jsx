import React, { useCallback, useState } from "react";
import debounce from "lodash.debounce";

const defaultFilters = {
  fromDate: "",
  toDate: "",
  status: "",
  search: "",
  employeeId: "",
};

const TaskFilters = ({ filters, setFilters, onClear, fetchSuggestions }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounced function to fetch predictions from DB
  const debouncedFetch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }
      try {
        const results = await fetchSuggestions(query);
        setSuggestions(results || []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    }, 400),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters({ ...filters, search: value, employeeId: "" }); // reset employeeId on typing
    debouncedFetch(value);
  };

  // Handle selecting a suggestion
  const handleSelect = (item) => {
    setFilters({
      ...filters,
      search: `${item.user_name} (${item.employeeId})`, // display text
      employeeId: item.employeeId, // actual filter key
    });
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    setSuggestions([]);
    setShowDropdown(false);
    if (onClear) onClear(defaultFilters);
  };

  return (
    <div className="mb-6 bg-gradient-to-br from-zinc-900 to-black p-4 rounded-xl shadow-lg border border-zinc-800 grid grid-cols-1 md:grid-cols-6 gap-4">
      {/* From Date Filter */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1">From Date</label>
        <input
          type="date"
          aria-label="Filter from date"
          value={filters.fromDate || ""}
          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
          className="w-full bg-zinc-950 text-zinc-200 border border-zinc-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 outline-none"
        />
      </div>

      {/* To Date Filter */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1">To Date</label>
        <input
          type="date"
          aria-label="Filter to date"
          min={filters.fromDate}
          value={filters.toDate || ""}
          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
          className="w-full bg-zinc-950 text-zinc-200 border border-zinc-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 outline-none"
        />
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Status</label>
        <select
          aria-label="Filter by status"
          value={filters.status || ""}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="w-full bg-zinc-950 text-zinc-200 border border-zinc-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 outline-none"
        >
          <option value="">All</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>

      {/* Search Filter with dropdown */}
      <div className="md:col-span-2 relative">
        <label className="block text-sm text-zinc-400 mb-1">
          Username / Employee ID
        </label>
        <input
          type="text"
          aria-label="Search by username or employee ID"
          placeholder="Search by username or employee ID..."
          value={filters.search || ""}
          onChange={handleSearchChange}
          onKeyDown={(e) => {
            if (e.key === "Escape") handleClear();
            if (e.key === "Enter") e.preventDefault();
          }}
          className="w-full bg-zinc-950 text-zinc-200 border border-zinc-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 outline-none"
        />

        {/* Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg z-10 max-h-48 overflow-auto">
            {suggestions.map((item, idx) => (
              <li
                key={idx}
                onClick={() => handleSelect(item)}
                className="px-3 py-2 cursor-pointer hover:bg-zinc-800 text-zinc-200"
              >
                {item.user_name} ({item.employeeId})
              </li>
            ))}
          </ul>
        )}
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
