import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { onRefetch } from "@/lib/utils";
import type { Profile } from "@/types/database.types";

export function useProfile() {
  const [data, setData] = useState<Profile | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: result, error: err } = await supabase
        .from("profiles")
        .select("*")
        .maybeSingle();
      if (err) throw err;
      setData(result as Profile | null);
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
    const unsub = onRefetch("profile:changed", fetch);
    return unsub;
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
