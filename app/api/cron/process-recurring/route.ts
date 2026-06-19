import { NextRequest, NextResponse } from "next/server";
import { processRecurringTransactions } from "@/app/actions/recurring";

export const POST = async (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET}`;

  if (!authHeader || authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await processRecurringTransactions();
  return NextResponse.json(result);
};
