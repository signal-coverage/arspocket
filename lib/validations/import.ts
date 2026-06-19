import { z } from "zod";

export const importRowSchema = z.object({
  type: z
    .string()
    .transform((v) => v.toUpperCase())
    .pipe(z.enum(["INCOME", "OUTCOME"], { error: "Type must be INCOME or OUTCOME" })),
  amount: z
    .string()
    .transform((v) => parseFloat(v.replace(/,/g, ".")))
    .pipe(z.number().positive("Amount must be positive")),
  currency: z
    .string()
    .transform((v) => v.toUpperCase())
    .pipe(z.enum(["ARS", "USD", "USDC", "EUR"], { error: "Invalid currency" })),
  date: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), { message: "Invalid date" }),
  description: z.string().optional().default(""),
  category: z.string().optional().default("Other"),
});

export type ImportRow = z.infer<typeof importRowSchema>;
