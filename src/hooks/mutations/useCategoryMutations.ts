import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { emitRefetch } from "@/lib/utils";
import {
  useExploreContext,
  exploreCreateCategory,
  exploreUpdateCategory,
  exploreDeleteCategory,
} from "@/contexts/ExploreContext";
import type { CategoryInput } from "@/schemas/category.schema";

export function useCreateCategory() {
  const explore = useExploreContext();
  const [isLoading, setIsLoading] = useState(false);

  const mutateAsync = async (input: CategoryInput) => {
    setIsLoading(true);
    try {
      if (explore) {
        const result = exploreCreateCategory(explore, input);
        toast.success("Categoría creada (modo exploración)");
        return result;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No hay sesión activa");
      const { data, error } = await supabase
        .from("categories")
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      emitRefetch("categories:changed");
      toast.success("Categoría creada");
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

export function useUpdateCategory() {
  const explore = useExploreContext();
  const [isLoading, setIsLoading] = useState(false);

  const mutateAsync = async ({
    id,
    ...input
  }: CategoryInput & { id: string }) => {
    setIsLoading(true);
    try {
      if (explore) {
        const result = exploreUpdateCategory(explore, id, input);
        toast.success("Categoría actualizada (modo exploración)");
        return result;
      }

      const { data, error } = await supabase
        .from("categories")
        .update(input)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      emitRefetch("categories:changed");
      toast.success("Categoría actualizada");
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

export function useDeleteCategory() {
  const explore = useExploreContext();
  const [isLoading, setIsLoading] = useState(false);

  const mutateAsync = async (id: string) => {
    setIsLoading(true);
    try {
      if (explore) {
        exploreDeleteCategory(explore, id);
        toast.success("Categoría eliminada (modo exploración)");
        return;
      }

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);
      if (error) throw error;
      emitRefetch("categories:changed");
      toast.success("Categoría eliminada");
    } catch (e) {
      const msg =
        e instanceof Error && /23503|foreign_key/i.test(e.message)
          ? "No se puede eliminar: tiene transacciones asociadas. Reasigna o elimina primero esas transacciones."
          : e instanceof Error
            ? e.message
            : "No se pudo eliminar";
      toast.error(msg);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutateAsync, isLoading };
}
