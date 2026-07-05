import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/schemas/category.schema";
import type { CategoryInput } from "@/schemas/category.schema";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface Props {
  initial?: (CategoryInput & { id?: string }) | null;
  onSubmit: (values: CategoryInput) => void;
  onCancel: () => void;
  submitting: boolean;
}

export function CategoryForm({ initial, onSubmit, onCancel, submitting }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: initial ?? { name: "", type: "gasto" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Nombre"
        placeholder="Ej. Supermercado"
        error={errors.name?.message}
        hasError={!!errors.name}
        {...register("name")}
      />
      <Select label="Tipo" {...register("type")}>
        <option value="gasto">Gasto</option>
        <option value="ingreso">Ingreso</option>
      </Select>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={submitting}>
          {initial?.id ? "Guardar" : "Crear"}
        </Button>
      </div>
    </form>
  );
}
