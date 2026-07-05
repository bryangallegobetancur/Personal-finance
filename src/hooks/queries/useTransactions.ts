import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { onRefetch } from "@/lib/utils";
import { useExploreContext } from "@/contexts/ExploreContext";
import type { Transaction } from "@/types/database.types";

export interface TransactionFilters {
  from?: string;
  to?: string;
  type?: "ingreso" | "gasto";
  category_id?: string;
  limit?: number;
}

export function useTransactions(filters: TransactionFilters = {}) {
  const explore = useExploreContext();

  const [data, setData] = useState<
    (Transaction & {
      category: { id: string; name: string; type: string } | null;
    })[]
  >([]);
  const [isLoading, setIsLoading] = useState(!explore);
  const [error, setError] = useState<Error | null>(null);

  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetch = useCallback(async () => {
    if (explore) {
      setIsLoading(true);
      setError(null);
      try {
        const f = filtersRef.current;
        let filtered = [...explore.transactions];

        if (f.from) filtered = filtered.filter((t) => t.date >= f.from!);
        if (f.to) filtered = filtered.filter((t) => t.date <= f.to!);
        if (f.type) filtered = filtered.filter((t) => t.type === f.type);
        if (f.category_id)
          filtered = filtered.filter((t) => t.category_id === f.category_id);

        filtered.sort((a, b) => {
          if (a.date !== b.date)
            return a.date < b.date ? 1 : -1;
          return a.created_at < b.created_at ? 1 : -1;
        });

        if (f.limit && f.limit > 0) filtered = filtered.slice(0, f.limit);

        const enriched = filtered.map((t) => {
          const cat = t.category_id
            ? explore.categories.find((c) => c.id === t.category_id)
            : null;
          return {
            ...t,
            category: cat
              ? { id: cat.id, name: cat.name, type: cat.type }
              : null,
          };
        });

        setData(enriched);
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setIsLoading(false);
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    const f = filtersRef.current;
    try {
      let query = supabase
        .from("transactions")
        .select("*, category:categories(id, name, type)")
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      if (f.from) query = query.gte("date", f.from);
      if (f.to) query = query.lte("date", f.to);
      if (f.type) query = query.eq("type", f.type);
      if (f.category_id) query = query.eq("category_id", f.category_id);
      if (f.limit) query = query.limit(f.limit);

      const { data: result, error: err } = await query;
      if (err) throw err;
      setData(
        (result ?? []) as (Transaction & {
          category: { id: string; name: string; type: string } | null;
        })[]
      );
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsLoading(false);
    }
  }, [explore]);

  useEffect(() => {
    if (explore) {
      fetch();
      const unsub = onRefetch("transactions:changed", fetch);
      return unsub;
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: existing pattern
  }, [
    filters.from,
    filters.to,
    filters.type,
    filters.category_id,
    filters.limit,
    fetch,
    explore,
  ]);

  useEffect(() => {
    if (explore) return;
    const unsub = onRefetch("transactions:changed", fetch);
    return unsub;
  }, [fetch, explore]);

  return { data, isLoading, error, refetch: fetch };
}
