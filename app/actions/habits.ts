"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { dateToString, getLastNDays } from "@/lib/dates";

const DEFAULT_HABITS = [
  { name: "Check budget", icon: "💰", color: "#6366f1" },
  { name: "Log a transaction", icon: "📝", color: "#10b981" },
  { name: "Review savings goal", icon: "🎯", color: "#f59e0b" },
  { name: "No-spend day", icon: "🚫", color: "#ef4444" },
];

export type SerializedHabit = {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  targetDays: number[];
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  todayCompleted?: boolean;
  weekCompletionRate?: number;
};

export type HeatmapDay = {
  date: string; // YYYY-MM-DD
  count: number; // number of completed habit logs that day
  isActive: boolean; // true if any activity logged
};

export type StreakData = {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  todayActive: boolean;
};

export const seedDefaultHabits = async (): Promise<void> => {
  const { userId } = await auth();
  if (!userId) return;

  const existing = await prisma.habit.count({ where: { userId } });
  if (existing > 0) return;

  await Promise.all(
    DEFAULT_HABITS.map((h) =>
      prisma.habit.create({
        data: {
          userId,
          name: h.name,
          icon: h.icon,
          color: h.color,
          isDefault: true,
          isActive: true,
        },
      }),
    ),
  );

  revalidatePath("/dashboard/habits");
};

export const getHabits = async (): Promise<SerializedHabit[]> => {
  const { userId } = await auth();
  if (!userId) return [];

  const habits = await prisma.habit.findMany({
    where: { userId, isActive: true },
    orderBy: { createdAt: "asc" },
  });

  return habits.map((h) => ({
    id: h.id,
    userId: h.userId,
    name: h.name,
    icon: h.icon,
    color: h.color,
    targetDays: h.targetDays as number[],
    isDefault: h.isDefault,
    isActive: h.isActive,
    createdAt: h.createdAt.toISOString(),
  }));
};

export const getHabitsWithTodayLogs = async (): Promise<SerializedHabit[]> => {
  const { userId } = await auth();
  if (!userId) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = dateToString(today);

  const habits = await prisma.habit.findMany({
    where: { userId, isActive: true },
    include: {
      logs: {
        where: {
          userId,
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Compute week completion rate
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);

  const weekLogs = await prisma.habitLog.groupBy({
    by: ["habitId"],
    where: {
      userId,
      completed: true,
      date: { gte: weekStart },
    },
    _count: { id: true },
  });

  const weekLogMap = new Map(weekLogs.map((l) => [l.habitId, l._count.id]));

  return habits.map((h) => ({
    id: h.id,
    userId: h.userId,
    name: h.name,
    icon: h.icon,
    color: h.color,
    targetDays: h.targetDays as number[],
    isDefault: h.isDefault,
    isActive: h.isActive,
    createdAt: h.createdAt.toISOString(),
    todayCompleted: h.logs.some((l) => l.completed),
    weekCompletionRate: Math.round(((weekLogMap.get(h.id) ?? 0) / 7) * 100),
  }));
};

export const createHabit = async (data: {
  name: string;
  icon?: string;
  color?: string;
  targetDays?: number[];
}): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.habit.create({
    data: {
      userId,
      name: data.name,
      icon: data.icon ?? "⭐",
      color: data.color ?? "#6366f1",
      targetDays: data.targetDays ?? [],
    },
  });

  revalidatePath("/dashboard/habits");
};

export const updateHabit = async (
  id: string,
  data: {
    name?: string;
    icon?: string;
    color?: string;
    targetDays?: number[];
    isActive?: boolean;
  },
): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.habit.update({
    where: { id, userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.icon !== undefined && { icon: data.icon }),
      ...(data.color !== undefined && { color: data.color }),
      ...(data.targetDays !== undefined && { targetDays: data.targetDays }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });

  revalidatePath("/dashboard/habits");
};

export const deleteHabit = async (id: string): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Soft delete — set isActive = false
  await prisma.habit.update({
    where: { id, userId },
    data: { isActive: false },
  });

  revalidatePath("/dashboard/habits");
};

export const toggleHabitLog = async (
  habitId: string,
  date: string,
): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);

  const existing = await prisma.habitLog.findUnique({
    where: { habitId_date: { habitId, date: dateObj } },
  });

  if (existing) {
    // Toggle: flip completed status or delete if unchecking
    await prisma.habitLog.delete({
      where: { habitId_date: { habitId, date: dateObj } },
    });
  } else {
    await prisma.habitLog.create({
      data: { habitId, userId, date: dateObj, completed: true },
    });
    await updateStreakAfterActivity(userId);
  }

  revalidatePath("/dashboard/habits");
};

