"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { BillFrequency, TransactionType } from "@prisma/client";

// Helper: clamp dueDay to valid day for a given month/year
const clampDueDayToMonth = (
  dueDay: number,
  year: number,
  month: number,
): number => {
  const maxDay = new Date(year, month + 1, 0).getDate(); // last day of month
  return Math.min(dueDay, maxDay);
};

// Helper: compute next due date given a bill frequency and current due date
const computeNextDueDate = (
  current: Date,
  frequency: BillFrequency,
  dueDay: number,
): Date => {
  const next = new Date(current);
  switch (frequency) {
    case BillFrequency.WEEKLY:
      next.setDate(next.getDate() + 7);
      break;
    case BillFrequency.BIWEEKLY:
      next.setDate(next.getDate() + 14);
      break;
    case BillFrequency.MONTHLY: {
      const nextMonth = next.getMonth() + 1;
      const nextYear =
        nextMonth > 11 ? next.getFullYear() + 1 : next.getFullYear();
      const adjustedMonth = nextMonth > 11 ? 0 : nextMonth;
      const clampedDay = clampDueDayToMonth(dueDay, nextYear, adjustedMonth);
      next.setFullYear(nextYear, adjustedMonth, clampedDay);
      break;
    }
    case BillFrequency.YEARLY:
      next.setFullYear(next.getFullYear() + 1);
      break;
    case BillFrequency.ONE_TIME:
      // No next due date for one-time bills
      break;
  }
  next.setHours(0, 0, 0, 0);
  return next;
};

export type SerializedBill = {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dueDay: number;
  category: string;
  isPaid: boolean;
  paidAt: string | null;
  isRecurring: boolean;
  frequency: BillFrequency;
  nextDueDate: string;
  notes: string | null;
  transactionId: string | null;
  createdAt: string;
};

const serializeBill = (bill: {
  id: string;
  userId: string;
  name: string;
  amount: { toString: () => string } | number;
  dueDay: number;
  category: string;
  isPaid: boolean;
  paidAt: Date | null;
  isRecurring: boolean;
  frequency: BillFrequency;
  nextDueDate: Date;
  notes: string | null;
  transactionId: string | null;
  createdAt: Date;
}): SerializedBill => ({
  id: bill.id,
  userId: bill.userId,
  name: bill.name,
  amount: Number(bill.amount),
  dueDay: bill.dueDay,
  category: bill.category,
  isPaid: bill.isPaid,
  paidAt: bill.paidAt ? bill.paidAt.toISOString() : null,
  isRecurring: bill.isRecurring,
  frequency: bill.frequency,
  nextDueDate: bill.nextDueDate.toISOString(),
  notes: bill.notes,
  transactionId: bill.transactionId,
  createdAt: bill.createdAt.toISOString(),
});

export const getBills = async (): Promise<SerializedBill[]> => {
  const { userId } = await auth();
  if (!userId) return [];

  const bills = await prisma.bill.findMany({
    where: { userId },
    orderBy: { nextDueDate: "asc" },
  });

  return bills.map(serializeBill);
};

export const getBillsForMonth = async (
  year: number,
  month: number,
): Promise<SerializedBill[]> => {
  const { userId } = await auth();
  if (!userId) return [];

  // Get all user bills — we filter by dueDay matching days in the given month
  const bills = await prisma.bill.findMany({
    where: { userId },
    orderBy: { dueDay: "asc" },
  });

  return bills.map(serializeBill);
};

export const getUpcomingBills = async (
  days: number,
): Promise<SerializedBill[]> => {
  const { userId } = await auth();
  if (!userId) return [];

  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + days);

  const bills = await prisma.bill.findMany({
    where: {
      userId,
      nextDueDate: { lte: future },
    },
    orderBy: { nextDueDate: "asc" },
  });

  return bills.map(serializeBill);
};

