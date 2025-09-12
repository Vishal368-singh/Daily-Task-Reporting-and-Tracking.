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
    date: new Date().toISOString().split("T")[0],
    activity_lead: "",
    team: user?.team || "",
    remarks: [{ text: "", hours: "", minutes: "" }],
  };

  const [formData, setFormData] = useState(initialFormData);
  console.log("Logged in user from context:", formData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (loggedInUser) {
      setFormData((prev) => ({ ...prev, user_name: loggedInUser }));
    }
  }, [loggedInUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRemarkChange = (index, field, value) => {
    const updatedRemarks = [...formData.remarks];
    updatedRemarks[index][field] = value;
    setFormData({ ...formData, remarks: updatedRemarks });
  };

  const addRemark = () => {
    setFormData((prev) => ({
      ...prev,
      remarks: [...prev.remarks, { text: "", hours: "", minutes: "" }],
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
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.date) newErrors.date = "Date is required";

    // Sunday validation
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
      if (
        (!remark.hours || remark.hours < 0) &&
        (!remark.minutes || remark.minutes < 0)
      ) {
        newErrors[`remarkTime${index}`] = "Time spent is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
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

    console.log("Form submitted:", formattedData);

    Swal.fire({
      title: "✅ Success!",
      text: `Task submitted successfully!`,
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-[#1f1f1f] rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-700">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-white mb-8 tracking-wide">
          📝 Daily Task Sheet
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-gray-200">
          {/* Resource Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Resource Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              readOnly
              className="w-full bg-[#333] text-gray-300 border border-gray-600 rounded-xl px-4 py-2.5 cursor-not-allowed"
            />
          </div>

          {/* Project & Module */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Project(s) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="project"
                value={formData.project}
                onChange={handleChange}
                placeholder="Enter projects, comma separated"
                className="w-full border border-gray-600 rounded-xl px-4 py-2.5 bg-[#333]"
              />
              {errors.project && (
                <p className="text-red-500 text-sm">{errors.project}</p>
              )}
            </div>

            {/* Module */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Module(s) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="module"
                value={formData.module}
                onChange={handleChange}
                placeholder="Enter modules, comma separated"
                className="w-full border border-gray-600 rounded-xl px-4 py-2.5 bg-[#333]"
              />
              {errors.module && (
                <p className="text-red-500 text-sm">{errors.module}</p>
              )}
            </div>
          </div>

          {/* Status & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-600 rounded-xl px-4 py-2.5 bg-[#333]"
              >
                <option value="">Select status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-600 rounded-xl px-4 py-2.5 bg-[#333]"
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date}</p>
              )}
            </div>
          </div>

          {/* Activity Lead & Team */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Activity Lead <span className="text-red-500">*</span>
              </label>
              <select
                name="activity_lead"
                value={formData.activity_lead}
                onChange={handleChange}
                className="w-full border border-gray-600 rounded-xl px-4 py-2.5 bg-[#333]"
              >
                <option value="">Select Lead</option>
                <option value="Subodh Sir">Subodh Sir</option>
                <option value="Aditya Sir">Aditya Sir</option>
                <option value="Atul Sir">Atul Sir</option>
                <option value="Yogendra Sir">Yogendra Sir</option>
              </select>
              {errors.activity_lead && (
                <p className="text-red-500 text-sm">{errors.activity_lead}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Team</label>
              <input
                type="text"
                name="team"
                value={formData.team}
                readOnly
                className="w-full bg-[#333] text-gray-300 border border-gray-600 rounded-xl px-4 py-2.5 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Remarks */}

          <div>
            <label className="block text-sm font-semibold mb-2">
              Remarks / Blockers (with time spent){" "}
              <span className="text-red-500">*</span>
            </label>

            {formData.remarks.map((remark, index) => (
              <div key={index} className="flex gap-4 mb-3 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter remark"
                    value={remark.text}
                    onChange={(e) =>
                      handleRemarkChange(index, "text", e.target.value)
                    }
                    className="w-full border border-gray-600 rounded-xl px-4 py-2.5 bg-[#333]"
                  />
                  {errors[`remarkText${index}`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`remarkText${index}`]}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="HH"
                    min="0"
                    value={remark.hours}
                    onChange={(e) =>
                      handleRemarkChange(index, "hours", e.target.value)
                    }
                    className="w-20 border border-gray-600 rounded-xl px-3 py-2.5 bg-[#333]"
                  />
                  <input
                    type="number"
                    placeholder="MM"
                    min="0"
                    max="59"
                    value={remark.minutes}
                    onChange={(e) =>
                      handleRemarkChange(index, "minutes", e.target.value)
                    }
                    className="w-20 border border-gray-600 rounded-xl px-3 py-2.5 bg-[#333]"
                  />
                </div>
                {errors[`remarkTime${index}`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`remarkTime${index}`]}
                  </p>
                )}

                {formData.remarks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRemark(index)}
                    className="text-red-400 hover:text-red-600 font-bold ml-2"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addRemark}
              className="mt-2 bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-600"
            >
              ➕ Add Remark
            </button>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-red-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:bg-red-600 transition-all duration-300"
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
