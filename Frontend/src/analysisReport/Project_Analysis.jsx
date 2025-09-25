import React, { useEffect, useState } from "react";
import {
  FaIdCard,
  FaUser,
  FaProjectDiagram,
  FaClock,
  FaSpinner,
} from "react-icons/fa";
import { getDailySummary, getProjectSummaryToday } from "../api/taskApi";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

const Project_Analysis = () => {
  const [report, setReport] = useState([]);
  const [projectSummary, setProjectSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");

  useEffect(() => {
    Promise.all([getDailySummary(), getProjectSummaryToday()])
      .then(([dailyRes, projectRes]) => {
        setReport(dailyRes.data);
        setProjectSummary(projectRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 flex items-center justify-center">
        <div className="bg-[#2a2a2a] p-8 rounded-2xl shadow-lg flex flex-col items-center space-y-4">
          <FaSpinner className="text-blue-500 text-4xl animate-spin" />
          <p className="text-gray-400 text-lg">Loading analysis report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
      
        {/* ================= Employee Report Table ================= */}
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
            Daily Project Analysis
          </h2>
          <p className="text-gray-400 text-lg mb-6">
            Comprehensive overview of employee project activities
          </p>

          <div className="bg-[#2a2a2a] rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                <FaProjectDiagram className="text-blue-500" />
                <span>Employee Performance Report : {today}</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-white">
                      <div className="flex items-center space-x-2">
                        <FaIdCard />
                        <span>Employee ID</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-white">
                      <div className="flex items-center space-x-2">
                        <FaUser />
                        <span>Employee Name</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-white">
                      <div className="flex items-center space-x-2">
                        <FaProjectDiagram />
                        <span>Project</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-white">
                      <div className="flex items-center space-x-2">
                        <FaClock />
                        <span>Total Duration</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <FaProjectDiagram className="text-gray-600 text-3xl" />
                          <span>No records found</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    report.map((r, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-700 hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.01]"
                      >
                        <td className="px-6 py-4 text-sm text-gray-300 font-medium">
                          {r._id.employeeId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {r._id.employee}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {r._id.project}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-blue-400">
                          {Math.floor(r.totalDuration / 60)} hrs{" "}
                          {r.totalDuration % 60} mins
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ================= Project Summary & Pie Chart ================= */}

        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Project Summary Today
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Table */}
            <div className="bg-[#2a2a2a] rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <FaProjectDiagram className="text-green-500" />
                  <span>Project Overview</span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-green-600 to-green-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        Project
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        Employees
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        Total Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectSummary.length === 0 ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No project records today
                        </td>
                      </tr>
                    ) : (
                      projectSummary.map((p, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-700 hover:bg-gray-800"
                        >
                          <td className="px-6 py-4 text-sm text-gray-300 font-medium">
                            {p.project}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {p.totalEmployees}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-green-400">
                            {Math.floor(p.totalTimeSpent / 60)} hrs{" "}
                            {p.totalTimeSpent % 60}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-[#2a2a2a] rounded-2xl shadow-lg border border-gray-700 p-6 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectSummary}
                    dataKey="totalTimeSpent"
                    nameKey="project"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {projectSummary.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project_Analysis;