export const createBill = async (data: {
  name: string;
  amount: number;
  dueDay: number;
  category: string;
  isRecurring: boolean;
  frequency: string;
  notes?: string;
}): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const now = new Date();
  const clampedDay = clampDueDayToMonth(
    data.dueDay,
    now.getFullYear(),
    now.getMonth(),
  );
  const nextDueDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    clampedDay,
    0,
    0,
    0,
    0,
  );

  await prisma.bill.create({
    data: {
      userId,
      name: data.name,
      amount: data.amount,
      dueDay: data.dueDay,
      category: data.category,
      isRecurring: data.isRecurring,
      frequency: data.frequency as BillFrequency,
      nextDueDate,
      notes: data.notes ?? null,
    },
  });

  revalidatePath("/dashboard/bills");
  revalidatePath("/dashboard");
};

export const updateBill = async (
  id: string,
  data: {
    name?: string;
    amount?: number;
    dueDay?: number;
    category?: string;
    isRecurring?: boolean;
    frequency?: string;
    notes?: string;
  },
): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.bill.update({
    where: { id, userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.dueDay !== undefined && { dueDay: data.dueDay }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.isRecurring !== undefined && { isRecurring: data.isRecurring }),
      ...(data.frequency !== undefined && {
        frequency: data.frequency as BillFrequency,
      }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
  });

  revalidatePath("/dashboard/bills");
};

export const deleteBill = async (id: string): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.bill.delete({ where: { id, userId } });

  revalidatePath("/dashboard/bills");
  revalidatePath("/dashboard");
};

export const markBillAsPaid = async (id: string): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const bill = await prisma.bill.findUnique({ where: { id, userId } });
  if (!bill) throw new Error("Bill not found");

  const now = new Date();

  try {
    // Attempt atomic transaction
    await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          userId,
          type: TransactionType.OUTCOME,
          amount: bill.amount,
          description: bill.name,
          category: bill.category,
          date: now,
        },
      });

      await tx.bill.update({
        where: { id },
        data: {
          isPaid: true,
          paidAt: now,
          transactionId: transaction.id,
        },
      });
    });
  } catch {
    // Fallback: sequential writes if $transaction fails (NeonHttp edge case)
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type: TransactionType.OUTCOME,
        amount: bill.amount,
        description: bill.name,
        category: bill.category,
        date: now,
      },
    });

    await prisma.bill.update({
      where: { id },
      data: {
        isPaid: true,
        paidAt: now,
        transactionId: transaction.id,
      },
    });
  }

  revalidatePath("/dashboard/bills");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/outcome");
};

export const unmarkBillAsPaid = async (id: string): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const bill = await prisma.bill.findUnique({ where: { id, userId } });
  if (!bill) throw new Error("Bill not found");

  if (bill.transactionId) {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.transaction.delete({ where: { id: bill.transactionId! } });
        await tx.bill.update({
          where: { id },
          data: { isPaid: false, paidAt: null, transactionId: null },
        });
      });
    } catch {
      // Sequential fallback
      await prisma.transaction.delete({ where: { id: bill.transactionId } });
      await prisma.bill.update({
        where: { id },
        data: { isPaid: false, paidAt: null, transactionId: null },
      });
    }
  } else {
    await prisma.bill.update({
      where: { id },
      data: { isPaid: false, paidAt: null },
    });
  }

  revalidatePath("/dashboard/bills");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/outcome");
};

export const lazyResetOverdueBills = async (): Promise<void> => {
  const { userId } = await auth();
  if (!userId) return;

  const now = new Date();

  // Find recurring bills that are paid and whose nextDueDate has passed
  const overdue = await prisma.bill.findMany({
    where: {
      userId,
      isRecurring: true,
      isPaid: true,
      nextDueDate: { lt: now },
    },
  });

  for (const bill of overdue) {
    const nextDueDate = computeNextDueDate(
      bill.nextDueDate,
      bill.frequency,
      bill.dueDay,
    );
    await prisma.bill.update({
      where: { id: bill.id },
      data: {
        isPaid: false,
        paidAt: null,
        transactionId: null,
        nextDueDate,
      },
    });
  }
};
