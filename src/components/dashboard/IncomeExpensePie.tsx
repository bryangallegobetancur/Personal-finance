import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

interface Props {
  income: number;
  expense: number;
  balance: number;
  monthLabel: string;
}

const COLORS = { ingresos: "var(--success)", gastos: "var(--error)" };

export function IncomeExpensePie({ income, expense, balance, monthLabel }: Props) {
  const data = [
    { name: "Ingresos", value: income, color: COLORS.ingresos },
    { name: "Gastos", value: expense, color: COLORS.gastos },
  ];

  return (
    <Card title={`Distribución${monthLabel ? ` - ${monthLabel}` : ""}`}>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                borderRadius: 12,
                fontSize: 12,
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
              itemStyle={{ color: "var(--foreground)" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "var(--muted-foreground)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-surface p-3">
        <span className="text-small text-muted-foreground">Saldo:</span>
        <span className={`text-base font-semibold ${balance >= 0 ? "text-success" : "text-error"}`}>
          {formatCurrency(balance)}
        </span>
      </div>
    </Card>
  );
}
