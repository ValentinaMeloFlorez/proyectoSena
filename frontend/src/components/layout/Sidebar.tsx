import { NavLink } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  Bot,
  FileText,
  LayoutDashboard,
  Package,
  Shield,
  Users,
} from "lucide-react";
import { APP_NAME, NAV_ITEMS } from "@/utils/constants";
import { authStore } from "@/stores/authStore";

const iconMap = {
  LayoutDashboard,
  Users,
  Shield,
  BookOpen,
  FileText,
  Package,
  BarChart3,
  Bot,
};

export function Sidebar() {
  const user = authStore.getUser();

  const visibleItems = NAV_ITEMS.filter((item) => {
    if ("disabled" in item && item.disabled) return false;
    if ("permission" in item && item.permission) {
      return authStore.hasPermission(item.permission);
    }
    return true;
  });

  return (
    <aside className="flex h-full w-64 flex-col border-r border-surface-border bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-surface-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
          C
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{APP_NAME}</p>
          <p className="text-xs text-slate-500">Gestión Empresarial</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {visibleItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-brand-50 font-medium text-brand-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-surface-border p-4">
        {user && (
          <p className="truncate text-xs font-medium text-slate-700">{user.fullName}</p>
        )}
        <p className="text-xs text-slate-400">v1.0.0 — Usuarios</p>
      </div>
    </aside>
  );
}
