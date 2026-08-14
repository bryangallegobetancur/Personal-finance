import { CalendarDays, CalendarRange, Tags } from "lucide-react";
import { cn, type DashboardView } from "@/lib/utils";

interface Props {
  view: DashboardView;
  onChange: (view: DashboardView) => void;
}

const OPTIONS: { value: DashboardView; label: string; icon: typeof CalendarDays }[] = [
  { value: "month", label: "Mes", icon: CalendarDays },
  { value: "category", label: "Categoría", icon: Tags },
  { value: "range", label: "Rango de fechas", icon: CalendarRange },
];

export function DashboardViewSwitcher({ view, onChange }: Props) {
  return (
    <div
      className="flex items-center gap-1 rounded-button bg-surface p-1"
      role="tablist"
      aria-label="Tipo de vista"
    >
      {OPTIONS.map((opt) => {
        const active = view === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex h-9 items-center gap-2 rounded-button px-3 text-small font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <opt.icon className="h-4 w-4" strokeWidth={2} />
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
