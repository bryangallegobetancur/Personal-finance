import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Evita que un usuario ya logueado vea las pantallas de auth.
export function PublicRoute() {
  const { session } = useAuth();
  if (session) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
