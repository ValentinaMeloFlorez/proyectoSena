import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-6xl font-bold text-brand-600">404</h1>
      <p className="text-lg text-slate-600">Página no encontrada</p>
      <Link to="/">
        <Button>Volver al Dashboard</Button>
      </Link>
    </div>
  );
}
