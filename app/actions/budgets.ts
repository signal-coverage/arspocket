"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { BudgetPeriod, TransactionType } from "@prisma/client";
import { dateRangeForPeriod } from "@/lib/dates";

export type BudgetWithSpend = {
  id: string;
  category: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string;
  spent: number;
  remaining: number;
  pct: number;
  state: "SAFE" | "WARNING" | "DANGER";
};

export const getBudgets = async () => {
  const { userId } = await auth();
  if (!userId) return [];
  return prisma.budget.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const createBudget = async (data: {
  category: string;
  amount: number;
  period: "WEEKLY" | "MONTHLY" | "YEARLY";
  startDate: string;
}) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.budget.create({
    data: {
      userId,
      category: data.category,
      amount: data.amount,
      period: data.period as BudgetPeriod,
      startDate: new Date(data.startDate),
    },
  });
  revalidatePath("/dashboard/budget");
  revalidatePath("/dashboard");
};

export const getBudgetsWithSpend = async (): Promise<BudgetWithSpend[]> => {
  const { userId } = await auth();
  if (!userId) return [];

  const budgets = await prisma.budget.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();

  const results: BudgetWithSpend[] = [];

  for (const budget of budgets) {
    const { start, end } = dateRangeForPeriod(budget.period, now);

    const agg = await prisma.transaction.aggregate({
      where: {
        userId,
        type: TransactionType.OUTCOME,
        date: { gte: start, lte: end },
        // Case-insensitive category match
        category: { equals: budget.category, mode: "insensitive" },
      },
      _sum: { amount: true },
    });

    const amount = Number(budget.amount);
    const spent = Number(agg._sum.amount ?? 0);
    const remaining = Math.max(0, amount - spent);
    const pct =
      amount > 0 ? Math.min(Math.round((spent / amount) * 100), 100) : 0;
    const state: "SAFE" | "WARNING" | "DANGER" =
      pct >= 90 ? "DANGER" : pct >= 75 ? "WARNING" : "SAFE";

    results.push({
      id: budget.id,
      category: budget.category,
      amount,
      period: budget.period,
      startDate: budget.startDate.toISOString(),
      spent,
      remaining,
      pct,
      state,
    });
  }

  return results;
};

export const updateBudget = async (
  id: string,
  data: { amount?: number; startDate?: string },
): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.budget.update({
    where: { id, userId },
    data: {
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.startDate !== undefined && {
        startDate: new Date(data.startDate),
      }),
    },
  });

  revalidatePath("/dashboard/budget");
  revalidatePath("/dashboard");
};

export const deleteBudget = async (id: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  await prisma.budget.delete({ where: { id, userId } });
  revalidatePath("/dashboard/budget");
  revalidatePath("/dashboard");
};

/**
 * Check budget thresholds after a transaction mutation and return the alert level.
 * Idempotent: fires each threshold at most once per month.
 */
export const checkAndSendBudgetAlert = async (
  userId: string,
  category: string,
  month: number,
  year: number,
): Promise<"80" | "100" | null> => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);

  const budget = await prisma.budget.findFirst({
    where: { userId, category, period: "MONTHLY" },
  });
  if (!budget) return null;

  const spending = await prisma.transaction.aggregate({
    where: {
      userId,
      category,
      type: TransactionType.OUTCOME,
      date: { gte: startOfMonth, lte: endOfMonth },
    },
    _sum: { amount: true },
  });

  const spent = Number(spending._sum.amount ?? 0);
  const limit = Number(budget.amount);
  if (limit <= 0) return null;

  const pct = (spent / limit) * 100;

  if (pct >= 100 && !budget.alertSentAt100) {
    await prisma.budget.update({
      where: { id: budget.id },
      data: { alertSentAt100: new Date() },
    });
    return "100";
  }

  if (pct >= 80 && !budget.alertSentAt80) {
    await prisma.budget.update({
      where: { id: budget.id },
      data: { alertSentAt80: new Date() },
    });
    return "80";
  }

  return null;
};
