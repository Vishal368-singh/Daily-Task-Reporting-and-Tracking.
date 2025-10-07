import React, { useState, useEffect } from "react";

const leads = [
  "Aditya Sareen",
  "Dr Atul Kapoor",
  "Subodh Kumar",
  "Yogendra Sir",
];

const ProjectForm = ({ onAdd, initialData, onUpdate, onCancel }) => {
  const [form, setForm] = useState({
    projectName: "",
    client: "",
    category: "",
    projectLead: "",
    modules: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        modules: initialData.modules?.join(", ") || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.projectName.trim())
      newErrors.projectName = "Project Name is required.";
    if (!form.client.trim()) newErrors.client = "Client name is required.";
    if (!form.projectLead.trim())
      newErrors.projectLead = "Please select a project lead.";
    if (!form.modules.trim())
      newErrors.modules = "At least one module is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const projectData = {
      ...form,
      modules: form.modules.split(",").map((m) => m.trim()),
    };

    if (initialData) {
      onUpdate(projectData);
    } else {
      onAdd(projectData);
    }

    // Reset
    setForm({
      projectName: "",
      client: "",
      category: "",
      projectLead: "",
      modules: "",
    });
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#2a2a2a] p-6 rounded-2xl shadow-md flex flex-col gap-5"
    >
      <h3 className="text-lg font-semibold text-white text-center mb-1">
        {initialData ? "Update Project" : "Add Project"}
      </h3>
      {/* Project Name */}
      <div className="flex flex-col">
        <label className="text-white mb-1">
          Project <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="projectName"
          value={form.projectName}
          onChange={handleChange}
          className="p-2 rounded-md bg-gray-800 text-white border border-gray-600"
        />
        {errors.projectName && (
          <p className="text-red-400 text-sm mt-1">{errors.projectName}</p>
        )}
      </div>

      {/* Client */}
      <div className="flex flex-col">
        <label className="text-white mb-1">
          Client <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="client"
          value={form.client}
          onChange={handleChange}
          className="p-2 rounded-md bg-gray-800 text-white border border-gray-600"
        />
        {errors.client && (
          <p className="text-red-400 text-sm mt-1">{errors.client}</p>
        )}
      </div>

      {/* Category */}
      <div className="flex flex-col">
        <label className="text-white mb-1">Category</label>
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          className="p-2 rounded-md bg-gray-800 text-white border border-gray-600"
        />
      </div>

      {/* Project Lead */}
      <div className="flex flex-col">
        <label className="text-white mb-1">
          Project Lead <span className="text-red-500">*</span>
        </label>
        <select
          name="projectLead"
          value={form.projectLead}
          onChange={handleChange}
          className="p-2 rounded-md bg-gray-800 text-white border border-gray-600"
        >
          <option value="">Select Lead</option>
          {leads.map((lead, i) => (
            <option key={i} value = {lead}>
              {lead}
            </option>
          ))}
        </select>
        {errors.projectLead && (
          <p className="text-red-400 text-sm mt-1">{errors.projectLead}</p>
        )}
      </div>

      {/* Modules */}
      <div className="flex flex-col">
        <label className="text-white mb-1">
          Modules (comma separated) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="modules"
          value={form.modules}
          onChange={handleChange}
          className="p-2 rounded-md bg-gray-800 text-white border border-gray-600"
        />
        {errors.modules && (
          <p className="text-red-400 text-sm mt-1">{errors.modules}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-900"
        >
          {initialData ? "Update Project" : "Add Project"}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
