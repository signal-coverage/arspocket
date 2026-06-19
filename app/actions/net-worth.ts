"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export const getNetWorthSnapshots = async () => {
  const { userId } = await auth();
  if (!userId) return [];

  const snapshots = await prisma.netWorthSnapshot.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { date: "asc" },
  });

  return snapshots.map((s) => {
    const totalAssets = s.items
      .filter((i) => i.type === "ASSET")
      .reduce((acc, i) => acc + Number(i.amount), 0);
    const totalLiabilities = s.items
      .filter((i) => i.type === "LIABILITY")
      .reduce((acc, i) => acc + Number(i.amount), 0);
    return {
      ...s,
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets - totalLiabilities,
    };
  });
};

export const createSnapshot = async (formData: FormData) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const date = formData.get("date") as string;
  const note = (formData.get("note") as string) || null;

  // Parse items from formData (multiple items as JSON)
  const itemsRaw = formData.get("items") as string;
  const items = JSON.parse(itemsRaw) as Array<{
    name: string;
    type: "ASSET" | "LIABILITY";
    amount: number;
    currency: string;
  }>;

  if (!items.length) return { error: "At least one item is required" };

  await prisma.netWorthSnapshot.create({
    data: {
      userId,
      date: new Date(date),
      note,
      items: {
        create: items.map((item) => ({
          name: item.name,
          type: item.type as never,
          amount: item.amount,
          currency: item.currency || "ARS",
        })),
      },
    },
  });

  revalidatePath("/dashboard/net-worth");
};

export const deleteSnapshot = async (id: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.netWorthSnapshot.delete({ where: { id, userId } });
  revalidatePath("/dashboard/net-worth");
};
