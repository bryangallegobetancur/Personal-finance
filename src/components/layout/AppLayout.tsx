import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Settings,
  LogOut,
  LogIn,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useExploreContext } from "@/contexts/ExploreContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { ExploreBanner } from "@/components/layout/ExploreBanner";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transacciones", icon: ArrowLeftRight },
  { to: "/settings", label: "Configuración", icon: Settings },
];

const exploreNavItems = [
  { to: "/explore/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/explore/transactions", label: "Transacciones", icon: ArrowLeftRight },
  { to: "/explore/settings", label: "Configuración", icon: Settings },
];

export function AppLayout() {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const explore = useExploreContext();
  const isExplore = explore !== null;

  const items = isExplore ? exploreNavItems : navItems;

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  const logoGlow = theme === "dark" || theme === "aurora"
    ? "drop-shadow-[0_0_4px_rgba(0,0,0,1.0)]"
    : "";

  const content = (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="hidden border-r border-border bg-surface lg:flex lg:flex-col">
        <div className="flex items-center justify-center gap-2.5 px-6 py-3">
          <img src="/Logo.png" alt="Logo" className={cn("h-[150px] w-[150px] rounded-button object-contain", logoGlow)} />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map((item) => (
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
              {isExplore ? "Modo exploración" : user?.email}
            </span>
            <ThemeToggle className="h-8 w-8" />
          </div>
          {isExplore ? (
            <Link
              to="/login"
              className="flex w-full items-center gap-2 rounded-button px-3 py-2.5 text-small font-medium text-muted-foreground transition-colors duration-200 ease-out hover:bg-background hover:text-foreground"
            >
              <LogIn className="h-5 w-5" strokeWidth={1.75} />
              Iniciar sesión
            </Link>
          ) : (
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-button px-3 py-2.5 text-small font-medium text-muted-foreground transition-colors duration-200 ease-out hover:bg-background hover:text-foreground"
            >
              <LogOut className="h-5 w-5" strokeWidth={1.75} />
              Cerrar sesión
            </button>
          )}
        </div>
      </aside>

      <main className="min-h-screen">
        {isExplore && <ExploreBanner />}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-border bg-surface/80 px-4 py-2 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2.5">
            <img src="/Logo.png" alt="Logo" className={cn("h-[80px] w-[80px] rounded-button object-contain", logoGlow)} />
          </div>
          <div className="flex items-center gap-2">
            {isExplore && (
              <Link
                to="/login"
                className="flex items-center gap-1 rounded-button px-2 py-1 text-small text-muted-foreground hover:text-foreground"
              >
                <LogIn className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Entrar</span>
              </Link>
            )}
            <ThemeToggle />
          </div>
        </header>
        <div className="mx-auto max-w-6xl p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );

  if (theme === "aurora") {
    return <AuroraBackground>{content}</AuroraBackground>;
  }

  return content;
}
