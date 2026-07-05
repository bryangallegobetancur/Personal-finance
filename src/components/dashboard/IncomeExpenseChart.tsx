import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

interface Datum {
  label: string;
  ingresos: number;
  gastos: number;
}

export function IncomeExpenseChart({ data, monthLabel }: { data: Datum[]; monthLabel: string }) {
  return (
    <Card title={`Ingresos vs Gastos${monthLabel ? ` (${monthLabel})` : ""}`}>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-border)"
            />
            <XAxis
              dataKey="label"
              tickFormatter={(v: string) => v.slice(5)}
              fontSize={12}
              stroke="var(--color-text-secondary)"
            />
            <YAxis
              tickFormatter={(v: number) => formatCurrency(v)}
              fontSize={12}
              stroke="var(--color-text-secondary)"
              width={70}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(l: string) => `Fecha: ${l}`}
              contentStyle={{
                borderRadius: 12,
                fontSize: 12,
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              labelStyle={{ color: "var(--color-text)" }}
              itemStyle={{ color: "var(--color-text)" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "var(--color-text-secondary)" }}
            />
            <Bar dataKey="ingresos" name="Ingresos" fill="#16A34A" radius={[6, 6, 0, 0]} />
            <Bar dataKey="gastos" name="Gastos" fill="#DC2626" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
