import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { TransactionType } from "@prisma/client";

export const GET = async (request: Request) => {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as "income" | "outcome" | null;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const anomaly = searchParams.get("anomaly");

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      ...(type
        ? {
            type:
              type === "income"
                ? TransactionType.INCOME
                : TransactionType.OUTCOME,
          }
        : {}),
      ...(from || to
        ? {
            date: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
      ...(category ? { category } : {}),
      ...(search
        ? { description: { contains: search, mode: "insensitive" } }
        : {}),
      ...(anomaly === "true" ? { isAnomaly: true } : {}),
    },
    include: {
      tags: {
        include: { tag: true },
      },
    },
    orderBy: { date: "desc" },
  });

  const header = "date,type,amount,description,category,isRecurring,isAnomaly,tags";
  const rows = transactions.map((t) => {
    const date = t.date.toISOString().split("T")[0];
    const txType = t.type === TransactionType.INCOME ? "income" : "outcome";
    const amount = Number(t.amount).toFixed(2);
    const description = `"${t.description.replace(/"/g, '""')}"`;
    const cat = `"${t.category.replace(/"/g, '""')}"`;
    const isRecurring = t.isRecurring ? "true" : "false";
    const isAnomaly = t.isAnomaly ? "true" : "false";
    const tags = t.tags.map((tt) => tt.tag.name).join("|");
    return `${date},${txType},${amount},${description},${cat},${isRecurring},${isAnomaly},${tags}`;
  });

  const csv = [header, ...rows].join("\n");
  const today = new Date().toISOString().split("T")[0];
  const filename = `transactions-${type ?? "all"}-${today}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
};
