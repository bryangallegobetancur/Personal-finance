import { z } from "zod";

export const budgetSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Introduce un monto" })
    .positive("El tope debe ser mayor a 0"),
  periodicity: z.enum(["mensual", "anual"]),
  category_id: z.string().uuid().nullable(),
  start_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido")
    .nullable(),
  end_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido")
    .nullable(),
});

export type BudgetInput = z.infer<typeof budgetSchema>;
