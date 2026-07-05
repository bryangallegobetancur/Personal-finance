import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useBudgets } from "@/hooks/queries/useBudgets";
import {
  useCreateBudget,
  useUpdateBudget,
  useDeleteBudget,
} from "@/hooks/mutations/useBudgetMutations";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Modal } from "@/components/ui/Modal";
import { BudgetForm } from "./BudgetForm";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { BudgetInput } from "@/schemas/budget.schema";
import type { Budget } from "@/types/database.types";

export function BudgetsManager() {
  const { data, isLoading } = useBudgets();
  const create = useCreateBudget();
  const update = useUpdateBudget();
  const del = useDeleteBudget();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [pending, setPending] = useState(false);

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (b: Budget) => {
    setEditing(b);
    setOpen(true);
  };

  const handleSubmit = async (values: BudgetInput) => {
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
      title="Topes (presupuestos)"
      action={
        <Button size="sm" onClick={openNew}>
          <Plus className="h-4 w-4" strokeWidth={1.75} /> Nuevo
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
          Sin topes configurados.
        </p>
      )}

      {data && data.length > 0 && (
        <ul className="divide-y divide-border">
          {data.map((b) => (
            <li key={b.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-7 items-center rounded-full px-3 text-caption font-medium ${
                    b.periodicity === "mensual"
                      ? "bg-brand-50 text-primary dark:bg-brand-600/15"
                      : "bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300"
                  }`}
                >
                  {b.periodicity}
                </span>
                <div>
                  <span className="text-small font-medium text-foreground">
                    {b.category ? b.category.name : "Global"}
                  </span>
                  {(b.start_date || b.end_date) && (
                    <span className="block text-caption text-muted-foreground">
                      {b.start_date ? formatDate(b.start_date) : "···"} —{" "}
                      {b.end_date ? formatDate(b.end_date) : "···"}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-small font-semibold text-foreground">
                  {formatCurrency(b.amount)}
                </span>
                <div className="inline-flex gap-1">
                  <button
                    onClick={() => openEdit(b)}
                    className="rounded-button p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-primary"
                    aria-label="Editar"
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                  <button
                      onClick={() => del.mutateAsync(b.id).catch(() => {})}
                    className="rounded-button p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-error"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Editar tope" : "Nuevo tope"}
      >
        <BudgetForm
          initial={
            editing
              ? {
                  id: editing.id,
                  amount: editing.amount,
                  periodicity: editing.periodicity,
                  category_id: editing.category_id,
                  start_date: editing.start_date,
                  end_date: editing.end_date,
                }
              : null
          }
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          submitting={pending}
        />
      </Modal>
    </Card>
  );
}
