import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDashboardSummary } from "@/hooks/queries/useDashboard";
import { useAlerts } from "@/hooks/queries/useAlerts";
import {
  currentMonthIso,
  formatMonthLabel,
  formatDate,
  changeMonth,
  isFutureMonth,
  todayLocal,
  firstDayOfMonthIso,
  type DashboardView,
} from "@/lib/utils";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { IncomeExpensePie } from "@/components/dashboard/IncomeExpensePie";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { DashboardViewSwitcher } from "@/components/dashboard/DashboardViewSwitcher";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { RecentAlerts } from "@/components/dashboard/RecentAlerts";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

export function DashboardPage() {
  const [view, setView] = useState<DashboardView>("month");
  const [selectedMonth, setSelectedMonth] = useState(() => currentMonthIso());
  const [fromDate, setFromDate] = useState(() => firstDayOfMonthIso(currentMonthIso()));
  const [toDate, setToDate] = useState(() => todayLocal());

  const { data, isLoading, error } = useDashboardSummary(
    view,
    selectedMonth,
    fromDate,
    toDate
  );
  useAlerts();

  const monthLabel = formatMonthLabel(selectedMonth);
  const canGoForward = !isFutureMonth(changeMonth(selectedMonth, 1));

  const isRange = view === "range";
  const rangeValid = fromDate && toDate && fromDate <= toDate;
  const periodLabel = isRange
    ? `${formatDate(fromDate)} – ${formatDate(toDate)}`
    : monthLabel;
  const periodNoun = isRange ? "del período" : "del mes";
  const subtitle = isRange
    ? "Resumen del rango de fechas seleccionado"
    : view === "category"
      ? "Resumen del mes en curso por categoría"
      : "Resumen del mes en curso";

  const goToPrevMonth = () => setSelectedMonth((m) => changeMonth(m, -1));
  const goToNextMonth = () => {
    const next = changeMonth(selectedMonth, 1);
    if (!isFutureMonth(next)) setSelectedMonth(next);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-heading">Dashboard</h1>
          <p className="mt-2 text-small text-muted-foreground">{subtitle}</p>
        </div>
        <DashboardViewSwitcher view={view} onChange={setView} />
      </div>

      {!isRange && (
        <div className="flex w-fit items-center gap-2 rounded-button border border-border bg-surface p-1.5">
          <button
            type="button"
            onClick={goToPrevMonth}
            className="grid h-9 w-9 place-items-center rounded-button text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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
            className="grid h-9 w-9 place-items-center rounded-button text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {isRange && (
        <DateRangePicker
          from={fromDate}
          to={toDate}
          onFromChange={setFromDate}
          onToChange={setToDate}
        />
      )}

      {isRange && !rangeValid && (
        <Card>
          <p className="text-small text-error">
            Rango de fechas no válido: la fecha "desde" debe ser anterior o igual
            a "hasta".
          </p>
        </Card>
      )}

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

      {data && rangeValid && (
        <>
          <BalanceCard
            income={data.total_income}
            expense={data.total_expense}
            balance={data.balance}
            periodLabel={periodLabel}
            periodNoun={periodNoun}
          />
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            {view === "category" ? (
              <>
                <CategoryBreakdown data={data.by_category} periodLabel={periodLabel} />
                <div className="xl:col-span-2">
                  <IncomeExpenseChart
                    data={data.by_category}
                    monthLabel={periodLabel}
                    isDateLabel={false}
                  />
                </div>
              </>
            ) : (
              <>
                <IncomeExpensePie
                  income={data.total_income}
                  expense={data.total_expense}
                  balance={data.balance}
                  monthLabel={periodLabel}
                />
                <div className="xl:col-span-2">
                  <IncomeExpenseChart
                    data={data.income_vs_expense}
                    monthLabel={periodLabel}
                  />
                </div>
              </>
            )}
          </div>
          <RecentAlerts />
        </>
      )}
    </div>
  );
}
