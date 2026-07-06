import { useState } from "react";
import { Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { useTransactions } from "@/hooks/queries/useTransactions";
import { useDeleteTransaction } from "@/hooks/mutations/useTransactionMutations";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { TransactionDialog } from "./TransactionDialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Transaction } from "@/types/database.types";

export function TransactionsList() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [cloning, setCloning] = useState(false);

  const { data, isLoading, error } = useTransactions({ limit: 100 });
  const del = useDeleteTransaction();

  const openNew = () => {
    setEditing(null);
    setCloning(false);
    setDialogOpen(true);
  };
  const openEdit = (t: Transaction) => {
    setEditing(t);
    setCloning(false);
    setDialogOpen(true);
  };
  const openClone = (t: Transaction) => {
    setEditing(t);
    setCloning(true);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setCloning(false);
  };

  return (
    <>
      <Card
        title="Transacciones"
        action={
          <Button size="sm" onClick={openNew}>
            <Plus className="h-4 w-4" strokeWidth={1.75} /> Nueva
          </Button>
        }
      >
        {isLoading ? (
          <div className="grid place-items-center py-12">
            <Spinner />
          </div>
        ) : error ? (
          <p className="text-small text-error">Error al cargar</p>
        ) : data.length === 0 ? (
          <p className="py-12 text-center text-small text-muted-foreground">
            Aún no hay transacciones. Crea la primera.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-small">
              <thead>
                <tr className="border-b border-border text-left text-caption uppercase text-muted-foreground">
                  <th className="py-3 pr-3 font-medium">Fecha</th>
                  <th className="py-3 pr-3 font-medium">Descripción</th>
                  <th className="py-3 pr-3 font-medium">Categoría</th>
                  <th className="py-3 pr-3 text-right font-medium">Monto</th>
                  <th className="py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((t) => (
                  <tr key={t.id} className="transition-colors hover:bg-background">
                    <td className="py-3 pr-3 text-muted-foreground">{formatDate(t.date)}</td>
                    <td className="py-3 pr-3 font-medium text-foreground">
                      {t.description}
                    </td>
                    <td className="py-3 pr-3 text-muted-foreground">
                      {t.category?.name ?? "—"}
                    </td>
                    <td
                      className={`py-3 pr-3 text-right font-semibold ${
                        t.type === "ingreso" ? "text-success" : "text-error"
                      }`}
                    >
                      {t.type === "ingreso" ? "+" : "−"}
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => openClone(t)}
                          className="rounded-button p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-success"
                          aria-label="Clonar"
                        >
                          <Copy className="h-4 w-4" strokeWidth={1.75} />
                        </button>
                        <button
                          onClick={() => openEdit(t)}
                          className="rounded-button p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-primary"
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" strokeWidth={1.75} />
                        </button>
                        <button
                          onClick={() => del.mutateAsync(t.id).catch(() => {})}
                          className="rounded-button p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-error"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <TransactionDialog
        open={dialogOpen}
        onClose={closeDialog}
        transaction={editing}
        clone={cloning}
      />
    </>
  );
}
