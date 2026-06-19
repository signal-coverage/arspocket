import { prisma } from "@/lib/db";
import { RecurringFrequency, TransactionType } from "@prisma/client";
import { addDays, addWeeks, addMonths, addYears } from "date-fns";

export type ProjectionPoint = {
  date: string; // "YYYY-MM-DD"
  projected: number;
  cumulative: number;
};

function nextOccurrence(from: Date, freq: RecurringFrequency): Date {
  switch (freq) {
    case RecurringFrequency.DAILY:
      return addDays(from, 1);
    case RecurringFrequency.WEEKLY:
      return addWeeks(from, 1);
    case RecurringFrequency.BIWEEKLY:
      return addWeeks(from, 2);
    case RecurringFrequency.MONTHLY:
      return addMonths(from, 1);
    case RecurringFrequency.YEARLY:
      return addYears(from, 1);
  }
}

export const getCashFlowProjection = async (
  userId: string,
  days: 30 | 60 | 90,
): Promise<ProjectionPoint[]> => {
  const now = new Date();
  const horizon = addDays(now, days);
  const ninetyDaysAgo = addDays(now, -90);

  // 1. Get recurring transactions
  const recurring = await prisma.transaction.findMany({
    where: {
      userId,
      isRecurring: true,
      recurringFrequency: { not: null },
      OR: [{ recurringEndDate: null }, { recurringEndDate: { gte: now } }],
    },
    select: {
      type: true,
      amount: true,
      recurringFrequency: true,
      nextDueDate: true,
      date: true,
    },
  });

  // 2. Get last 90 days of non-recurring transactions for heuristic
  const historical = await prisma.transaction.findMany({
    where: {
      userId,
      isRecurring: false,
      date: { gte: ninetyDaysAgo, lte: now },
    },
    select: { type: true, amount: true, date: true },
  });

  // Compute average daily net by day-of-week
  const dowTotals: Record<number, { net: number; count: number }> = {};
  for (let dow = 0; dow < 7; dow++) {
    dowTotals[dow] = { net: 0, count: 0 };
  }
  for (const t of historical) {
    const dow = new Date(t.date).getDay();
    const sign = t.type === TransactionType.INCOME ? 1 : -1;
    dowTotals[dow].net += sign * Number(t.amount);
    dowTotals[dow].count++;
  }
  const dowAvg: Record<number, number> = {};
  for (let dow = 0; dow < 7; dow++) {
    dowAvg[dow] =
      dowTotals[dow].count > 0 ? dowTotals[dow].net / dowTotals[dow].count : 0;
  }

  // 3. Build recurring schedule map
  const recurringSchedule: Record<string, number> = {};
  for (const t of recurring) {
    let next = t.nextDueDate ?? t.date;
    const sign = t.type === TransactionType.INCOME ? 1 : -1;
    const amount = sign * Number(t.amount);
    while (next <= horizon) {
      const key = next.toISOString().split("T")[0];
      recurringSchedule[key] = (recurringSchedule[key] ?? 0) + amount;
      next = nextOccurrence(next, t.recurringFrequency!);
    }
  }

  // 4. Build projection array
  const result: ProjectionPoint[] = [];
  let cumulative = 0;
  const hasData = historical.length > 0 || recurring.length > 0;

  for (let i = 1; i <= days; i++) {
    const d = addDays(now, i);
    const key = d.toISOString().split("T")[0];
    const recurringAmount = recurringSchedule[key] ?? 0;
    const heuristicAmount = hasData ? (dowAvg[d.getDay()] ?? 0) : 0;
    const projected = recurringAmount + heuristicAmount;
    cumulative += projected;
    result.push({ date: key, projected, cumulative });
  }

  return result;
};
