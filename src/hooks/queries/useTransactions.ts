import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { onRefetch } from "@/lib/utils";
import type { Transaction } from "@/types/database.types";

export interface TransactionFilters {
  from?: string;
  to?: string;
  type?: "ingreso" | "gasto";
  category_id?: string;
  limit?: number;
}

export function useTransactions(filters: TransactionFilters = {}) {
  const [data, setData] = useState<(Transaction & {
    category: { id: string; name: string; type: string } | null;
  })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const fetch = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetch();
  }, [
    filters.from,
    filters.to,
    filters.type,
    filters.category_id,
    filters.limit,
    fetch,
  ]);

  useEffect(() => {
    const unsub = onRefetch("transactions:changed", fetch);
    return unsub;
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
