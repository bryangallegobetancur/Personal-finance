import { Outlet, Link } from "react-router-dom";
import { TrendingUp, Wallet, PiggyBank, BarChart3, Eye } from "lucide-react";
import { ThemeSelector } from "@/components/ui/ThemeSelector";
import { ThemeBackground } from "@/components/ui/ThemeBackground";

const decorations = [
  {
    Icon: TrendingUp,
    className: "left-[8%] top-[18%] h-24 w-24 -rotate-12",
  },
  {
    Icon: Wallet,
    className: "right-[10%] top-[28%] h-20 w-20 rotate-6",
  },
  {
    Icon: PiggyBank,
    className: "left-[14%] bottom-[16%] h-28 w-28 rotate-3",
  },
  {
    Icon: BarChart3,
    className: "right-[12%] bottom-[20%] h-24 w-24 -rotate-6",
  },
];

export function AuthLayout() {
  return (
    <ThemeBackground>
      <div className="relative grid min-h-screen place-items-center overflow-hidden p-4">
        <div className="pointer-events-none absolute inset-0 select-none">
          {decorations.map(({ Icon, className }, i) => (
            <Icon
              key={i}
              className={`absolute text-primary opacity-[0.06] dark:opacity-[0.04] ${className}`}
              strokeWidth={1.75}
            />
          ))}
        </div>

        <div className="absolute right-4 top-4 z-10">
          <ThemeSelector />
        </div>

        <div className="relative z-[1] w-full max-w-[420px]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-button bg-primary text-2xl font-bold text-primary-foreground shadow-md">
              F
            </div>
            <h1 className="text-h2 font-bold text-foreground">
              Finanzas Personales
            </h1>
            <p className="mt-1 text-small text-muted-foreground">
              Tu panorama financiero, claro.
            </p>
          </div>
          <div className="rounded-card border border-border bg-surface p-10 shadow-md backdrop-blur-2xl">
            <Outlet />
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/explore/dashboard"
              className="inline-flex items-center gap-1.5 rounded-button px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <Eye className="h-4 w-4" />
              Explorar la aplicación
            </Link>
          </div>
        </div>
      </div>
    </ThemeBackground>
  );
}
