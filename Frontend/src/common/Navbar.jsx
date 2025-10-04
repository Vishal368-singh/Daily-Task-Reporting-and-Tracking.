import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaSignOutAlt, FaUserCircle, FaBars } from "react-icons/fa";

export default function Navbar({ onMenuClick }) {
  const { user, logoutUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <nav className="bg-[#1f1f1f]/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 md:h-16 items-center">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FaBars className="text-xl" />
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="w-8 h-7 md:w-12 md:h-10 mr-2 md:mr-3 rounded-[5px]"
            />
            <span className="text-lg md:text-2xl font-bold text-white">ML TaskSheet</span>
          </div>

          {/* User Dropdown */}
          <div className="relative flex items-center space-x-2">
            {/* Profile Icon + Username */}
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center focus:outline-none space-x-2"
            >
              <FaUserCircle className="text-3xl text-gray-300 hover:text-[#b91c1c] transition-colors duration-300" />
              <span className="text-white font-semibold hover:text-[#b91c1c] transition-colors duration-300">
                {user?.username}
              </span>
            </button>

            {/* Dropdown Menu */}
            {open && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#1f1f1f] rounded-xl shadow-lg border border-gray-700 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-white font-semibold">{user?.username}</p>
                  <p className="text-gray-400 text-sm">Role: {user?.role}</p>
                  <p className="text-gray-500 text-xs">
                    Today: {new Date().toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-[#b91c1c] hover:bg-gray-700 transition-all duration-300"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
