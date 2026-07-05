import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { TransactionForm } from "./TransactionForm";
import type { TransactionInput } from "@/schemas/transaction.schema";
import {
  useCreateTransaction,
  useUpdateTransaction,
} from "@/hooks/mutations/useTransactionMutations";
import type { Transaction } from "@/types/database.types";

interface Props {
  open: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
  clone?: boolean;
}

export function TransactionDialog({ open, onClose, transaction, clone }: Props) {
  const create = useCreateTransaction();
  const update = useUpdateTransaction();

  const [pending, setPending] = useState(false);
  const isEditing = transaction && !clone;

  const handleSubmit = async (values: TransactionInput) => {
    setPending(true);
    try {
      if (isEditing) {
        await update.mutateAsync({ id: transaction!.id, ...values });
      } else {
        await create.mutateAsync(values);
      }
      onClose();
    } finally {
      setPending(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? "Editar transacción" : "Nueva transacción"}>
      <TransactionForm
        initial={transaction ?? null}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitting={pending}
      />
    </Modal>
  );
}
