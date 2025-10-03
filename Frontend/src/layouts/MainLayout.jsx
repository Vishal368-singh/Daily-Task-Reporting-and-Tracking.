import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar.jsx";
import Footer from "../common/Footer.jsx";
import Sidebar from "../common/Sidebar.jsx";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#1f1f1f] text-gray-200">
      {/* Top Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar + Main Content */}
      <div className="flex flex-1">
        {/* Sidebar (sticky with white border) */}
        <div
          className={`sticky top-[64px] h-[calc(100vh-128px)] bg-[#111111] shadow-xl transition-all duration-300 ${
            collapsed ? "w-16" : "w-64"
          } hidden md:block`}
        >
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Mobile Sidebar Drawer */}
        <div
          className={`fixed top-[64px] left-0 h-[calc(100vh-128px)] bg-[#111111] shadow-xl z-50 transition-transform duration-300 md:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${collapsed ? "w-16" : "w-64"}`}
        >
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 bg-[#121212] overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sticky Footer (white border) */}
      <Footer />
    </div>
  );
}
