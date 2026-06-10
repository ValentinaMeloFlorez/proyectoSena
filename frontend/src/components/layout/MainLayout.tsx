import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";

export function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
