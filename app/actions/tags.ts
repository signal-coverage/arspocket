"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { tagSchema } from "@/lib/validations/tag";

export const getTags = async () => {
  const { userId } = await auth();
  if (!userId) return [];

  return prisma.tag.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
};

export const createTag = async (formData: FormData) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const raw = {
    name: formData.get("name") as string,
    color: (formData.get("color") as string) || undefined,
  };

  const parsed = tagSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Case-insensitive duplicate check
  const existing = await prisma.tag.findFirst({
    where: {
      userId,
      name: { equals: parsed.data.name, mode: "insensitive" },
    },
  });
  if (existing) return { error: "Tag already exists" };

  const tag = await prisma.tag.create({
    data: {
      userId,
      name: parsed.data.name,
      color: parsed.data.color || null,
    },
  });

  revalidatePath("/dashboard");
  return { tag };
};

export const deleteTag = async (id: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.tag.delete({ where: { id, userId } });
  revalidatePath("/dashboard");
};
