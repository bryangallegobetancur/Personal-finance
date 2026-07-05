import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "El nombre es muy corto").max(60),
  type: z.enum(["ingreso", "gasto"]),
});

export type CategoryInput = z.infer<typeof categorySchema>;
