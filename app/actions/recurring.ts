"use server";

import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
} from "date-fns";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { RecurringFrequency, TransactionType } from "@prisma/client";

export const computeNextDueDate = (
  current: Date,
  frequency: RecurringFrequency
): Date => {
  switch (frequency) {
    case RecurringFrequency.DAILY:
      return addDays(current, 1);
    case RecurringFrequency.WEEKLY:
      return addWeeks(current, 1);
    case RecurringFrequency.BIWEEKLY:
      return addWeeks(current, 2);
    case RecurringFrequency.MONTHLY:
      return addMonths(current, 1);
    case RecurringFrequency.YEARLY:
      return addYears(current, 1);
  }
};

export const processRecurringTransactions = async (): Promise<{
  processed: number;
  errors: string[];
}> => {
  const now = new Date();
  const errors: string[] = [];
  let processed = 0;

  const due = await prisma.transaction.findMany({
    where: {
      isRecurring: true,
      recurringFrequency: { not: null },
      nextDueDate: { lte: now },
      OR: [
        { recurringEndDate: null },
        { recurringEndDate: { gte: now } },
      ],
    },
  });

  for (const t of due) {
    try {
      await prisma.$transaction([
        prisma.transaction.create({
          data: {
            userId: t.userId,
            type: t.type,
            amount: t.amount,
            description: t.description,
            category: t.category,
            date: t.nextDueDate ?? now,
            isRecurring: false,
            parentRecurringId: t.id,
          },
        }),
        prisma.transaction.update({
          where: { id: t.id },
          data: {
            nextDueDate: computeNextDueDate(
              t.nextDueDate ?? now,
              t.recurringFrequency!
            ),
          },
        }),
      ]);
      processed++;
    } catch (err) {
      errors.push(
        `Transaction ${t.id}: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  if (processed > 0) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/income");
    revalidatePath("/dashboard/outcome");
  }

  return { processed, errors };
};
