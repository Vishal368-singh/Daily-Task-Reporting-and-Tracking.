import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { createTask } from "../api/taskApi";
import { AuthContext } from "../context/AuthContext";
import { getProjects } from "../api/projectAPI";

const DailyTaskForm = ({ loggedInUser }) => {
  const { user } = useContext(AuthContext);

  const initialFormData = {
    user_name: user?.username || loggedInUser || "",
    project: "",
    module: "",
    date: new Date().toISOString().split("T")[0],
    activity_lead: "",
    team: user?.team || "",
    remarks: [{ text: "", minutes: "", status: "" }],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      setFormData((prev) => ({ ...prev, user_name: loggedInUser }));
    }
  }, [loggedInUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "project") {
      const selected = projects.find((p) => p.projectName === value);
      setFormData({
        ...formData,
        project: value,
        activity_lead: selected ? selected.projectLead : "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleRemarkChange = (index, field, value) => {
    const updatedRemarks = [...formData.remarks];
    updatedRemarks[index][field] = value;
    setFormData({ ...formData, remarks: updatedRemarks });
  };

  const addRemark = () => {
    setFormData((prev) => ({
      ...prev,
      remarks: [...prev.remarks, { text: "", minutes: "", status: "" }],
    }));
  };

  const removeRemark = (index) => {
    setFormData((prev) => ({
      ...prev,
      remarks: prev.remarks.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.project.trim()) newErrors.project = "Project is required";
    if (!formData.module.trim()) newErrors.module = "Module is required";
    if (!formData.date) newErrors.date = "Date is required";

    const selectedDate = new Date(formData.date);
    if (selectedDate.getDay() === 0) {
      newErrors.date = "Sunday is not allowed (Leave)";
    }

    if (!formData.activity_lead)
      newErrors.activity_lead = "Activity Lead is required";

    formData.remarks.forEach((remark, index) => {
      if (!remark.text.trim()) {
        newErrors[`remarkText${index}`] = "Remark is required";
      }
      if (!remark.minutes || remark.minutes < 0) {
        newErrors[`remarkTime${index}`] = "Time spent is required";
      }
      if (!remark.status)
        newErrors[`remarkStatus${index}`] = "Status is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        title: "⚠️ Validation Error",
        text: "Please correct the highlighted errors.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    const formattedData = {
      ...formData,
      project: formData.project
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
      module: formData.module
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
    };

    try {
      await createTask(formattedData);
      Swal.fire({
        title: "✅ Success!",
        text: "Task submitted successfully!",
        icon: "success",
        confirmButtonColor: "#ef4444",
      }).then(() => {
        setFormData({
          ...initialFormData,
          user_name: formData.user_name,
          team: formData.team,
        });
        setErrors({});
      });
    } catch (error) {
      console.error("Submission failed:", error);
      Swal.fire({
        title: "❌ Submission Failed",
        text: error.response?.data?.message || "An unexpected error occurred.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-[#1f1f1f] rounded-3xl shadow-2xl p-10 border border-gray-700">
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-center text-white mb-8 tracking-wider">
          Daily Task Sheet
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8 text-gray-200">
        
          {/* Resource & Team Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-md">
              <label className="block text-sm font-semibold mb-2">
                Resource Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="user_name"
                value={formData.user_name}
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-[#333] text-gray-300 cursor-not-allowed border border-gray-600"
              />
            </div>

            <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-md">
              <label className="block text-sm font-semibold mb-2">
                Team <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="team"
                value={formData.team}
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-[#333] text-gray-300 cursor-not-allowed border border-gray-600"
              />
            </div>
          </div>

          {/* Project & Activity Lead */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-md">
              <label className="block text-sm font-semibold mb-2">
                Project <span className="text-red-500">*</span>
              </label>
              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#333] border border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              >
                <option value="">-- Select Project --</option>
                {projects.map((p) => (
                  <option key={p.projectLead} value={p.projectName}>
                    {p.projectName}
                  </option>
                ))}
              </select>
              {errors.project && (
                <p className="text-red-500 text-sm mt-1">{errors.project}</p>
              )}
            </div>

            <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-md">
              <label className="block text-sm font-semibold mb-2">
                Activity Lead <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="activity_lead"
                value={formData.activity_lead}
                placeholder="Activity Leader"
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-[#222] border border-gray-600 text-gray-300"
              />
              {errors.activity_lead && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.activity_lead}
                </p>
              )}
            </div>
          </div>

          {/* Date & Module Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-md">
              <label className="block text-sm font-semibold mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#333] border border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-md">
              <label className="block text-sm font-semibold mb-2">
                Module(s) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="module"
                value={formData.module}
                onChange={handleChange}
                placeholder="Enter modules, comma separated"
                className="w-full px-4 py-3 rounded-xl bg-[#333] border border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              />
              {errors.module && (
                <p className="text-red-500 text-sm mt-1">{errors.module}</p>
              )}
            </div>
          </div>

          {/* Remarks Section */}
          <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-md space-y-4">
            <label className="block text-sm font-semibold mb-2">
              Remarks / Details <span className="text-red-500">*</span>
            </label>
            {formData.remarks.map((remark, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-start gap-4 p-4 bg-[#2a2a2a] rounded-xl border border-gray-700 shadow-inner"
              >
                {/* Remark Text */}
                <textarea
                  placeholder="Enter Descriptions (max 200 chars)"
                  value={remark.text}
                  onChange={(e) =>
                    handleRemarkChange(
                      index,
                      "text",
                      e.target.value.slice(0, 200)
                    )
                  }
                  className="flex-1 px-4 py-2 rounded-xl bg-[#333] border border-gray-600 resize-none break-words w-full"
                  rows={3}
                />
                {errors[`remarkText${index}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`remarkText${index}`]}
                  </p>
                )}

                {/* Status */}
                <select
                  value={remark.status}
                  onChange={(e) =>
                    handleRemarkChange(index, "status", e.target.value)
                  }
                  className="w-44 px-4 py-2 rounded-xl bg-[#333] border border-gray-600"
                >
                  <option value="">Select status</option>
                  <option value="On Hold">On hold</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                {errors[`remarkStatus${index}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`remarkStatus${index}`]}
                  </p>
                )}

                {/* Time */}
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="MM"
                    min="0"
                    value={remark.minutes}
                    onChange={(e) =>
                      handleRemarkChange(index, "minutes", e.target.value)
                    }
                    className="w-20 px-3 py-2 rounded-xl bg-[#333] border border-gray-600"
                  />
                </div>
                {errors[`remarkTime${index}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`remarkTime${index}`]}
                  </p>
                )}

                {/* Remove Remark */}
                {formData.remarks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRemark(index)}
                    className="text-red-400 hover:text-red-600 font-bold text-xl self-start md:self-center"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {/* Add Remark */}
            <button
              type="button"
              onClick={addRemark}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-semibold transition"
            >
              ➕ Add Detail
            </button>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-6">
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-10 py-3 rounded-2xl shadow-lg transition">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DailyTaskForm;
