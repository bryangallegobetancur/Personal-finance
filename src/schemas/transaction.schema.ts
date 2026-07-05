import { z } from "zod";

function todayLocalStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const notFutureDate = z
  .string()
  .min(1, "La fecha es obligatoria")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida")
  .refine((v) => v <= todayLocalStr(), "La fecha no puede ser futura");

export const transactionSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Introduce un monto" })
    .positive("El monto debe ser mayor a 0"),
  date: notFutureDate,
  description: z.string().min(2, "Describe la transacción").max(120),
  // El <select> envía "" para "Sin categoría" → lo normalizamos a null.
  category_id: z.preprocess(
    (v) => (v === "" || v == null ? null : v),
    z.string().uuid().nullable()
  ),
  type: z.enum(["ingreso", "gasto"]),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
