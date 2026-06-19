"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { TransactionType } from "@prisma/client";
import { getFXRates, normalizeToBase } from "@/lib/utils/fx";
import { checkAndSendBudgetAlert } from "@/app/actions/budgets";

export const createTransaction = async (data: {
  type: "income" | "outcome";
  amount: number;
  description: string;
  category: string;
  date: string;
  tagIds?: string[];
  isRecurring?: boolean;
  recurringFrequency?: string;
  recurringEndDate?: string;
}) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type:
        data.type === "income"
          ? TransactionType.INCOME
          : TransactionType.OUTCOME,
      amount: data.amount,
      description: data.description,
      category: data.category,
      date: new Date(data.date),
      isRecurring: data.isRecurring ?? false,
      recurringFrequency: data.recurringFrequency as never ?? null,
      recurringEndDate: data.recurringEndDate
        ? new Date(data.recurringEndDate)
        : null,
      ...(data.isRecurring && data.recurringFrequency
        ? {
            nextDueDate: computeNextDueDateFromString(
              new Date(data.date),
              data.recurringFrequency
            ),
          }
        : {}),
      ...(data.tagIds?.length
        ? {
            tags: {
              create: data.tagIds.map((tagId) => ({ tagId })),
            },
          }
        : {}),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/income");
  revalidatePath("/dashboard/outcome");

  // Check budget alerts for outcome transactions (best-effort)
  let alertLevel: "80" | "100" | null = null;
  if (data.type === "outcome") {
    const txDate = new Date(data.date);
    try {
      alertLevel = await checkAndSendBudgetAlert(
        userId,
        data.category,
        txDate.getMonth() + 1,
        txDate.getFullYear()
      );
    } catch {
      // Best-effort — alert check failure must not break transaction creation
    }
  }

  return { id: transaction.id, alertLevel };
};

function computeNextDueDateFromString(from: Date, frequency: string): Date {
  const d = new Date(from);
  switch (frequency) {
    case "DAILY":
      d.setDate(d.getDate() + 1);
      break;
    case "WEEKLY":
      d.setDate(d.getDate() + 7);
      break;
    case "BIWEEKLY":
      d.setDate(d.getDate() + 14);
      break;
    case "MONTHLY":
      d.setMonth(d.getMonth() + 1);
      break;
    case "YEARLY":
      d.setFullYear(d.getFullYear() + 1);
      break;
  }
  return d;
}

export const getTransactions = async (
  type?: "income" | "outcome",
  filters?: { search?: string; category?: string; tagId?: string },
) => {
  const { userId } = await auth();
  if (!userId) return [];

  return prisma.transaction.findMany({
    where: {
      userId,
      ...(type
        ? {
            type:
              type === "income"
                ? TransactionType.INCOME
                : TransactionType.OUTCOME,
          }
        : {}),
      ...(filters?.category ? { category: filters.category } : {}),
      ...(filters?.search
        ? { description: { contains: filters.search, mode: "insensitive" } }
        : {}),
      ...(filters?.tagId
        ? { tags: { some: { tagId: filters.tagId } } }
        : {}),
    },
    include: {
      tags: {
        include: { tag: true },
      },
    },
    orderBy: { date: "desc" },
    take: 50,
  });
};

export const updateTransaction = async (
  id: string,
  data: {
    type?: "income" | "outcome";
    amount?: number;
    description?: string;
    category?: string;
    date?: string;
    tagIds?: string[];
    isRecurring?: boolean;
    recurringFrequency?: string;
    recurringEndDate?: string;
  }
) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.$transaction(async (tx) => {
    // Delete existing tag associations
    if (data.tagIds !== undefined) {
      await tx.transactionTag.deleteMany({ where: { transactionId: id } });
    }

    await tx.transaction.update({
      where: { id, userId },
      data: {
        ...(data.type !== undefined
          ? {
              type:
                data.type === "income"
                  ? TransactionType.INCOME
                  : TransactionType.OUTCOME,
            }
          : {}),
        ...(data.amount !== undefined ? { amount: data.amount } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.date !== undefined ? { date: new Date(data.date) } : {}),
        ...(data.isRecurring !== undefined
          ? { isRecurring: data.isRecurring }
          : {}),
        ...(data.recurringFrequency !== undefined
          ? { recurringFrequency: data.recurringFrequency as never }
          : {}),
        ...(data.recurringEndDate !== undefined
          ? {
              recurringEndDate: data.recurringEndDate
                ? new Date(data.recurringEndDate)
                : null,
            }
          : {}),
        ...(data.tagIds?.length
          ? {
              tags: {
                create: data.tagIds.map((tagId) => ({ tagId })),
              },
            }
          : {}),
      },
    });
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/income");
  revalidatePath("/dashboard/outcome");
};

export const deleteTransaction = async (id: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.transaction.delete({
    where: { id, userId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/income");
  revalidatePath("/dashboard/outcome");
};

export const getDashboardStats = async () => {
  const { userId } = await auth();
  if (!userId) return { balance: 0, monthlyIncome: 0, monthlyExpenses: 0 };

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [allTransactions, monthlyTransactions] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      select: { type: true, amount: true },
    }),
    prisma.transaction.findMany({
      where: { userId, date: { gte: startOfMonth } },
      select: { type: true, amount: true },
    }),
  ]);

  const balance = allTransactions.reduce((acc, t) => {
    return t.type === TransactionType.INCOME
      ? acc + Number(t.amount)
      : acc - Number(t.amount);
  }, 0);

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const monthlyExpenses = monthlyTransactions
    .filter((t) => t.type === TransactionType.OUTCOME)
    .reduce((acc, t) => acc + Number(t.amount), 0);

  return { balance, monthlyIncome, monthlyExpenses };
};

