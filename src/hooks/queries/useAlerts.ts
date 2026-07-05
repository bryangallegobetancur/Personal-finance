import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { formatCurrency, onRefetch, emitRefetch } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import type { Alert } from "@/types/database.types";

export function useAlerts() {
  const { user } = useAuth();
  const [data, setData] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: result, error: err } = await supabase
        .from("alerts_history")
        .select("*, budget:budgets(id, amount, periodicity, category_id)")
        .order("created_at", { ascending: false })
        .limit(50);
      if (err) throw err;
      setData((result ?? []) as Alert[]);
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
    const unsub = onRefetch("alerts:changed", fetch);
    return unsub;
  }, [fetch]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`alerts_history_changes:${crypto.randomUUID()}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "alerts_history",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const alert = payload.new as Alert;
          emitRefetch("alerts:changed");
          emitRefetch("dashboard:changed");
          toast.error("¡Tope superado!", {
            description: `Has excedido un presupuesto en ${formatCurrency(
              alert.amount_exceeded
            )}.`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { data, isLoading, error, refetch: fetch };
}
