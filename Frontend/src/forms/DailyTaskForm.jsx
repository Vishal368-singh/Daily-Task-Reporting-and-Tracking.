import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";

const DailyTaskForm = ({ loggedInUser }) => {
  const { user } = useContext(AuthContext);

  const initialFormData = {
    user_name: user?.username || loggedInUser || "",
    project: "",
    module: "",
    status: "",
    date: "",
    activity_lead: "",
    subactivity: "",
    remarks: "",
    time_duration: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (loggedInUser) {
      setFormData((prev) => ({ ...prev, user_name: loggedInUser }));
    }
  }, [loggedInUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    Swal.fire({
      title: "✅ Success!",
      text: `Task submitted successfully!`,
      icon: "success",
      confirmButtonColor: "#ef4444", // red accent
    }).then(() => {
      setFormData({ ...initialFormData, user_name: formData.user_name });
    });
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-[#2c2c2c] rounded-2xl shadow-2xl p-8 md:p-10">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-white mb-8 tracking-wide">
          Daily Task Sheet
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-gray-200">
          {/* Resource Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Resource Name
            </label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              readOnly
              className="w-full bg-[#3a3a3a] text-gray-200 border border-gray-600 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* Project & Module */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Project
              </label>
              <input
                type="text"
                name="project"
                value={formData.project}
                onChange={handleChange}
                placeholder="Enter project name"
                className="w-full border border-gray-600 rounded-xl px-4 py-2.5 bg-[#3a3a3a] focus:ring-2 focus:ring-red-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Module</label>
              <input
                type="text"
                name="module"
                value={formData.module}
                onChange={handleChange}
                placeholder="Enter module name"
                className="w-full border border-gray-600 rounded-xl px-4 py-2.5 bg-[#3a3a3a] focus:ring-2 focus:ring-red-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Status & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-600 rounded-xl px-4 py-2.5 bg-[#3a3a3a] focus:ring-2 focus:ring-red-500 focus:outline-none"
                required
              >
                <option value="">Select status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-600 rounded-xl px-4 py-2.5 bg-[#3a3a3a] focus:ring-2 focus:ring-red-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Activity Lead & Sub-Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Activity Lead
              </label>
              <select
                name="activity_lead"
                value={formData.activity_lead}
                onChange={handleChange}
                className="w-full border border-gray-600 rounded-xl px-4 py-2.5 bg-[#3a3a3a] focus:ring-2 focus:ring-red-500 focus:outline-none"
                required
              >
                <option value="">Select Lead</option>
                <option value="Subodh Sir">Subodh Sir</option>
                <option value="Aditya Sir">Aditya Sir</option>
                <option value="Atul Sir">Atul Sir</option>
                <option value="Yogendra Sir">Yogendra Sir</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Sub-Activity
              </label>
              <input
                type="text"
                name="subactivity"
                value={formData.subactivity}
                onChange={handleChange}
                placeholder="Enter sub-activity"
                className="w-full border border-gray-600 rounded-xl px-4 py-2.5 bg-[#3a3a3a] focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Remarks / Blockers
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Enter remarks or blockers"
              className="w-full border border-gray-600 rounded-xl px-4 py-2.5 h-28 bg-[#3a3a3a] focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
            />
          </div>

          {/* Time Duration */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Time Duration (hrs)
            </label>
            <input
              type="text"
              name="time_duration"
              value={formData.time_duration}
              onChange={handleChange}
              placeholder="e.g., 2h 30m"
              className="w-full border border-gray-600 rounded-xl px-4 py-2.5 bg-[#3a3a3a] focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-red-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-red-600 hover:shadow-xl transition-all duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DailyTaskForm;
