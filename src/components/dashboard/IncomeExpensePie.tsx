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

const COLORS = { ingresos: "#16A34A", gastos: "#DC2626" };

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
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              itemStyle={{ color: "var(--color-text)" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "var(--color-text-secondary)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-surface p-3">
        <span className="text-small text-muted-foreground">Saldo:</span>
        <span className={`text-base font-semibold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
          {formatCurrency(balance)}
        </span>
      </div>
    </Card>
  );
}
