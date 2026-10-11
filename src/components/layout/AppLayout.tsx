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
import { ThemeSelector } from "@/components/ui/ThemeSelector";
import { ThemeBackground } from "@/components/ui/ThemeBackground";
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
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const explore = useExploreContext();
  const isExplore = explore !== null;

  const items = isExplore ? exploreNavItems : navItems;

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  const logoSrc = isDark ? "/Logo_white.png" : "/Logo.png";

  return (
    <ThemeBackground>
      <div className="min-h-screen lg:grid lg:grid-cols-[14.5rem_minmax(0,1fr)]">
        <aside className="app-sidebar sticky top-0 hidden h-screen flex-col border-r border-border backdrop-blur-2xl lg:flex">
          <div className="flex flex-col items-center justify-center px-6 pb-8 pt-7">
            <img
              src={logoSrc}
              alt="Personal Finance"
              className="h-24 w-24 object-contain"
            />
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Finanzas personales</p>
          </div>

          <nav aria-label="Navegación principal" className="flex-1 space-y-2 px-4 py-4">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-button border px-4 py-3 text-small font-medium transition-colors duration-200 ease-out",
                    isActive
                      ? "border-primary/15 bg-primary/10 text-primary"
                      : "border-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
                  )
                }
              >
                <item.icon className="h-5 w-5" strokeWidth={1.75} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-border p-4">
            <p className="mb-3 truncate text-caption text-muted-foreground">
              {isExplore ? "Modo exploración" : user?.email}
            </p>
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

        <main className="min-h-screen min-w-0">
          {isExplore && <ExploreBanner />}
          <header className="sticky top-0 z-20 border-b border-border bg-overlay/90 backdrop-blur-xl">
            <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
              <div className="flex items-center gap-2.5 lg:hidden">
                <img
                  src={logoSrc}
                  alt="Personal Finance"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div className="hidden min-w-0 truncate text-small text-muted-foreground lg:block">
                {isExplore ? "Modo exploración" : user?.email}
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
                <ThemeSelector />
              </div>
            </div>
            <nav aria-label="Navegación móvil" className="grid grid-cols-3 gap-1 border-t border-border px-3 py-2 lg:hidden">
              {items.map((item) => (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => cn(
                  "flex min-w-0 flex-col items-center gap-1.5 rounded-button px-1 py-2 text-[11px] font-medium sm:flex-row sm:justify-center sm:gap-2 sm:text-small",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
                )}>
                  <item.icon className="h-4 w-4" strokeWidth={1.75} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </header>
          <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-10 lg:py-10">
            <Outlet />
          </div>
        </main>
      </div>
    </ThemeBackground>
  );
}
