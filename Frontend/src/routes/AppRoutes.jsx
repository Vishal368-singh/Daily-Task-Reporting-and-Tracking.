import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login.jsx";
import AddResource from "../forms/AddResource.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import UserDashboard from "../pages/UserDashboard.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import DailyTaskForm from "../forms/DailyTaskForm.jsx";
import DailyReport from "../report/DailyReport.jsx";
import Project from "../projects/Project.jsx";
import Project_Analysis from "../analysisReport/Project_Analysis.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public / Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
      </Route>

      {/* Protected / Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/project" element={<Project />} />
        <Route path="/admin/dailyReport" element={<DailyReport />} />
        <Route path="/user/dailyTasks" element={<DailyTaskForm />} />
        <Route path="/admin/resource" element={<AddResource />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/admin/report" element={<Project_Analysis />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Route>
    </Routes>
  );
}
