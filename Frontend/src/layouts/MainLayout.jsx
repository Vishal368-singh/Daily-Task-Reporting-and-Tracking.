import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar.jsx";
import Footer from "../common/Footer.jsx";
import Sidebar from "../common/Sidebar.jsx";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#1f1f1f] text-gray-200">
      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar + Main Content */}
      <div className="flex flex-1">
        {/* Sidebar (sticky with white border) */}
        <div className="sticky top-[64px] h-[calc(100vh-128px)] w-64 bg-[#111111]  shadow-xl">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-[#121212] overflow-y-auto">
          <div className="max-w-7xl mx-auto ">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sticky Footer (white border) */}
      <Footer />
    </div>
  );
}
