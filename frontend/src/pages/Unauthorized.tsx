import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-4xl font-bold text-red-600">Acceso denegado</h1>
      <p className="max-w-md text-center text-base text-slate-600">
        No tienes permisos suficientes para ver este módulo. Comunícate con el administrador o utiliza un usuario con los permisos correctos.
      </p>
      <Link to="/">
        <Button>Volver al Dashboard</Button>
      </Link>
    </div>
  );
}
