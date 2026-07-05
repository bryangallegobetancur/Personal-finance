import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { onRefetch } from "@/lib/utils";
import type { Budget } from "@/types/database.types";

export function useBudgets() {
  const [data, setData] = useState<(Budget & {
    category: { id: string; name: string } | null;
  })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: result, error: err } = await supabase
        .from("budgets")
        .select("*, category:categories(id, name)")
        .order("created_at", { ascending: false });
      if (err) throw err;
      setData(
        (result ?? []) as (Budget & {
          category: { id: string; name: string } | null;
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
  }, [fetch]);

  useEffect(() => {
    const unsub = onRefetch("budgets:changed", fetch);
    return unsub;
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
