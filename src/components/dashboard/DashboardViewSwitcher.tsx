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
      className="flex max-w-full items-center gap-1 rounded-button border border-border bg-surface-2 p-1"
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
              "flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-button px-2.5 text-[12px] font-medium transition-colors sm:px-3 sm:text-small",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <opt.icon className="hidden h-4 w-4 shrink-0 sm:block" strokeWidth={1.75} />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
