import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { emitRefetch } from "@/lib/utils";
import {
  useExploreContext,
  exploreCreateTransaction,
  exploreUpdateTransaction,
  exploreDeleteTransaction,
} from "@/contexts/ExploreContext";
import type { TransactionInput } from "@/schemas/transaction.schema";

type Base = Omit<TransactionInput, "category_id"> & {
  category_id: string | null;
};

export function useCreateTransaction() {
  const explore = useExploreContext();
  const [isLoading, setIsLoading] = useState(false);

  const mutateAsync = async (input: Base) => {
    setIsLoading(true);
    try {
      if (explore) {
        const result = exploreCreateTransaction(explore, {
          amount: input.amount,
          date: input.date,
          description: input.description || "",
          category_id: input.category_id ?? null,
          type: input.type,
        });
        toast.success("Transacción guardada (modo exploración)");
        return result;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay sesión activa");

      const { data, error } = await supabase
        .from("transactions")
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      emitRefetch("transactions:changed");
      emitRefetch("dashboard:changed");
      toast.success("Transacción guardada");
      return data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo guardar";
      toast.error(msg);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutateAsync, isLoading };
}

export function useUpdateTransaction() {
  const explore = useExploreContext();
  const [isLoading, setIsLoading] = useState(false);

  const mutateAsync = async ({ id, ...input }: Base & { id: string }) => {
    setIsLoading(true);
    try {
      if (explore) {
        const result = exploreUpdateTransaction(explore, id, input);
        toast.success("Transacción actualizada (modo exploración)");
        return result;
      }

      const { data, error } = await supabase
        .from("transactions")
        .update(input)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      emitRefetch("transactions:changed");
      emitRefetch("dashboard:changed");
      toast.success("Transacción actualizada");
      return data;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo actualizar");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutateAsync, isLoading };
}

export function useDeleteTransaction() {
  const explore = useExploreContext();
  const [isLoading, setIsLoading] = useState(false);

  const mutateAsync = async (id: string) => {
    setIsLoading(true);
    try {
      if (explore) {
        exploreDeleteTransaction(explore, id);
        toast.success("Transacción eliminada (modo exploración)");
        return;
      }

      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);
      if (error) throw error;
      emitRefetch("transactions:changed");
      emitRefetch("dashboard:changed");
      toast.success("Transacción eliminada");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo eliminar");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutateAsync, isLoading };
}
