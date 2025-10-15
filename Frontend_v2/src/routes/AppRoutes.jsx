import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

// Layouts
const MainLayout = lazy(() => import("../layouts/MainLayout.jsx"));
const AuthLayout = lazy(() => import("../layouts/AuthLayout.jsx"));

// Pages / Forms / Reports
const Login = lazy(() => import("../pages/Login.jsx"));
const AddResource = lazy(() => import("../pages/ResourceManagement.jsx"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard.jsx"));
const UserDashboard = lazy(() => import("../pages/UserDashboard.jsx"));
const DailyTaskForm = lazy(() => import("../forms/DailyTaskForm.jsx"));
const DailyReport = lazy(() => import("../report/DailyReport.jsx"));
const Project = lazy(() => import("../projects/Project.jsx"));
const Project_Analysis = lazy(() =>
  import("../analysisReport/Project_Analysis.jsx")
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public / Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
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
