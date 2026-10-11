import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCategories } from "@/hooks/queries/useCategories";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/mutations/useCategoryMutations";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Modal } from "@/components/ui/Modal";
import { CategoryForm } from "./CategoryForm";
import type { CategoryInput } from "@/schemas/category.schema";
import type { Category } from "@/types/database.types";

export function CategoriesManager() {
  const { data, isLoading } = useCategories();
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const del = useDeleteCategory();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [pending, setPending] = useState(false);

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (c: Category) => {
    setEditing(c);
    setOpen(true);
  };

  const handleSubmit = async (values: CategoryInput) => {
    setPending(true);
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, ...values });
      } else {
        await create.mutateAsync(values);
      }
      setOpen(false);
    } finally {
      setPending(false);
    }
  };

  return (
    <Card
      title="Categorías"
      action={
        <Button size="sm" onClick={openNew}>
          <Plus className="h-4 w-4" strokeWidth={1.75} /> Nueva
        </Button>
      }
    >
      {isLoading && (
        <div className="grid place-items-center py-8">
          <Spinner />
        </div>
      )}
      {data && data.length === 0 && (
        <p className="py-8 text-center text-small text-muted-foreground">
          Sin categorías todavía.
        </p>
      )}

      {data && data.length > 0 && (
        <ul className="divide-y divide-border">
          {data.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-7 items-center rounded-full px-3 text-caption font-medium ${
                    c.type === "ingreso"
                      ? "bg-success/10 text-success"
                      : "bg-error/10 text-error"
                  }`}
                >
                  {c.type}
                </span>
                <span className="text-small font-medium text-foreground">{c.name}</span>
              </div>
              <div className="inline-flex gap-1">
                <button
                  onClick={() => openEdit(c)}
                  className="rounded-button p-2 text-muted-foreground transition-colors hover:bg-background hover:text-primary"
                  aria-label="Editar"
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <button
                  onClick={() => del.mutateAsync(c.id).catch(() => {})}
                  className="rounded-button p-2 text-muted-foreground transition-colors hover:bg-background hover:text-error"
                  aria-label="Eliminar"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Editar categoría" : "Nueva categoría"}
      >
        <CategoryForm
          initial={editing ? { id: editing.id, name: editing.name, type: editing.type } : null}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          submitting={pending}
        />
      </Modal>
    </Card>
  );
}
