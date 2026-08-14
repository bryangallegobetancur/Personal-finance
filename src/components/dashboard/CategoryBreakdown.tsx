import { Tags } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

interface Datum {
  label: string;
  ingresos: number;
  gastos: number;
}

interface Props {
  data: Datum[];
  periodLabel: string;
}

export function CategoryBreakdown({ data, periodLabel }: Props) {
  const sorted = [...data].sort(
    (a, b) => b.gastos + b.ingresos - (a.gastos + a.ingresos)
  );
  const top = sorted.slice(0, 8);
  const maxExpense = Math.max(1, ...data.map((d) => d.gastos));

  return (
    <Card
      title={`Por categoría${periodLabel ? ` - ${periodLabel}` : ""}`}
      action={<Tags className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />}
    >
      {data.length === 0 ? (
        <p className="py-8 text-center text-small text-muted-foreground">
          Sin movimientos en el período.
        </p>
      ) : (
        <ul className="space-y-4">
          {top.map((d) => (
            <li key={d.label}>
              <div className="flex items-center justify-between gap-3 text-small">
                <span className="truncate font-medium text-foreground">
                  {d.label}
                </span>
                <span className="shrink-0 font-semibold text-foreground">
                  {formatCurrency(d.gastos)}
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted-foreground/10">
                <div
                  className="h-full rounded-full bg-error transition-[width] duration-300"
                  style={{
                    width: `${Math.min(100, (d.gastos / maxExpense) * 100)}%`,
                  }}
                />
              </div>
              {d.ingresos > 0 && (
                <p className="mt-1 text-caption text-muted-foreground">
                  Ingresos:{" "}
                  <span className="font-medium text-success">
                    {formatCurrency(d.ingresos)}
                  </span>
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
