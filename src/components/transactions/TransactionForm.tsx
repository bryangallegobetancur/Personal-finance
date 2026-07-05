import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "@/schemas/transaction.schema";
import type { TransactionInput } from "@/schemas/transaction.schema";
import { useCategories } from "@/hooks/queries/useCategories";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { todayLocal } from "@/lib/utils";
import type { Transaction } from "@/types/database.types";

interface Props {
  initial?: Transaction | null;
  onSubmit: (values: TransactionInput) => void;
  onCancel: () => void;
  submitting: boolean;
}

export function TransactionForm({ initial, onSubmit, onCancel, submitting }: Props) {
  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initial
      ? {
          amount: initial.amount,
          date: initial.date,
          description: initial.description,
          category_id: initial.category_id,
          type: initial.type,
        }
      : {
          amount: undefined,
          date: todayLocal(),
          description: "",
          category_id: null,
          type: "gasto",
        },
  });

  const type = watch("type");

  useEffect(() => {
    const currentCatId = watch("category_id");
    const matching = categories?.filter((c) => c.type === type) ?? [];
    if (currentCatId && !matching.some((c) => c.id === currentCatId)) {
      setValue("category_id", null);
    }
  }, [type, categories, setValue, watch]);

  const filtered = (categories ?? []).filter((c) => c.type === type);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Select label="Tipo" {...register("type")}>
          <option value="gasto">Gasto</option>
          <option value="ingreso">Ingreso</option>
        </Select>
        <Input
          label="Monto"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          error={errors.amount?.message}
          hasError={!!errors.amount}
          {...register("amount")}
        />
      </div>

      <Input
        label="Fecha"
        type="date"
        max={todayLocal()}
        error={errors.date?.message}
        hasError={!!errors.date}
        {...register("date")}
      />

      <Input
        label="Descripción"
        placeholder="Ej. Compra supermercado"
        error={errors.description?.message}
        hasError={!!errors.description}
        {...register("description")}
      />

      <Select
        label="Categoría"
        hint="Opcional — las transacciones pueden no tener categoría"
        {...register("category_id")}
      >
        <option value="">Sin categoría</option>
        {filtered.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={submitting}>
          {initial ? "Guardar cambios" : "Crear transacción"}
        </Button>
      </div>
    </form>
  );
}
