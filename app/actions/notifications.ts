"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

export const getNotifications = async (limit = 50) => {
  const { userId } = await auth();
  if (!userId) return [];

  const since = new Date(Date.now() - NINETY_DAYS_MS);

  return prisma.notification.findMany({
    where: {
      userId,
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
};

export const getUnreadCount = async () => {
  const { userId } = await auth();
  if (!userId) return 0;

  return prisma.notification.count({
    where: { userId, isRead: false },
  });
};

export const markRead = async (id: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.notification.update({
    where: { id, userId },
    data: { isRead: true },
  });

  revalidatePath("/dashboard");
};

export const markAllRead = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  revalidatePath("/dashboard");
};
