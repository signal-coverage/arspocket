import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { detectAnomalies } from "@/lib/utils/anomaly";
import { TransactionType } from "@prisma/client";

export const GET = async () => {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const now = new Date();
  const ninetyDaysAgo = new Date(now);
  ninetyDaysAgo.setDate(now.getDate() - 90);

  const currentMonth = await prisma.transaction.findMany({
    where: {
      userId,
      type: TransactionType.OUTCOME,
      date: {
        gte: new Date(now.getFullYear(), now.getMonth(), 1),
        lte: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
      },
    },
    select: { id: true, amount: true, category: true },
  });

  const historical = await prisma.transaction.findMany({
    where: {
      userId,
      type: TransactionType.OUTCOME,
      date: { gte: ninetyDaysAgo, lte: now },
    },
    select: { id: true, amount: true, category: true },
  });

  const results = detectAnomalies(currentMonth, historical);
  const anomalies = results.filter((r) => r.isAnomaly);

  return NextResponse.json({ anomalies, total: currentMonth.length });
};
