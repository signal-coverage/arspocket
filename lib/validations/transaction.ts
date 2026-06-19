import { z } from "zod";

export const dateRangeSchema = z
  .object({
    from: z.string().refine((v) => !isNaN(Date.parse(v)), {
      message: "Invalid start date",
    }),
    to: z.string().refine((v) => !isNaN(Date.parse(v)), {
      message: "Invalid end date",
    }),
  })
  .refine(
    (data) => new Date(data.from) <= new Date(data.to),
    { message: "Start date must be before end date", path: ["from"] }
  )
  .refine(
    (data) => {
      const diffMs =
        new Date(data.to).getTime() - new Date(data.from).getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      return diffDays <= 366;
    },
    { message: "Date range cannot exceed 366 days", path: ["to"] }
  );

export type DateRange = z.infer<typeof dateRangeSchema>;
