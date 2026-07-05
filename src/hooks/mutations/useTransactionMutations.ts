import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { emitRefetch } from "@/lib/utils";
import type { TransactionInput } from "@/schemas/transaction.schema";

type Base = Omit<TransactionInput, "category_id"> & {
  category_id: string | null;
};

export function useCreateTransaction() {
  const [isLoading, setIsLoading] = useState(false);

  const mutateAsync = async (input: Base) => {
    setIsLoading(true);
    try {
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
  const [isLoading, setIsLoading] = useState(false);

  const mutateAsync = async ({ id, ...input }: Base & { id: string }) => {
    setIsLoading(true);
    try {
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
  const [isLoading, setIsLoading] = useState(false);

  const mutateAsync = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
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
