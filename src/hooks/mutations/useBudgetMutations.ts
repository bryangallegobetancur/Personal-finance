import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { emitRefetch } from "@/lib/utils";
import {
  useExploreContext,
  exploreCreateBudget,
  exploreUpdateBudget,
  exploreDeleteBudget,
} from "@/contexts/ExploreContext";
import type { BudgetInput } from "@/schemas/budget.schema";

export function useCreateBudget() {
  const explore = useExploreContext();
  const [isLoading, setIsLoading] = useState(false);

  const mutateAsync = async (input: BudgetInput) => {
    setIsLoading(true);
    try {
      if (explore) {
        const result = exploreCreateBudget(explore, input);
        toast.success("Tope creado (modo exploración)");
        return result;
      }

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
  const explore = useExploreContext();
  const [isLoading, setIsLoading] = useState(false);

  const mutateAsync = async ({
    id,
    ...input
  }: BudgetInput & { id: string }) => {
    setIsLoading(true);
    try {
      if (explore) {
        const result = exploreUpdateBudget(explore, id, input);
        toast.success("Tope actualizado (modo exploración)");
        return result;
      }

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
  const explore = useExploreContext();
  const [isLoading, setIsLoading] = useState(false);

  const mutateAsync = async (id: string) => {
    setIsLoading(true);
    try {
      if (explore) {
        exploreDeleteBudget(explore, id);
        toast.success("Tope eliminado (modo exploración)");
        return;
      }

      const { error } = await supabase
        .from("budgets")
        .delete()
        .eq("id", id);
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
