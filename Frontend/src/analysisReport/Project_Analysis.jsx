// src/components/Project_Analysis.jsx

import React, { useEffect, useState } from "react";
import { sendReport } from "../api/sendReportApi";
import "./capture.css";
import { FaUser, FaProjectDiagram, FaClock, FaSpinner } from "react-icons/fa";
import domtoimage from "dom-to-image-more";
import { getDailySummary, getProjectSummaryToday } from "../api/taskApi";
import LoadingSpinner from "../common/LoadingSpinner";
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
  const captureRef = React.useRef(null);

  const handleCapture = () => {
    if (!captureRef.current) return;

    captureRef.current.classList.add("capture-mode");

    domtoimage
      .toPng(captureRef.current, {
        width: captureRef.current.scrollWidth * 2,
        height: captureRef.current.scrollHeight * 2,
        style: {
          transform: "scale(2)",
          transformOrigin: "top left",
          margin: "0px",
          border: "none ",
        },
      })
      .then(async (dataUrl) => {
        captureRef.current.classList.remove("capture-mode");

        const today = new Date()
          .toLocaleDateString("en-GB")
          .replace(/\//g, "-");

        await sendReport({
          reportDate: today,
          imageData: dataUrl,
        });

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "chart.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert("Report sent to seniors successfully ");
      })
      .catch((error) => {
        console.error("Capture failed:", error);
        captureRef.current.classList.remove("capture-mode");
      });
  };

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
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen border-none bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8">
      <button
        onClick={handleCapture}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Capture as Image
      </button>
      <div ref={captureRef} className="max-w-7xl mx-auto space-y-12">
        {/* ================= Employee Report Table ================= */}
        <div className="bg-[#2a2a2a] rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <FaProjectDiagram className="text-blue-500" />
              <span>Employee Report</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-white text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <FaUser />
                      <span>Employee Name</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-white text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <FaProjectDiagram />
                      <span>Projects</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-white text-center">
                    <div className="flex items-center justify-center space-x-2">
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
                      colSpan="3"
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
                      className="border-b border-gray-700 hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.01] text-center"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        {r._id.employee}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {r.projects.map((p) => p.project).join(", ")}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-blue-400">
                        {Math.floor(r.totalDuration / 60)} hrs{" "}
                        {r.totalDuration % 60} min
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= Project Summary & Pie Chart ================= */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Table */}
            <div className="bg-[#2a2a2a] rounded-2xl shadow-lg border border-gray-700 ">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <FaProjectDiagram className="text-green-500" />
                  <span>Project Report</span>
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
                          <td className="px-6 py-4 text-sm font-semibold text-green-400">
                            {Math.floor(p.totalTimeSpent / 60)} hrs{" "}
                            {p.totalTimeSpent % 60} min
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
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={projectSummary}
                    dataKey="totalTimeSpent"
                    nameKey="project"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ value }) => {
                      const hours = Math.floor(value / 60);
                      const minutes = value % 60;
                      return `${hours}h ${minutes}m`;
                    }}
                  >
                    {projectSummary.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => {
                      const hours = Math.floor(value / 60);
                      const minutes = value % 60;
                      return [`${hours}h ${minutes}m`, name];
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                      padding: "5px",
                    }}
                  />
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
