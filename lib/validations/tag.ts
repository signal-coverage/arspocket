import { z } from "zod";

export const tagSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or less"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color")
    .optional()
    .or(z.literal("")),
});

export type TagFormValues = z.infer<typeof tagSchema>;
