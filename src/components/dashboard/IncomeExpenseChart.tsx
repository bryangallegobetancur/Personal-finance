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

interface Props {
  data: Datum[];
  monthLabel: string;
  isDateLabel?: boolean;
}

export function IncomeExpenseChart({ data, monthLabel, isDateLabel = true }: Props) {
  return (
    <Card className="h-full" title={`Ingresos vs Gastos${monthLabel ? ` (${monthLabel})` : ""}`}>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="4 6"
              vertical={false}
              stroke="var(--border)"
            />
            <XAxis
              dataKey="label"
              tickFormatter={(v: string) => (isDateLabel ? v.slice(5) : v)}
              interval={isDateLabel ? undefined : 0}
              angle={isDateLabel ? undefined : -18}
              textAnchor={isDateLabel ? "end" : undefined}
              height={isDateLabel ? 30 : 60}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              fontSize={11}
              stroke="var(--muted-foreground)"
            />
            <YAxis
              tickFormatter={(v: number) => formatCurrency(v)}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              fontSize={11}
              stroke="var(--muted-foreground)"
              width={82}
            />
            <Tooltip
              cursor={{ fill: "var(--accent)" }}
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(l: string) => (isDateLabel ? `Fecha: ${l}` : l)}
              contentStyle={{
                borderRadius: 12,
                fontSize: 12,
                backgroundColor: "var(--overlay)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
              labelStyle={{ color: "var(--foreground)" }}
              itemStyle={{ color: "var(--foreground)" }}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "var(--muted-foreground)" }}
            />
            <Bar maxBarSize={32} dataKey="ingresos" name="Ingresos" fill="var(--success)" radius={[6, 6, 0, 0]} />
            <Bar maxBarSize={32} dataKey="gastos" name="Gastos" fill="var(--error)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