export const getHabitLogsForMonth = async (
  year: number,
  month: number,
): Promise<{ habitId: string; date: string; completed: boolean }[]> => {
  const { userId } = await auth();
  if (!userId) return [];

  const start = new Date(year, month, 1, 0, 0, 0, 0);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const logs = await prisma.habitLog.findMany({
    where: { userId, date: { gte: start, lte: end } },
    orderBy: { date: "asc" },
  });

  return logs.map((l) => ({
    habitId: l.habitId,
    date: dateToString(l.date),
    completed: l.completed,
  }));
};

export const getStreakData = async (): Promise<StreakData> => {
  const { userId } = await auth();
  if (!userId) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      todayActive: false,
    };
  }

  const streak = await prisma.userStreak.findUnique({ where: { userId } });
  const todayStr = dateToString(new Date());

  return {
    currentStreak: streak?.currentStreak ?? 0,
    longestStreak: streak?.longestStreak ?? 0,
    lastActivityDate: streak?.lastActivityDate
      ? dateToString(streak.lastActivityDate)
      : null,
    todayActive: streak?.lastActivityDate
      ? dateToString(streak.lastActivityDate) === todayStr
      : false,
  };
};

export const confirmNoActivity = async (date: string): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);

  const habits = await prisma.habit.findMany({
    where: { userId, isActive: true },
    select: { id: true },
  });

  // Create HabitLog (completed=true) for all active habits on that date
  // upsert to avoid unique constraint violations
  for (const habit of habits) {
    await prisma.habitLog.upsert({
      where: { habitId_date: { habitId: habit.id, date: dateObj } },
      create: { habitId: habit.id, userId, date: dateObj, completed: true },
      update: { completed: true },
    });
  }

  await updateStreakAfterActivity(userId);

  revalidatePath("/dashboard/habits");
  revalidatePath("/dashboard");
};

export const getHeatmapData = async (days: number): Promise<HeatmapDay[]> => {
  const { userId } = await auth();
  if (!userId) return [];

  const allDays = getLastNDays(days);
  const start = allDays[0];
  const end = allDays[allDays.length - 1];
  end.setHours(23, 59, 59, 999);

  const logs = await prisma.habitLog.findMany({
    where: {
      userId,
      date: { gte: start, lte: end },
    },
    select: { date: true, completed: true },
  });

  // Group by date string
  const logMap = new Map<string, number>();
  for (const log of logs) {
    const key = dateToString(log.date);
    if (log.completed) {
      logMap.set(key, (logMap.get(key) ?? 0) + 1);
    }
  }

  return allDays.map((d) => {
    const key = dateToString(d);
    const count = logMap.get(key) ?? 0;
    return { date: key, count, isActive: count > 0 };
  });
};

// Internal helper — called after any activity (habit log, transaction)
const updateStreakAfterActivity = async (userId: string): Promise<void> => {
  const todayStr = dateToString(new Date());

  const streak = await prisma.userStreak.findUnique({ where: { userId } });

  if (!streak) {
    await prisma.userStreak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: new Date(),
      },
    });
    return;
  }

  const lastStr = streak.lastActivityDate
    ? dateToString(streak.lastActivityDate)
    : null;

  if (lastStr === todayStr) {
    // Already counted today
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = dateToString(yesterday);

  let newStreak: number;
  if (lastStr === yesterdayStr) {
    newStreak = streak.currentStreak + 1;
  } else {
    newStreak = 1;
  }

  const newLongest = Math.max(newStreak, streak.longestStreak);

  await prisma.userStreak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastActivityDate: new Date(),
    },
  });
};

export const updateStreak = async (): Promise<void> => {
  const { userId } = await auth();
  if (!userId) return;
  await updateStreakAfterActivity(userId);
};
