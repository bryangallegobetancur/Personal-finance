import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const LABELS: Record<string, { label: string; next: string }> = {
  light: { label: "Activar modo oscuro", next: "Modo oscuro" },
  dark: { label: "Activar modo aurora", next: "Modo aurora" },
  aurora: { label: "Activar modo claro", next: "Modo claro" },
};

export function ThemeToggle({ className }: Props) {
  const { theme, toggleTheme } = useTheme();
  const info = LABELS[theme] ?? LABELS.light;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={info.label}
      title={info.next}
      className={cn(
        "inline-grid h-10 w-10 place-items-center rounded-button border border-border bg-surface text-muted-foreground transition-all hover:text-foreground hover:shadow-sm",
        className
      )}
    >
      {theme === "light" && <Moon className="h-5 w-5" />}
      {theme === "dark" && <Sparkles className="h-5 w-5" />}
      {theme === "aurora" && <Sun className="h-5 w-5" />}
    </button>
  );
}
