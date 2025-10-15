// src/components/Navbar.jsx

import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Import the new custom modal
import PasswordChangeModal from "./PasswordChangeModal";

// Icons
import { FaSignOutAlt, FaUserCircle, FaBars } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";

// Dropdown reusable component (no changes needed)
const DropdownItem = ({ icon, text, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:bg-red-800/50 hover:text-white transition-all duration-200 ${className}`}
  >
    {icon}
    <span>{text}</span>
  </button>
);

export default function Navbar({ onMenuClick }) {
  const { user, logoutUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-[#18181B]/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <FaBars className="text-xl" />
            </button>

            {/* Logo and Title */}
            <div className="flex items-center gap-x-3">
              <img
                src="/DTRT/MLLogoSmall.png"
                alt="Logo"
                className="w-9 h-9 md:w-10 md:h-10 rounded-md"
              />
              <span className="text-lg md:text-xl font-bold text-white tracking-wide">
                <span className="md:hidden">DTRT</span>
                <span className="hidden md:block">
                  Daily Task Reporting and Tracking
                </span>
              </span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center focus:outline-none group"
              >
                <FaUserCircle className="text-3xl text-gray-400 group-hover:text-red-600 transition-colors duration-300" />
                <span
                  className={`ml-1 text-gray-400 transform transition-transform duration-300 ${
                    open ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▼
                </span>
              </button>

              {open && (
                <div className="absolute right-0 top-full mt-3 w-72 bg-gray-800 rounded-xl shadow-2xl shadow-black/40 border border-gray-700 overflow-hidden z-50 animate-scale-in">
                  {/* User Info */}
                  <div className="flex items-center gap-x-4 p-4 border-b border-gray-700/50 bg-black/20">
                    <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center font-bold text-white text-xl">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-lg truncate">
                        {user?.username}
                      </p>
                      <p className="text-gray-400 text-sm truncate">
                        Role: {user?.role}
                      </p>
                    </div>
                  </div>

                  {/* Dropdown Actions */}
                  <div className="py-2">
                    <DropdownItem
                      icon={<RiLockPasswordLine className="text-lg" />}
                      text="Change Password"
                      onClick={() => {
                        setShowPasswordDialog(true);
                        setOpen(false);
                      }}
                    />
                    <DropdownItem
                      icon={<FaSignOutAlt className="text-lg" />}
                      text="Logout"
                      onClick={handleLogout}
                      className="!text-red-500 hover:!bg-red-800/50 hover:!text-white"
                    />
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2 bg-black/20 border-t border-gray-700/50 text-center">
                    <p className="text-gray-500 text-xs">
                      Today:{" "}
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Render the custom modal */}
      <PasswordChangeModal
        visible={showPasswordDialog}
        employeeId = {user?.employeeId}
        onClose={() => setShowPasswordDialog(false)}
      />
    </>
  );
}
