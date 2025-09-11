import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <main className="min-h-screen  items-center justify-center bg-gray-50">
      <Outlet />
    </main>
  );
}
