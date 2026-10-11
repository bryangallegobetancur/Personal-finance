import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Droplets, Leaf, Moon, Palette, Sparkles } from "lucide-react";
import { THEMES, useTheme, type Theme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const ICONS: Record<Theme, typeof Palette> = {
  v3: Droplets,
  v5: Leaf,
  v7: Sparkles,
  v10: Moon,
};

interface Props {
  className?: string;
}

export function ThemeSelector({ className }: Props) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const active = THEMES.find((t) => t.id === theme) ?? THEMES[1];
  const ActiveIcon = ICONS[active.id];

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Cambiar tema: ${active.name}`}
        className="inline-flex h-10 items-center gap-2 rounded-button border border-border bg-surface px-3 text-small font-medium text-foreground transition-all hover:shadow-sm"
      >
        <ActiveIcon className="h-4 w-4 text-primary" />
        <span className="hidden sm:inline">{active.name}</span>
        <ChevronDown
          className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Seleccionar tema"
          className="absolute right-0 z-50 mt-3 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-card border border-border bg-overlay p-2 shadow-lg"
        >
          <p className="px-3 pb-1 pt-2 text-caption font-medium uppercase tracking-wide text-muted-foreground">
            Tema
          </p>
          {THEMES.map((option) => {
            const Icon = ICONS[option.id];
            const selected = option.id === theme;
            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setTheme(option.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-button px-3 py-2.5 text-left transition-colors",
                  selected
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-background hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-button",
                    selected ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1">
                  <span className="block text-small font-medium">{option.name}</span>
                  <span className="block text-caption text-muted-foreground">
                    {option.description}
                  </span>
                </span>
                {selected && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
