import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { onRefetch } from "@/lib/utils";
import type { CategoryType } from "@/types/database.types";

type CategoryRow = {
  id: string;
  user_id: string;
  name: string;
  type: CategoryType;
  created_at: string;
};

export function useCategories(type?: CategoryType) {
  const [data, setData] = useState<CategoryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let query = supabase.from("categories").select("*").order("name");
      if (type) query = query.eq("type", type);
      const { data: result, error: err } = await query;
      if (err) throw err;
      setData((result ?? []) as CategoryRow[]);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    const unsub = onRefetch("categories:changed", fetch);
    return unsub;
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
