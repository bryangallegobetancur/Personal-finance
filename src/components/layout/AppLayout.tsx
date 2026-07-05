import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, ArrowLeftRight, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transacciones", icon: ArrowLeftRight },
  { to: "/settings", label: "Configuración", icon: Settings },
];

export function AppLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="hidden border-r border-border bg-surface lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-2.5 px-6">
          <div className="grid h-9 w-9 place-items-center rounded-button bg-primary text-sm font-bold text-primary-foreground">
            F
          </div>
          <span className="font-semibold text-foreground">Finanzas</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-button px-3 py-2.5 text-small font-medium transition-colors duration-200 ease-out",
                  isActive
                    ? "bg-brand-50 text-primary dark:bg-brand-600/15"
                    : "text-muted-foreground hover:bg-background hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" strokeWidth={1.75} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="truncate text-caption text-muted-foreground">
              {user?.email}
            </span>
            <ThemeToggle className="h-8 w-8" />
          </div>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-button px-3 py-2.5 text-small font-medium text-muted-foreground transition-colors duration-200 ease-out hover:bg-background hover:text-foreground"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.75} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="min-h-screen">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-2 border-b border-border bg-surface/80 px-4 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-button bg-primary text-xs font-bold text-primary-foreground">
              F
            </div>
            <span className="font-semibold text-foreground">Finanzas</span>
          </div>
          <ThemeToggle />
        </header>
        <div className="mx-auto max-w-6xl p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
