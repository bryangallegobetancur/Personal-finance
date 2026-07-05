import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDashboardSummary } from "@/hooks/queries/useDashboard";
import { useAlerts } from "@/hooks/queries/useAlerts";
import { currentMonthIso, formatMonthLabel, changeMonth, isFutureMonth } from "@/lib/utils";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { IncomeExpensePie } from "@/components/dashboard/IncomeExpensePie";
import { RecentAlerts } from "@/components/dashboard/RecentAlerts";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

export function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(() => currentMonthIso());
  const { data, isLoading, error } = useDashboardSummary(selectedMonth);
  useAlerts();

  const monthLabel = formatMonthLabel(selectedMonth);
  const canGoForward = !isFutureMonth(changeMonth(selectedMonth, 1));

  const goToPrevMonth = () => setSelectedMonth((m) => changeMonth(m, -1));
  const goToNextMonth = () => {
    const next = changeMonth(selectedMonth, 1);
    if (!isFutureMonth(next)) setSelectedMonth(next);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-small text-muted-foreground">
            Resumen del mes en curso
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-button bg-surface p-1">
          <button
            type="button"
            onClick={goToPrevMonth}
            className="grid h-8 w-8 place-items-center rounded-button text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[120px] text-center text-small font-medium text-foreground">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={goToNextMonth}
            disabled={!canGoForward}
            className="grid h-8 w-8 place-items-center rounded-button text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading && (
        <Card>
          <div className="grid place-items-center py-12">
            <Spinner className="h-6 w-6" />
          </div>
        </Card>
      )}
      {error && (
        <Card>
          <p className="text-small text-error">Error al cargar el resumen</p>
        </Card>
      )}

      {data && (
        <>
          <BalanceCard
            income={data.total_income}
            expense={data.total_expense}
            balance={data.balance}
            monthLabel={monthLabel}
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <IncomeExpensePie
              income={data.total_income}
              expense={data.total_expense}
              balance={data.balance}
              monthLabel={monthLabel}
            />
            <div className="lg:col-span-2">
              <IncomeExpenseChart data={data.income_vs_expense} monthLabel={monthLabel} />
            </div>
          </div>
          <RecentAlerts />
        </>
      )}
    </div>
  );
}
