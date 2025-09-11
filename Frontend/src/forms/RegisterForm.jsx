import { useState } from "react";
import { register } from "../api/authApi";
import Swal from "sweetalert2";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register({ username, password, role });

      Swal.fire({
        title: "✅ Success!",
        text: `User ${data.username} registered successfully!`,
        icon: "success",
        confirmButtonColor: "#ef4444", // red accent
      });

      setUsername("");
      setPassword("");
      setRole("");
    } catch (err) {
      Swal.fire({
        title: "❌ Error",
        text: err.response?.data?.message || "Registration failed",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#1f1f1f] rounded-2xl shadow-xl p-8 space-y-6 border border-gray-700"
      >
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-white">
          Add New Resource
        </h2>
        <p className="text-center text-gray-400 text-sm">
          Fill in the details to register
        </p>
        {/* Username */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full px-4 py-2.5 border border-gray-600 rounded-xl bg-[#1f1f1f] text-gray-200
                       focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-2.5 border border-gray-600 rounded-xl bg-[#1f1f1f] text-gray-200
                       focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
            required
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-600 rounded-xl bg-[#1f1f1f] text-gray-200
                       focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
            required
          >
            <option value="" disabled>
              Select role
            </option>
            <option value="Programmer">Programmer</option>
            <option value="GIS">GIS</option>
          </select>
        </div>

        {/* Submit Button */}
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
