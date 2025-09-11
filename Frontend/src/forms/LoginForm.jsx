import { useState, useContext } from "react";
import { login } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ username, password });
      loginUser({ ...data.user, token: data.token });

      if (data.user.role === "admin") {
        navigate("/admin", { state: { username: data.user.username } });
      } else {
        navigate("/user", { state: { username: data.user.username } });
      }
    } catch (err) {
      Swal.fire({
        title: "❌ Error",
        text: err.response?.data?.message || "Login failed",
        icon: "error",
        confirmButtonColor: "#b91c1c",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-700"
        >
          <img
            src="/logo.jpg"
            alt="App Logo"
            className="w-20 h-full mx-auto mb-4"
          />

          {/* Heading */}
          <h2 className="text-3xl font-extrabold text-center text-white">
            Welcome
          </h2>
          <p className="text-center text-gray-400 text-sm">
            Please login to continue
          </p>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-red-600 focus:outline-none transition"
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
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-600 rounded-xl bg-gray-700 text-white focus:ring-2 focus:ring-red-600 focus:outline-none transition"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold shadow-lg hover:bg-red-700 hover:shadow-xl transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
