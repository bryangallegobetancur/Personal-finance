import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { onRefetch } from "@/lib/utils";
import { useExploreContext } from "@/contexts/ExploreContext";
import type { DashboardSummary } from "@/types/database.types";
import type { Transaction } from "@/types/database.types";

export function useDashboardSummary(monthIso: string) {
  const explore = useExploreContext();

  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(!explore);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (explore) {
      setIsLoading(true);
      setError(null);
      try {
        const [yearStr, monthStr] = monthIso.split("-");
        const year = Number(yearStr);
        const month = Number(monthStr);
        const from = `${year}-${String(month).padStart(2, "0")}-01`;
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;
        const to = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

        const rows = explore.transactions.filter(
          (t) => t.date >= from && t.date < to
        );

        let total_income = 0;
        let total_expense = 0;
        const byDay = new Map<string, { ingresos: number; gastos: number }>();

        for (const r of rows) {
          const dayKey = r.date;
          const entry = byDay.get(dayKey) ?? { ingresos: 0, gastos: 0 };
          if (r.type === "ingreso") {
            total_income += r.amount;
            entry.ingresos += r.amount;
          } else {
            total_expense += r.amount;
            entry.gastos += r.amount;
          }
          byDay.set(dayKey, entry);
        }

        const income_vs_expense = Array.from(byDay.entries())
          .sort(([a], [b]) => (a < b ? -1 : 1))
          .map(([label, v]) => ({ label, ...v }));

        setData({
          total_income,
          total_expense,
          balance: total_income - total_expense,
          income_vs_expense,
        });
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
      const [yearStr, monthStr] = monthIso.split("-");
      const year = Number(yearStr);
      const month = Number(monthStr);
      const from = `${year}-${String(month).padStart(2, "0")}-01`;
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      const to = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

      const { data: result, error: err } = await supabase
        .from("transactions")
        .select("amount, type, date")
        .gte("date", from)
        .lt("date", to)
        .order("date", { ascending: true });

      if (err) throw err;

      const rows = (result ?? []) as Pick<
        Transaction,
        "amount" | "type" | "date"
      >[];

      let total_income = 0;
      let total_expense = 0;
      const byDay = new Map<string, { ingresos: number; gastos: number }>();

      for (const r of rows) {
        const dayKey = r.date;
        const entry = byDay.get(dayKey) ?? { ingresos: 0, gastos: 0 };
        if (r.type === "ingreso") {
          total_income += Number(r.amount);
          entry.ingresos += Number(r.amount);
        } else {
          total_expense += Number(r.amount);
          entry.gastos += Number(r.amount);
        }
        byDay.set(dayKey, entry);
      }

      const income_vs_expense = Array.from(byDay.entries())
        .sort(([a], [b]) => (a < b ? -1 : 1))
        .map(([label, v]) => ({ label, ...v }));

      setData({
        total_income,
        total_expense,
        balance: total_income - total_expense,
        income_vs_expense,
      });
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsLoading(false);
    }
  }, [monthIso, explore]);

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
