import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaCubes,
  FaChartBar,
  FaUsers,
  FaTasks,
  FaChevronLeft,
} from "react-icons/fa";

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`fixed left-0 top-[64px] bottom-[45px] 
              bg-gradient-to-b from-[#1f1f1f] to-[#2a2a2a] 
              text-gray-200 flex flex-col 
              border-r border-gray-700 rounded-r-2xl shadow-xl
              transition-all duration-300
              ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 focus:outline-none hover:bg-gray-800 transition-colors"
      >
        <FaChevronLeft
          className={`transition-transform ${
            collapsed ? "rotate-180" : ""
          } text-gray-400`}
        />
      </button>

      <nav className="flex-1 mt-4">
        {/* Dashboard */}
        <Link
          to={user?.role === "admin" ? "/admin" : "/user"}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200
            ${
              isActive(user?.role === "admin" ? "/admin" : "/user")
                ? "bg-gray-700 text-white"
                : "hover:bg-gray-800 hover:text-white"
            }`}
        >
          <FaTachometerAlt className="mr-2" />
          {!collapsed && <span>Dashboard</span>}
        </Link>

        {/* Admin Menus */}
        {user?.role === "admin" && (
          <>
            <Link
              to="/admin/project"
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200
                ${
                  isActive("/admin/project")
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-800 hover:text-white"
                }`}
            >
              <FaProjectDiagram className="mr-2" />
              {!collapsed && <span>Projects</span>}
            </Link>

            <div
              className="flex items-center px-4 py-2 rounded-lg text-gray-500 cursor-not-allowed hover:bg-gray-800 transition-colors"
              title="Disabled"
            >
              <FaCubes className="mr-2" />
              {!collapsed && <span>Modules</span>}
            </div>

            <Link
              to="/admin/dailyReport"
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200
                ${
                  isActive("/admin/dailyReport")
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-800 hover:text-white"
                }`}
            >
              <FaChartBar className="mr-2" />
              {!collapsed && <span>Reports</span>}
            </Link>

            <Link
              to="/admin/resource"
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200
                ${
                  isActive("/admin/resource")
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-800 hover:text-white"
                }`}
            >
              <FaUsers className="mr-2" />
              {!collapsed && <span>Resources</span>}
            </Link>
          </>
        )}

        {/* User Menus */}
        {user?.role !== "admin" && (
          <Link
            to="/user/dailyTasks"
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200
              ${
                isActive("/user/dailyTasks")
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-800 hover:text-white"
              }`}
          >
            <FaTasks className="mr-2" />
            {!collapsed && <span>Add Daily Task</span>}
          </Link>
        )}
      </nav>
    </div>
  );
}
