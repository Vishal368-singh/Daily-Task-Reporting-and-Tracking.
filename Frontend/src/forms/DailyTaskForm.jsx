import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { createTask, getUserTasks } from "../api/taskApi";
import { AuthContext } from "../context/AuthContext";
import { getProjects } from "../api/projectAPI";
import TaskTable from "../report/TaskTable";
import Select, { components as RSComponents } from "react-select";

const CheckboxOption = (props) => (
  <div>
    <RSComponents.Option {...props}>
      <input
        type="checkbox"
        checked={props.isSelected}
        onChange={() => null}
        style={{ marginRight: "10px" }}
      />
      <label>{props.label}</label>
    </RSComponents.Option>
  </div>
);

const DailyTaskForm = ({ loggedInUser }) => {
  const { user } = useContext(AuthContext);

  const initialFormData = {
    user_name: user?.username || loggedInUser || "",
    project: "",
    module: [],
    date: new Date().toISOString().split("T")[0],
    activity_lead: "",
    team: user?.team || "",
    moduleRemarks: {},
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [projects, setProjects] = useState([]);
  const [availableModules, setAvailableModules] = useState([]);
  const [customModule, setCustomModule] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects and user tasks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await getProjects();
        setProjects(projectRes.data);
        await fetchTasks();
      } catch (err) {
        console.error("Failed to fetch projects or tasks:", err);
      }
    };
    fetchData();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getUserTasks();
      console.log(response.data);

      setTasks(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setLoading(false);
    }
  };

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
        module: [],
      });
      setAvailableModules(selected?.modules || []);
      setCustomModule("");
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleModuleChange = (selectedOptions) => {
    const modules = selectedOptions ? selectedOptions.map((o) => o.value) : [];
    const currentModules = formData.module;

    // Initialize remarks for new modules
    const newModuleRemarks = { ...formData.moduleRemarks };
    modules.forEach((module) => {
      if (!newModuleRemarks[module]) {
        newModuleRemarks[module] = [{ text: "", status: "", time: "" }];
      }
    });

    // Remove remarks for unselected modules
    currentModules.forEach((module) => {
      if (!modules.includes(module)) {
        delete newModuleRemarks[module];
      }
    });

    setFormData({
      ...formData,
      module: modules,
      moduleRemarks: newModuleRemarks,
    });
  };

  const handleModuleRemarkChange = (moduleName, remarkIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      moduleRemarks: {
        ...prev.moduleRemarks,
        [moduleName]: prev.moduleRemarks[moduleName].map((remark, index) =>
          index === remarkIndex ? { ...remark, [field]: value } : remark
        ),
      },
    }));
  };

  const addModuleRemark = (moduleName) => {
    setFormData((prev) => ({
      ...prev,
      moduleRemarks: {
        ...prev.moduleRemarks,
        [moduleName]: [
          ...prev.moduleRemarks[moduleName],
          { text: "", status: "", time: "" },
        ],
      },
    }));
  };

  const removeModuleRemark = (moduleName, remarkIndex) => {
    if (formData.moduleRemarks[moduleName].length > 1) {
      setFormData((prev) => ({
        ...prev,
        moduleRemarks: {
          ...prev.moduleRemarks,
          [moduleName]: prev.moduleRemarks[moduleName].filter(
            (_, index) => index !== remarkIndex
          ),
        },
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.project.trim()) newErrors.project = "Project is required";
    if (formData.module.length === 0) {
      newErrors.module = "At least one module must be selected";
    } else if (formData.module.includes("Other") && !customModule.trim()) {
      newErrors.module = "Please specify the custom module name";
    }
    if (!formData.date) newErrors.date = "Date is required";
    const selectedDate = new Date(formData.date);
    if (selectedDate.getDay() === 0)
      newErrors.date = "Sunday is not allowed (Leave)";
    if (!formData.activity_lead)
      newErrors.activity_lead = "Activity Lead is required";

    // Validate module-specific remarks
    formData.module.forEach((moduleName) => {
      const remarks = formData.moduleRemarks[moduleName];
      if (!remarks || remarks.length === 0) {
        newErrors[`${moduleName}_remarks`] = "At least one remark is required";
      } else {
        remarks.forEach((remark, index) => {
          if (!remark?.text?.trim())
            newErrors[`${moduleName}_text_${index}`] =
              "Remark text is required";
          if (!remark?.time || remark.time < 0)
            newErrors[`${moduleName}_time_${index}`] =
              "Time spent (MM) is required";
          if (!remark?.status)
            newErrors[`${moduleName}_status_${index}`] = "Status is required";
        });
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        title: "⚠️ Validation Error",
        text: "Please correct the highlighted fields.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    const finalModules = formData.module
      .filter((m) => m !== "Other")
      .concat(
        formData.module.includes("Other") && customModule.trim()
          ? [customModule.trim()]
          : []
      );

    const formattedData = { ...formData, module: finalModules };

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
        // FIX: Reset the customModule state to clear the input field
        setCustomModule("");
        fetchTasks();
        setErrors({});
      });
    } catch (error) {
      Swal.fire({
        title: "❌ Submission Failed",
        text: error.response?.data?.message || "An unexpected error occurred.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const moduleOptions = [
    ...availableModules.map((m) => ({ value: m, label: m })),
    { value: "Other", label: "Other" },
  ];
  const selectedModuleValues = moduleOptions.filter((opt) =>
    formData.module.includes(opt.value)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 text-gray-200">
      <div className="w-full max-w-6xl bg-[#1f1f1f] rounded-3xl shadow-2xl p-10 border border-gray-700">
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-center text-white mb-8 tracking-wider">
          Daily Task Sheet
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8 text-gray-200">
          {/* Resource & Team */}
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
                  <option key={p.projectName} value={p.projectName}>
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
              <Select
                isMulti
                closeMenuOnSelect={(option) => option.value === "Other"}
                hideSelectedOptions={false}
                components={{ Option: CheckboxOption }}
                name="module"
                options={moduleOptions}
                value={selectedModuleValues}
                onChange={handleModuleChange}
                placeholder="-- Select Module(s) --"
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: "#333",
                    borderColor: "#4a5568",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: "#ef4444",
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "#333",
                  }),
                  option: (base, { isFocused, isSelected }) => ({
                    ...base,
                    backgroundColor: isSelected
                      ? "#ef4444"
                      : isFocused
                      ? "#4a5568"
                      : "#333",
                    color: "#fff",
                    "&:active": {
                      backgroundColor: "#ef4444",
                    },
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#4a5568",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#fff",
                  }),
                }}
              />
              {formData.module.includes("Other") && (
                <input
                  type="text"
                  placeholder="Enter custom module"
                  value={customModule}
                  onChange={(e) => setCustomModule(e.target.value)}
                  className="mt-2 w-full px-4 py-3 rounded-xl bg-[#333] border border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                />
              )}
              {errors.module && (
                <p className="text-red-500 text-sm mt-1">{errors.module}</p>
              )}
            </div>
          </div>

          {/* Module Remarks Section */}
          <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-md space-y-4">
            <label className="block text-sm font-semibold mb-2">
              Sub - Activity <span className="text-red-500">*</span>
            </label>
            {formData.module.map((moduleName) => (
              <div
                key={moduleName}
                className="p-4 bg-[#2a2a2a] rounded-xl border border-gray-700 shadow-inner"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-white">
                    {moduleName}
                  </h4>
                  <button
                    type="button"
                    onClick={() => addModuleRemark(moduleName)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                  >
                    + Add Remark
                  </button>
                </div>

                {formData.moduleRemarks[moduleName]?.map(
                  (remark, remarkIndex) => (
                    <div
                      key={remarkIndex}
                      className="mb-4 p-3 bg-[#333] rounded-lg border border-gray-600"
                    >
                      <div className="flex flex-col md:flex-row md:items-end md:gap-4 border-b border-gray-700 pb-4">
                        {/* Remark Text */}
                        <div className="flex flex-col flex-1">
                          <label className="text-sm font-medium mb-1">
                            Text
                          </label>
                          <textarea
                            placeholder="Enter Descriptions (max 200 chars)"
                            value={remark.text || ""}
                            onChange={(e) =>
                              handleModuleRemarkChange(
                                moduleName,
                                remarkIndex,
                                "text",
                                e.target.value.slice(0, 200)
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-[#2a2a2a] border border-gray-600 resize-none break-words w-full"
                            rows={1}
                          />
                          {errors[`${moduleName}_text_${remarkIndex}`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`${moduleName}_text_${remarkIndex}`]}
                            </p>
                          )}
                        </div>

                        {/* Status */}
                        <div className="flex flex-col w-full md:w-40">
                          <label className="text-sm font-medium mb-1">
                            Status
                          </label>
                          <select
                            value={remark.status || ""}
                            onChange={(e) =>
                              handleModuleRemarkChange(
                                moduleName,
                                remarkIndex,
                                "status",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 rounded-xl bg-[#2a2a2a] border border-gray-600"
                          >
                            <option value="">-- Select status --</option>
                            <option value="On Hold">On Hold</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                          {errors[`${moduleName}_status_${remarkIndex}`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`${moduleName}_status_${remarkIndex}`]}
                            </p>
                          )}
                        </div>

                        {/* Time */}
                        <div className="flex flex-col w-full md:w-28">
                          <label className="text-sm font-medium mb-1">
                            Time (MM)
                          </label>
                          <input
                            type="number"
                            placeholder="MM"
                            min="0"
                            value={remark.time || ""}
                            onChange={(e) =>
                              handleModuleRemarkChange(
                                moduleName,
                                remarkIndex,
                                "time",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#2a2a2a] border border-gray-600"
                          />
                          {errors[`${moduleName}_time_${remarkIndex}`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`${moduleName}_time_${remarkIndex}`]}
                            </p>
                          )}
                        </div>

                        {/* Remove Button */}
                        <div className="flex items-center justify-center md:w-12 mt-2 md:mt-0">
                          {formData.moduleRemarks[moduleName].length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removeModuleRemark(moduleName, remarkIndex)
                              }
                              className="text-red-400 hover:text-red-600 font-bold text-xl"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}

                {errors[`${moduleName}_remarks`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`${moduleName}_remarks`]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="text-center mt-6">
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold px-10 py-3 rounded-2xl shadow-lg transition">
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="bg-[#2a2a2a] mt-5 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-400">Loading...</p>
        ) : (
          <div className="p-6 overflow-x-auto">
            <TaskTable tasks={tasks} loggedInUserRole={user?.role} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyTaskForm;
