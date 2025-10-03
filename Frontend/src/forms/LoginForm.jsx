import { useState, useContext } from "react";
import { login } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaSpinner } from "react-icons/fa";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await login({ username, password });

      // FIX: Call loginUser with two separate arguments
      loginUser(data.user, data.token);

      // Navigate based on role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      Swal.fire({
        title: "❌ Error",
        text: err.response?.data?.message || "Login failed",
        icon: "error",
        confirmButtonColor: "#b91c1c",
      });
    } finally {
      setIsLoading(false);
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

          {/* Username Input */}
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
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
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
              disabled={isLoading}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-red-600 text-white font-semibold shadow-lg hover:bg-red-700 transition-all duration-300 disabled:bg-red-900 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
