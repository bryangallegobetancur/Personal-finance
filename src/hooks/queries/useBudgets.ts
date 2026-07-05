import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { onRefetch } from "@/lib/utils";
import { useExploreContext } from "@/contexts/ExploreContext";
import type { Budget } from "@/types/database.types";

export function useBudgets() {
  const explore = useExploreContext();

  const [data, setData] = useState<
    (Budget & {
      category: { id: string; name: string } | null;
    })[]
  >([]);
  const [isLoading, setIsLoading] = useState(!explore);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (explore) {
      setIsLoading(true);
      setError(null);
      try {
        const enriched = explore.budgets
          .map((b) => {
            const cat = b.category_id
              ? explore.categories.find((c) => c.id === b.category_id)
              : null;
            return {
              ...b,
              category: cat ? { id: cat.id, name: cat.name } : null,
            };
          })
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
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
  }, [explore]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (explore) return;
    const unsub = onRefetch("budgets:changed", fetch);
    return unsub;
  }, [fetch, explore]);

  return { data, isLoading, error, refetch: fetch };
}
