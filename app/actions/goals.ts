"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { goalSchema, goalContributionSchema } from "@/lib/validations/goal";

export const getGoals = async () => {
  const { userId } = await auth();
  if (!userId) return [];

  const goals = await prisma.goal.findMany({
    where: { userId },
    include: { contributions: true },
    orderBy: { createdAt: "desc" },
  });

  return goals.map((g) => ({
    ...g,
    percentage: Math.min(
      Number(g.targetAmount) > 0
        ? (Number(g.currentAmount) / Number(g.targetAmount)) * 100
        : 0,
      100
    ),
  }));
};

export const createGoal = async (formData: FormData) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const raw = {
    name: formData.get("name") as string,
    targetAmount: formData.get("targetAmount") as string,
    currency: (formData.get("currency") as string) || "ARS",
    deadline: (formData.get("deadline") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
  };

  const parsed = goalSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.goal.create({
    data: {
      userId,
      name: parsed.data.name,
      targetAmount: parsed.data.targetAmount,
      currency: parsed.data.currency,
      deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
      description: parsed.data.description || null,
    },
  });

  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard");
};

export const updateGoal = async (id: string, formData: FormData) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const raw = {
    name: formData.get("name") as string,
    targetAmount: formData.get("targetAmount") as string,
    currency: (formData.get("currency") as string) || "ARS",
    deadline: (formData.get("deadline") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
  };

  const parsed = goalSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.goal.update({
    where: { id, userId },
    data: {
      name: parsed.data.name,
      targetAmount: parsed.data.targetAmount,
      currency: parsed.data.currency,
      deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
      description: parsed.data.description || null,
    },
  });

  revalidatePath("/dashboard/goals");
};

export const deleteGoal = async (id: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.goal.delete({ where: { id, userId } });
  revalidatePath("/dashboard/goals");
  revalidatePath("/dashboard");
};

export const addGoalContribution = async (
  goalId: string,
  formData: FormData
) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const raw = {
    amount: formData.get("amount") as string,
    date: (formData.get("date") as string) || new Date().toISOString().split("T")[0],
    note: (formData.get("note") as string) || undefined,
  };

  const parsed = goalContributionSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await prisma.$transaction(async (tx) => {
    await tx.goalContribution.create({
      data: {
        goalId,
        userId,
        amount: parsed.data.amount,
        date: new Date(parsed.data.date),
        note: parsed.data.note || null,
      },
    });

    const goal = await tx.goal.findUnique({
      where: { id: goalId, userId },
      select: { currentAmount: true, targetAmount: true },
    });
    if (!goal) throw new Error("Goal not found");

    const newAmount = Number(goal.currentAmount) + parsed.data.amount;
    const isCompleted = newAmount >= Number(goal.targetAmount);

    await tx.goal.update({
      where: { id: goalId },
      data: {
        currentAmount: newAmount,
        isCompleted,
      },
    });
  });

  revalidatePath("/dashboard/goals");
};
