import { Navigate, Outlet } from "react-router-dom";
import { authStore } from "@/stores/authStore";

interface ProtectedRouteProps {
  permission?: string;
}

export function ProtectedRoute({ permission }: ProtectedRouteProps) {
  if (!authStore.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !authStore.hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
