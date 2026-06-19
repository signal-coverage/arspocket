import { z } from "zod";

export const goalSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  targetAmount: z.coerce
    .number()
    .positive("Target amount must be greater than 0"),
  currency: z.string().default("ARS"),
  deadline: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

export const goalContributionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  note: z.string().optional().or(z.literal("")),
});

export type GoalFormValues = z.infer<typeof goalSchema>;
export type GoalContributionFormValues = z.infer<typeof goalContributionSchema>;
