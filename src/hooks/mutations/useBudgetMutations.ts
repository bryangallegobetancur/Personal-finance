import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { emitRefetch } from "@/lib/utils";
import type { BudgetInput } from "@/schemas/budget.schema";

export function useCreateBudget() {
  const [isLoading, setIsLoading] = useState(false);

  const mutateAsync = async (input: BudgetInput) => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay sesión activa");
      const { data, error } = await supabase
        .from("budgets")
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      emitRefetch("budgets:changed");
      toast.success("Tope creado");
      return data;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo crear");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutateAsync, isLoading };
}

export function useUpdateBudget() {
  const [isLoading, setIsLoading] = useState(false);

  const mutateAsync = async ({ id, ...input }: BudgetInput & { id: string }) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("budgets")
        .update(input)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      emitRefetch("budgets:changed");
      toast.success("Tope actualizado");
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

export function useDeleteBudget() {
  const [isLoading, setIsLoading] = useState(false);

  const mutateAsync = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("budgets").delete().eq("id", id);
      if (error) throw error;
      emitRefetch("budgets:changed");
      toast.success("Tope eliminado");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo eliminar");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutateAsync, isLoading };
}
