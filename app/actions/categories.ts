"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export const getCategories = async (type?: string) => {
  const { userId } = await auth();
  if (!userId) return [];

  return prisma.category.findMany({
    where: {
      userId,
      ...(type ? { type: { in: [type, "both"] } } : {}),
    },
    orderBy: { createdAt: "asc" },
  });
};

export const createCategory = async (data: {
  name: string;
  type: string;
  color?: string;
}) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const count = await prisma.category.count({ where: { userId } });
  if (count >= 50) {
    throw new Error("Maximum of 50 custom categories per user reached");
  }

  await prisma.category.create({
    data: {
      userId,
      name: data.name,
      type: data.type,
      color: data.color ?? null,
    },
  });

  revalidatePath("/dashboard/categories");
};

export const deleteCategory = async (id: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.category.delete({
    where: { id, userId },
  });

  revalidatePath("/dashboard/categories");
};
