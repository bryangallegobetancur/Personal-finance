import { TransactionsList } from "@/components/transactions/TransactionsList";

export function TransactionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h1 font-bold text-foreground">Transacciones</h1>
        <p className="mt-1 text-small text-muted-foreground">
          Crea, edita y elimina tus movimientos.
        </p>
      </div>
      <TransactionsList />
    </div>
  );
}
