"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { GoalStatus } from "@prisma/client";

export type SerializedMilestone = {
  id: string;
  goalId: string;
  userId: string;
  title: string;
  targetDate: string;
  isCompleted: boolean;
  createdAt: string;
};

export type SerializedSavingsGoalWithMilestones = {
  id: string;
  userId: string;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  description: string | null;
  targetDate: string | null;
  createdAt: string;
  color: string | null;
  status: GoalStatus | null;
  milestones: SerializedMilestone[];
  pct: number;
};

export const getSavingsGoalsWithMilestones =
  async (): Promise<SerializedSavingsGoalWithMilestones[]> => {
    const { userId } = await auth();
    if (!userId) return [];

    const goals = await prisma.savingsGoal.findMany({
      where: { userId },
      include: {
        milestones: { orderBy: { targetDate: "asc" } },
      },
      orderBy: { createdAt: "asc" },
    });

    return goals.map((g) => {
      const targetAmount = Number(g.targetAmount);
      const currentAmount = Number(g.currentAmount);
      const pct =
        targetAmount > 0
          ? Math.min(Math.round((currentAmount / targetAmount) * 100), 100)
          : 0;

      return {
        id: g.id,
        userId: g.userId,
        goalName: g.goalName,
        targetAmount,
        currentAmount,
        description: g.description,
        targetDate: g.targetDate ? g.targetDate.toISOString() : null,
        createdAt: g.createdAt.toISOString(),
        color: g.color,
        status: g.status,
        pct,
        milestones: g.milestones.map((m) => ({
          id: m.id,
          goalId: m.goalId,
          userId: m.userId,
          title: m.title,
          targetDate: m.targetDate.toISOString(),
          isCompleted: m.isCompleted,
          createdAt: m.createdAt.toISOString(),
        })),
      };
    });
  };

export const updateSavingsGoalMeta = async (
  id: string,
  data: { color?: string; status?: GoalStatus }
): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.savingsGoal.update({
    where: { id, userId },
    data: {
      ...(data.color !== undefined && { color: data.color }),
      ...(data.status !== undefined && { status: data.status }),
    },
  });

  revalidatePath("/dashboard/goals");
};

export const createMilestone = async (data: {
  goalId: string;
  title: string;
  targetDate: string;
}): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Verify goal belongs to user
  const goal = await prisma.savingsGoal.findUnique({
    where: { id: data.goalId, userId },
    select: { id: true },
  });
  if (!goal) throw new Error("Goal not found or unauthorized");

  await prisma.goalMilestone.create({
    data: {
      goalId: data.goalId,
      userId,
      title: data.title,
      targetDate: new Date(data.targetDate),
    },
  });

  revalidatePath("/dashboard/goals");
};

export const updateMilestone = async (
  id: string,
  data: { title?: string; targetDate?: string; isCompleted?: boolean }
): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.goalMilestone.update({
    where: { id, userId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.targetDate !== undefined && {
        targetDate: new Date(data.targetDate),
      }),
      ...(data.isCompleted !== undefined && { isCompleted: data.isCompleted }),
    },
  });

  revalidatePath("/dashboard/goals");
};

export const deleteMilestone = async (id: string): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.goalMilestone.delete({ where: { id, userId } });

  revalidatePath("/dashboard/goals");
};

export const toggleMilestoneComplete = async (id: string): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const milestone = await prisma.goalMilestone.findUnique({
    where: { id, userId },
    select: { isCompleted: true },
  });
  if (!milestone) throw new Error("Milestone not found");

  await prisma.goalMilestone.update({
    where: { id, userId },
    data: { isCompleted: !milestone.isCompleted },
  });

  revalidatePath("/dashboard/goals");
};
