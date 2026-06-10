import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Search, User } from "lucide-react";
import { logout } from "@/services/authService";
import { authStore } from "@/stores/authStore";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const navigate = useNavigate();
  const user = authStore.getUser();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-surface-border bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Buscar">
          <Search size={18} />
        </button>
        <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Notificaciones">
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-surface-border px-3 py-1.5 text-sm text-slate-700">
          <User size={16} />
          <span className="hidden sm:inline">{user?.fullName || "Usuario"}</span>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
          aria-label="Cerrar sesión"
          title="Cerrar sesión"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
