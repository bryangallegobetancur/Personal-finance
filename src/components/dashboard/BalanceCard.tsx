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
  const items = [
    {
      label: "Balance",
      value: balance,
      icon: Wallet,
      color: balance >= 0 ? "text-[var(--balance-fg)]" : "text-rose-200",
      bg: "bg-white/10",
      featured: true,
    },
    {
      label: `Ingresos ${periodNoun}`,
      value: income,
      icon: TrendingUp,
      color: "text-success",
      bg: "bg-success/10",
      featured: false,
    },
    {
      label: `Gastos ${periodNoun}`,
      value: expense,
      icon: TrendingDown,
      color: "text-error",
      bg: "bg-error/10",
      featured: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((it) => (
        <Card key={it.label} className={it.featured ? "balance-card" : undefined}>
          <div className="flex items-center justify-between gap-3">
            <p className={`text-small font-medium ${it.featured ? "balance-caption" : "text-muted-foreground"}`}>
              {it.label}
            </p>
            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ${it.bg}`}>
              <it.icon className={`h-5 w-5 ${it.color}`} strokeWidth={1.75} />
            </div>
          </div>
          <p className={`mt-5 break-words text-[clamp(1.4rem,2.2vw,2rem)] font-semibold leading-tight tracking-tight tabular-nums ${it.color}`}>
            {formatCurrency(it.value)}
          </p>
          <p className={`mt-2 text-caption ${it.featured ? "balance-caption" : "text-muted-foreground"}`}>
            {periodLabel}
          </p>
        </Card>
      ))}
    </div>
  );
}
