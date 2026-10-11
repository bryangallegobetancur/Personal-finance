import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { onRefetch, dateRangeFromMonth, type DashboardView } from "@/lib/utils";
import { useExploreContext } from "@/contexts/ExploreContext";
import type { DashboardSummary } from "@/types/database.types";
import type { Transaction } from "@/types/database.types";

type SummaryRow = Pick<
  Transaction,
  "amount" | "type" | "date" | "category_id"
>;

interface CategoryMap {
  [id: string]: string;
}

function computeSummary(
  rows: SummaryRow[],
  categoryMap: CategoryMap
): DashboardSummary {
  let total_income = 0;
  let total_expense = 0;
  const byDay = new Map<string, { ingresos: number; gastos: number }>();
  const byCategory = new Map<string, { ingresos: number; gastos: number }>();

  for (const r of rows) {
    const amount = Number(r.amount);
    const dayEntry = byDay.get(r.date) ?? { ingresos: 0, gastos: 0 };
    const catName = r.category_id
      ? categoryMap[r.category_id] ?? "Sin categoría"
      : "Sin categoría";
    const catEntry = byCategory.get(catName) ?? { ingresos: 0, gastos: 0 };

    if (r.type === "ingreso") {
      total_income += amount;
      dayEntry.ingresos += amount;
      catEntry.ingresos += amount;
    } else {
      total_expense += amount;
      dayEntry.gastos += amount;
      catEntry.gastos += amount;
    }

    byDay.set(r.date, dayEntry);
    byCategory.set(catName, catEntry);
  }

  const income_vs_expense = Array.from(byDay.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([label, v]) => ({ label, ...v }));

  const by_category = Array.from(byCategory.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([label, v]) => ({ label, ...v }));

  return {
    total_income,
    total_expense,
    balance: total_income - total_expense,
    income_vs_expense,
    by_category,
  };
}

export function useDashboardSummary(
  view: DashboardView,
  monthIso: string,
  fromDate: string,
  toDate: string
) {
  const explore = useExploreContext();

  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(!explore);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    const isRange = view === "range";
    const bounds = isRange
      ? { from: fromDate, to: toDate }
      : dateRangeFromMonth(monthIso);

    const filterRows = (rows: SummaryRow[]) =>
      rows.filter((t) =>
        isRange
          ? t.date >= bounds.from && t.date <= bounds.to
          : t.date >= bounds.from && t.date < bounds.to
      );

    if (explore) {
      setIsLoading(true);
      setError(null);
      try {
        const categoryMap: CategoryMap = {};
        for (const c of explore.categories) categoryMap[c.id] = c.name;
        setData(computeSummary(filterRows(explore.transactions), categoryMap));
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("transactions")
        .select("amount, type, date, category_id")
        .order("date", { ascending: true });
      query =
        isRange
          ? query.gte("date", bounds.from).lte("date", bounds.to)
          : query.gte("date", bounds.from).lt("date", bounds.to);

      const { data: result, error: err } = await query;
      if (err) throw err;

      const categoryMap: CategoryMap = {};
      if (view === "category") {
        const { data: cats, error: catsErr } = await supabase
          .from("categories")
          .select("id, name");
        if (catsErr) throw catsErr;
        for (const c of cats ?? []) categoryMap[c.id] = c.name;
      }

      setData(computeSummary((result ?? []) as SummaryRow[], categoryMap));
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsLoading(false);
    }
  }, [view, monthIso, fromDate, toDate, explore]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (explore) return;
    const unsub = onRefetch("dashboard:changed", fetch);
    return unsub;
  }, [fetch, explore]);

  return { data, isLoading, error, refetch: fetch };
}
