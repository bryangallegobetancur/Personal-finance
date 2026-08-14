import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

interface Props {
  income: number;
  expense: number;
  balance: number;
  periodLabel: string;
  periodNoun?: string;
}

export function BalanceCard({ income, expense, balance, periodLabel, periodNoun = "del mes" }: Props) {
  const suffix = periodLabel ? ` - ${periodLabel}` : "";
  const items = [
    {
      label: `Ingresos ${periodNoun}${suffix}`,
      value: income,
      icon: TrendingUp,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: `Gastos ${periodNoun}`,
      value: expense,
      icon: TrendingDown,
      color: "text-error",
      bg: "bg-error/10",
    },
    {
      label: "Balance",
      value: balance,
      icon: Wallet,
      color: balance >= 0 ? "text-primary" : "text-error",
      bg: "bg-brand-50 dark:bg-brand-600/15",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {items.map((it) => (
        <Card key={it.label}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-small text-muted-foreground">{it.label}</p>
              <p className={`mt-2 text-h2 font-bold ${it.color}`}>
                {formatCurrency(it.value)}
              </p>
            </div>
            <div className={`grid h-12 w-12 place-items-center rounded-button ${it.bg}`}>
              <it.icon className={`h-6 w-6 ${it.color}`} strokeWidth={1.75} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
