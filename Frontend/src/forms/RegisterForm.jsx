import { useState } from "react";
import { register } from "../api/authApi";
import Swal from "sweetalert2";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    employeeId: "",
    role: "", // Admin/User
    team: "", // Programmer/GIS
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    if (!formData.employeeId.trim())
      newErrors.employeeId = "Employee ID is required.";
    else if (!/^[A-Za-z0-9]+$/.test(formData.employeeId))
      newErrors.employeeId = "Only letters & numbers allowed.";
    if (!formData.role) newErrors.role = "Please select an access level.";
    // Only validate team if the user has the "User" access level
    if (formData.role === "User" && !formData.team)
      newErrors.team = "Please select a team for the user.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Create a new copy of the form data to modify
    const updatedFormData = { ...formData, [name]: value };

    // **IMPROVEMENT**: If accessLevel is changed to 'Admin', clear the team value.
    // This prevents sending an unnecessary 'team' field for admin users.
    if (name === "role" && value === "Admin") {
      updatedFormData.team = "";
    }

    setFormData(updatedFormData);

    // Clear the error for the field that is currently being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const dataToSend = { ...formData };
    if (dataToSend.role === "Admin") {
      delete dataToSend.team;
    }

    // You can log here to see the final data being sent
    console.log("Data being sent to backend:", dataToSend);

    try {
      const { data } = await register(dataToSend);
      console.log("Registration successful:", data);

      Swal.fire({
        title: "✅ Success!",
        text: `User ${data.username} registered successfully!`,
        icon: "success",
        confirmButtonColor: "#ef4444",
      });

      // Reset form to initial state
      setFormData({
        username: "",
        password: "",
        employeeId: "",
        role: "",
        team: "",
      });
      setErrors({}); // Also clear any lingering errors
    } catch (err) {
      Swal.fire({
        title: "❌ Error",
        text: err.response?.data?.message || "Registration failed",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // ... (rest of your JSX is correct and does not need changes)
  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#1f1f1f] rounded-2xl shadow-xl p-8 space-y-6 border border-gray-700"
      >
        <h2 className="text-3xl font-extrabold text-center text-white">
          Add New Resource
        </h2>
        <p className="text-center text-gray-400 text-sm">
          Fill in the details to register
        </p>

        {/* Username */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            className="w-full px-4 py-2.5 border border-gray-600 rounded-xl bg-[#1f1f1f] text-gray-200
                       focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            className="w-full px-4 py-2.5 border border-gray-600 rounded-xl bg-[#1f1f1f] text-gray-200
                       focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Employee ID */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            Employee ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            placeholder="Enter employee ID"
            className="w-full px-4 py-2.5 border border-gray-600 rounded-xl bg-[#1f1f1f] text-gray-200
                       focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
          />
          {errors.employeeId && (
            <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>
          )}
        </div>

        {/* Access Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            Access Level <span className="text-red-500">*</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-600 rounded-xl bg-[#1f1f1f] text-gray-200
                       focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
          >
            <option value="" disabled>
              Select access level
            </option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">{errors.role}</p>
          )}
        </div>

        {/* Team (only if accessLevel = User) */}
        {formData.role === "User" && (
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Team <span className="text-red-500">*</span>
            </label>
            <select
              name="team"
              value={formData.team}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-xl bg-[#1f1f1f] text-gray-200
                               focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
            >
              <option value="" disabled>
                Select team
              </option>
              <option value="Programmer">Programmer</option>
              <option value="GIS">GIS</option>
            </select>
            {errors.team && (
              <p className="text-red-500 text-xs mt-1">{errors.team}</p>
            )}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold shadow-md
                       hover:bg-red-600 hover:shadow-lg transition-all duration-300"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
