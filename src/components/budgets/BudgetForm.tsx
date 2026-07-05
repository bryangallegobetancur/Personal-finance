import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema } from "@/schemas/budget.schema";
import type { BudgetInput } from "@/schemas/budget.schema";
import { useCategories } from "@/hooks/queries/useCategories";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface Props {
  initial?: (BudgetInput & { id?: string }) | null;
  onSubmit: (values: BudgetInput) => void;
  onCancel: () => void;
  submitting: boolean;
}

export function BudgetForm({ initial, onSubmit, onCancel, submitting }: Props) {
  const { data: categories } = useCategories("gasto");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetInput>({
    resolver: zodResolver(budgetSchema),
    defaultValues: initial ?? {
      amount: undefined,
      periodicity: "mensual",
      category_id: null,
      start_date: null,
      end_date: null,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Tope (monto)"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        error={errors.amount?.message}
        hasError={!!errors.amount}
        {...register("amount")}
      />
      <Select label="Periodicidad" {...register("periodicity")}>
        <option value="mensual">Mensual</option>
        <option value="anual">Anual</option>
      </Select>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Fecha inicio"
          type="date"
          hint="Opcional"
          error={errors.start_date?.message}
          hasError={!!errors.start_date}
          {...register("start_date")}
        />
        <Input
          label="Fecha fin"
          type="date"
          hint="Opcional"
          error={errors.end_date?.message}
          hasError={!!errors.end_date}
          {...register("end_date")}
        />
      </div>
      <Select
        label="Categoría"
        hint="Deja en 'Global' para un tope sobre todos tus gastos del período"
        {...register("category_id")}
      >
        <option value="">Global (todas las categorías)</option>
        {(categories ?? []).map((c) => (
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
          {initial?.id ? "Guardar" : "Crear tope"}
        </Button>
      </div>
    </form>
  );
}
