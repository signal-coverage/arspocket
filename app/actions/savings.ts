"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export const createSavingsGoal = async (data: {
  amount: number;
  goalName: string;
  description?: string;
  date: string;
}) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.savingsGoal.create({
    data: {
      userId,
      goalName: data.goalName,
      targetAmount: data.amount,
      currentAmount: 0,
      description: data.description,
      targetDate: new Date(data.date),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/savings");
};

export const getSavingsGoals = async () => {
  const { userId } = await auth();
  if (!userId) return [];

  return prisma.savingsGoal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const deleteSavingsGoal = async (id: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.savingsGoal.delete({
    where: { id, userId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/savings");
};

export const contributeSavingsGoal = async (id: string, amount: number) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const goal = await prisma.savingsGoal.findUnique({ where: { id, userId } });
  if (!goal) throw new Error("Goal not found");

  const newAmount = Number(goal.currentAmount) + amount;

  await prisma.savingsGoal.update({
    where: { id, userId },
    data: { currentAmount: Math.min(newAmount, Number(goal.targetAmount)) },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/savings");
};