export const getDateRangeReport = async (
  from: Date,
  to: Date,
  baseCurrency?: string
) => {
  const { userId } = await auth();
  if (!userId) return null;

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: from, lte: to },
    },
    select: { type: true, amount: true, category: true, date: true },
    orderBy: { date: "desc" },
  });

  // Group raw totals by type
  const rawIncome = transactions
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((acc, t) => acc + Number(t.amount), 0);
  const rawExpenses = transactions
    .filter((t) => t.type === TransactionType.OUTCOME)
    .reduce((acc, t) => acc + Number(t.amount), 0);

  // Group by category
  const byCategory: Record<string, { income: number; expenses: number }> = {};
  for (const t of transactions) {
    if (!byCategory[t.category])
      byCategory[t.category] = { income: 0, expenses: 0 };
    if (t.type === TransactionType.INCOME)
      byCategory[t.category].income += Number(t.amount);
    else byCategory[t.category].expenses += Number(t.amount);
  }

  let normalizedIncome: number | null = null;
  let normalizedExpenses: number | null = null;
  let ratesStale = false;

  if (baseCurrency) {
    const { rates, stale } = await getFXRates();
    ratesStale = stale;
    // All amounts in this app are in ARS (single currency for now)
    normalizedIncome = normalizeToBase(rawIncome, "ARS", baseCurrency, rates);
    normalizedExpenses = normalizeToBase(
      rawExpenses,
      "ARS",
      baseCurrency,
      rates
    );
  }

  return {
    from,
    to,
    rawIncome,
    rawExpenses,
    rawSavings: rawIncome - rawExpenses,
    byCategory,
    baseCurrency: baseCurrency ?? null,
    normalizedIncome,
    normalizedExpenses,
    normalizedSavings:
      normalizedIncome != null && normalizedExpenses != null
        ? normalizedIncome - normalizedExpenses
        : null,
    ratesStale,
    transactionCount: transactions.length,
  };
};

/** Backward-compatible thin wrapper */
export const getMonthlyReport = async (
  year: number,
  month: number,
  baseCurrency?: string
) => {
  const from = new Date(year, month - 1, 1);
  const to = new Date(year, month, 0, 23, 59, 59);
  return getDateRangeReport(from, to, baseCurrency);
};

export const updateTransactionGeoTag = async (
  id: string,
  lat: number,
  lng: number,
  locationName?: string
): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (lat < -90 || lat > 90) throw new Error("Latitude must be between -90 and 90");
  if (lng < -180 || lng > 180) throw new Error("Longitude must be between -180 and 180");

  await prisma.transaction.update({
    where: { id, userId },
    data: {
      latitude: lat,
      longitude: lng,
      locationName: locationName ?? null,
    },
  });

  revalidatePath("/dashboard/map");
};

export const removeTransactionGeoTag = async (id: string): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.transaction.update({
    where: { id, userId },
    data: { latitude: null, longitude: null, locationName: null },
  });

  revalidatePath("/dashboard/map");
};

export const getGeoTaggedTransactions = async () => {
  const { userId } = await auth();
  if (!userId) return [];

  const transactions = await prisma.transaction.findMany({
    where: { userId, latitude: { not: null } },
    select: {
      id: true,
      description: true,
      amount: true,
      category: true,
      date: true,
      latitude: true,
      longitude: true,
      locationName: true,
      type: true,
    },
    orderBy: { date: "desc" },
  });

  return transactions.map((t) => ({
    id: t.id,
    description: t.description,
    amount: Number(t.amount),
    category: t.category,
    date: t.date.toISOString(),
    latitude: t.latitude!,
    longitude: t.longitude!,
    locationName: t.locationName,
    type: t.type,
  }));
};

export const getTransactionsByDay = async (
  year: number,
  month: number
): Promise<Record<string, { income: number; expense: number; count: number }>> => {
  const { userId } = await auth();
  if (!userId) return {};

  const from = new Date(year, month - 1, 1);
  const to = new Date(year, month, 0, 23, 59, 59);

  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: from, lte: to } },
    select: { type: true, amount: true, date: true },
    orderBy: { date: "asc" },
  });

  const result: Record<
    string,
    { income: number; expense: number; count: number }
  > = {};

  for (const t of transactions) {
    const key = t.date.toISOString().split("T")[0];
    if (!result[key]) result[key] = { income: 0, expense: 0, count: 0 };
    result[key].count++;
    if (t.type === TransactionType.INCOME)
      result[key].income += Number(t.amount);
    else result[key].expense += Number(t.amount);
  }

  return result;
};
