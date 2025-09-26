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
    selectedProjects: [],
    projectData: {},
    date: new Date().toISOString().split("T")[0],
    team: user?.team || "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customModules, setCustomModules] = useState({});

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
    setFormData({ ...formData, [name]: value });
  };

  const handleProjectsChange = (selectedOptions) => {
    const selectedNames = selectedOptions
      ? selectedOptions.map((o) => o.value)
      : [];
    const newProjectData = {};
    selectedNames.forEach((name) => {
      const project = projects.find((p) => p.projectName === name);
      if (project) {
        newProjectData[name] = {
          activityLead: project.projectLead,
          modules: formData.projectData[name]?.modules || [],
          remarks: formData.projectData[name]?.remarks || {},
        };
      }
    });
    setFormData((prev) => ({
      ...prev,
      selectedProjects: selectedNames,
      projectData: newProjectData,
    }));
  };

  const handleModuleChange = (projectName, selectedOptions) => {
    const modules = selectedOptions ? selectedOptions.map((o) => o.value) : [];
    const currentModules = formData.projectData[projectName].modules;

    const newRemarks = { ...formData.projectData[projectName].remarks };
    modules.forEach((module) => {
      if (!newRemarks[module]) {
        newRemarks[module] = [{ text: "", status: "", time: "" }];
      }
    });

    currentModules.forEach((module) => {
      if (!modules.includes(module)) {
        delete newRemarks[module];
      }
    });

    setFormData((prev) => ({
      ...prev,
      projectData: {
        ...prev.projectData,
        [projectName]: {
          ...prev.projectData[projectName],
          modules,
          remarks: newRemarks,
        },
      },
    }));
  };

  const handleModuleRemarkChange = (
    projectName,
    moduleName,
    remarkIndex,
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      projectData: {
        ...prev.projectData,
        [projectName]: {
          ...prev.projectData[projectName],
          remarks: {
            ...prev.projectData[projectName].remarks,
            [moduleName]: prev.projectData[projectName].remarks[moduleName].map(
              (remark, index) =>
                index === remarkIndex ? { ...remark, [field]: value } : remark
            ),
          },
        },
      },
    }));
  };

  const addModuleRemark = (projectName, moduleName) => {
    setFormData((prev) => ({
      ...prev,
      projectData: {
        ...prev.projectData,
        [projectName]: {
          ...prev.projectData[projectName],
          remarks: {
            ...prev.projectData[projectName].remarks,
            [moduleName]: [
              ...prev.projectData[projectName].remarks[moduleName],
              { text: "", status: "", time: "" },
            ],
          },
        },
      },
    }));
  };

  const removeModuleRemark = (projectName, moduleName, remarkIndex) => {
    if (formData.projectData[projectName].remarks[moduleName].length > 1) {
      setFormData((prev) => ({
        ...prev,
        projectData: {
          ...prev.projectData,
          [projectName]: {
            ...prev.projectData[projectName],
            remarks: {
              ...prev.projectData[projectName].remarks,
              [moduleName]: prev.projectData[projectName].remarks[
                moduleName
              ].filter((_, index) => index !== remarkIndex),
            },
          },
        },
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.selectedProjects.length === 0)
      newErrors.projects = "At least one project must be selected";
    if (!formData.date) newErrors.date = "Date is required";
    const selectedDate = new Date(formData.date);
    if (selectedDate.getDay() === 0) newErrors.date = "Sunday is not allowed ";

    // Validate per project
    formData.selectedProjects.forEach((projectName) => {
      const projectData = formData.projectData[projectName];
      if (projectData.modules.length === 0) {
        newErrors[`${projectName}_modules`] =
          "At least one module must be selected for " + projectName;
      }
      if (
        projectData.modules.includes("Other") &&
        !customModules[projectName]?.trim()
      ) {
        newErrors[`${projectName}_custom`] =
          "Please specify the custom module name for " + projectName;
      }
      // Validate remarks
      Object.entries(projectData.remarks).forEach(([moduleName, remarks]) => {
        if (!remarks || remarks.length === 0) {
          newErrors[`${projectName}_${moduleName}_remarks`] =
            "At least one remark is required";
        } else {
          remarks.forEach((remark, index) => {
            if (!remark?.text?.trim())
              newErrors[`${projectName}_${moduleName}_text_${index}`] =
                "Remark text is required";
            if (!remark?.time || remark.time < 0)
              newErrors[`${projectName}_${moduleName}_time_${index}`] =
                "Time spent (MM) is required";
            if (!remark?.status)
              newErrors[`${projectName}_${moduleName}_status_${index}`] =
                "Status is required";
          });
        }
      });
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

    let allModules = [];
    let allActivityLeads = formData.selectedProjects.map(
      (p) => formData.projectData[p]?.activityLead || ""
    );
    let allModuleRemarks = {};
    formData.selectedProjects.forEach((p) => {
      let projectModules = [...formData.projectData[p].modules];
      let projectRemarks = { ...formData.projectData[p].remarks };
      if (projectModules.includes("Other") && customModules[p]?.trim()) {
        const custom = customModules[p].trim();
        const index = projectModules.indexOf("Other");
        if (index > -1) {
          projectModules[index] = custom;
        }
        if (projectRemarks["Other"]) {
          projectRemarks[custom] = projectRemarks["Other"];
          delete projectRemarks["Other"];
        }
      }
      projectModules.forEach((m) => {
        allModules.push(m);
        const key = `${p}_${m}`;
        if (!allModuleRemarks[key]) {
          allModuleRemarks[key] = projectRemarks[m] || [];
        }
      });
    });
    const formattedData = {
      user_name: formData.user_name,
      projects: formData.selectedProjects,
      modules: allModules,
      date: formData.date,
      activity_leads: allActivityLeads,
      team: formData.team,
      moduleRemarks: allModuleRemarks,
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
        setCustomModules({});
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

  const projectOptions = projects.map((p) => ({
    value: p.projectName,
    label: p.projectName,
  }));
  const selectedProjectOptions = projectOptions.filter((opt) =>
    formData.selectedProjects.includes(opt.value)
  );
  const customStyles = {
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
      backgroundColor: isSelected ? "#ef4444" : isFocused ? "#4a5568" : "#333",
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
  };

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

          {/* Projects */}
          <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-md">
            <label className="block text-sm font-semibold mb-2">
              Projects <span className="text-red-500">*</span>
            </label>
            <Select
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{ Option: CheckboxOption }}
              options={projectOptions}
              value={selectedProjectOptions}
              onChange={handleProjectsChange}
              placeholder="-- Select Project(s) --"
              styles={customStyles}
            />
            {errors.projects && (
              <p className="text-red-500 text-sm mt-1">{errors.projects}</p>
            )}
          </div>

          {/* Date */}
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

          {/* Per Project Sections */}
          {formData.selectedProjects.map((projectName) => {
            const project = projects.find((p) => p.projectName === projectName);
            const projectData = formData.projectData[projectName];
            const availableModules = project?.modules || [];
            const moduleOptions = [
              ...availableModules.map((m) => ({ value: m, label: m })),
              { value: "Other", label: "Other" },
            ];
            const selectedModuleValues = moduleOptions.filter((opt) =>
              projectData.modules.includes(opt.value)
            );

            return (
              <div
                key={projectName}
                className="bg-gray-800 p-5 rounded-2xl border border-gray-700 shadow-md space-y-4"
              >
                <h3 className="text-xl font-semibold text-white">
                  {projectName}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Activity Lead
                    </label>
                    <input
                      type="text"
                      value={projectData.activityLead}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl bg-[#222] border border-gray-600 text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Module(s) <span className="text-red-500">*</span>
                    </label>
                    <Select
                      isMulti
                      closeMenuOnSelect={(option) => option.value === "Other"}
                      hideSelectedOptions={false}
                      components={{ Option: CheckboxOption }}
                      options={moduleOptions}
                      value={selectedModuleValues}
                      onChange={(selected) =>
                        handleModuleChange(projectName, selected)
                      }
                      placeholder="-- Select Module(s) --"
                      styles={customStyles}
                    />
                    {projectData.modules.includes("Other") && (
                      <input
                        type="text"
                        placeholder="Enter custom module"
                        value={customModules[projectName] || ""}
                        onChange={(e) =>
                          setCustomModules((prev) => ({
                            ...prev,
                            [projectName]: e.target.value,
                          }))
                        }
                        className="mt-2 w-full px-4 py-3 rounded-xl bg-[#333] border border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                      />
                    )}
                    {errors[`${projectName}_modules`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`${projectName}_modules`]}
                      </p>
                    )}
                    {errors[`${projectName}_custom`] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[`${projectName}_custom`]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Module Remarks */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold mb-2">
                    Sub - Activity <span className="text-red-500">*</span>
                  </label>
                  {projectData.modules.map((moduleName) => (
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
                          onClick={() =>
                            addModuleRemark(projectName, moduleName)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                        >
                          + Add Remark
                        </button>
                      </div>

                      {projectData.remarks[moduleName]?.map(
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
                                      projectName,
                                      moduleName,
                                      remarkIndex,
                                      "text",
                                      e.target.value.slice(0, 200)
                                    )
                                  }
                                  className="px-4 py-2 rounded-xl bg-[#2a2a2a] border border-gray-600 resize-none break-words w-full"
                                  rows={1}
                                />
                                {errors[
                                  `${projectName}_${moduleName}_text_${remarkIndex}`
                                ] && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {
                                      errors[
                                        `${projectName}_${moduleName}_text_${remarkIndex}`
                                      ]
                                    }
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
                                      projectName,
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
                                  <option value="In Progress">
                                    In Progress
                                  </option>
                                  <option value="Completed">Completed</option>
                                </select>
                                {errors[
                                  `${projectName}_${moduleName}_status_${remarkIndex}`
                                ] && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {
                                      errors[
                                        `${projectName}_${moduleName}_status_${remarkIndex}`
                                      ]
                                    }
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
                                      projectName,
                                      moduleName,
                                      remarkIndex,
                                      "time",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 rounded-xl bg-[#2a2a2a] border border-gray-600"
                                />
                                {errors[
                                  `${projectName}_${moduleName}_time_${remarkIndex}`
                                ] && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {
                                      errors[
                                        `${projectName}_${moduleName}_time_${remarkIndex}`
                                      ]
                                    }
                                  </p>
                                )}
                              </div>

                              {/* Remove Button */}
                              <div className="flex flex-col w-6 md:w-12 md:mt-0">
                                {projectData.remarks[moduleName].length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeModuleRemark(
                                        projectName,
                                        moduleName,
                                        remarkIndex
                                      )
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

                      {errors[`${projectName}_${moduleName}_remarks`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[`${projectName}_${moduleName}_remarks`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

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
