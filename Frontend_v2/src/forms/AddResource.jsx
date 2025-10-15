/* eslint-disable no-unused-vars */
import { useState } from "react";
import { register } from "../api/authApi";
import Swal from "sweetalert2";
import {
  FaUser,
  FaLock,
  FaIdBadge,
  FaEnvelope,
  FaPhone,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

// Reusable Input Field Component
const InputField = ({
  label,
  name,
  value,
  onChange,
  error,
  icon: Icon,
  type = "text",
  placeholder,
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-300 mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-600 rounded-xl bg-[#1f1f1f] text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const AddResource = ({ initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    username: initialData?.username || "",
    password: "",
    employeeId: initialData?.employeeId || "",
    role: initialData?.role || "",
    team: initialData?.team || "",
    email: initialData?.email || "",
    mobileNo: initialData?.mobileNo || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (!formData.password.trim() && !initialData)
      newErrors.password = "Password is required.";
    if (!formData.employeeId.trim())
      newErrors.employeeId = "Employee ID is required.";
    else if (!/^[A-Za-z0-9]+$/.test(formData.employeeId))
      newErrors.employeeId = "Only letters & numbers allowed.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)
    )
      newErrors.email = "Invalid email format.";
    if (!formData.mobileNo.trim())
      newErrors.mobileNo = "Mobile No is required.";
    else if (!/^\d{10}$/.test(formData.mobileNo))
      newErrors.mobileNo = "Mobile No must be 10 digits.";
    if (!formData.role) newErrors.role = "Please select an access level.";
    if (formData.role === "User" && !formData.team)
      newErrors.team = "Please select a team for the user.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    if (name === "role" && value === "Admin") updatedFormData.team = "";
    setFormData(updatedFormData);
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const dataToSend = { ...formData };
    if (dataToSend.role === "Admin") delete dataToSend.team;

    try {
      const { data } = await register(dataToSend);
      Swal.fire({
        title: "✅ Success!",
        text: `User ${data.username} registered successfully!`,
        icon: "success",
        confirmButtonColor: "#ef4444",
      });
      setFormData({
        username: "",
        password: "",
        employeeId: "",
        role: "",
        team: "",
        email: "",
        mobileNo: "",
      });
      setErrors({});
      if (onCancel) onCancel();
    } catch (err) {
      Swal.fire({
        title: "❌ Error",
        text: err.response?.data?.message || "Registration failed",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 space-y-6 relative max-h-[90vh] overflow-y-auto border border-gray-600/50">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>
        <h2 className="text-3xl font-extrabold text-center text-white">
          {initialData ? "Edit Resource" : "Add New Resource"}
        </h2>
        <p className="text-center text-gray-400 text-sm">
          Fill in the details to register
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            error={errors.username}
            icon={FaUser}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Password {initialData ? "(Leave blank to keep)" : ""}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-600 rounded-xl bg-[#1f1f1f] text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <InputField
            label="Employee ID"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            placeholder="Enter employee ID"
            error={errors.employeeId}
            icon={FaIdBadge}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            error={errors.email}
            icon={FaEnvelope}
          />
          <InputField
            label="Mobile No"
            name="mobileNo"
            type="tel"
            value={formData.mobileNo}
            onChange={handleChange}
            placeholder="Enter 10-digit mobile no"
            error={errors.mobileNo}
            icon={FaPhone}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Access Level <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-xl bg-[#1f1f1f] text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
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

          {formData.role === "User" && (
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Team <span className="text-red-500">*</span>
              </label>
              <select
                name="team"
                value={formData.team}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-600 rounded-xl bg-[#1f1f1f] text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
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

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 rounded-xl bg-gray-600 text-white hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition"
            >
              {loading ? "Registering..." : initialData ? "Update" : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResource;
