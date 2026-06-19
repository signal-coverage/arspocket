import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import { prisma } from "@/lib/db";
import { importRowSchema } from "@/lib/validations/import";
import { TransactionType } from "@prisma/client";

const MAX_ROWS = 500;

export const POST = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const columnMapRaw = formData.get("columnMap") as string | null;

  if (!file || !columnMapRaw) {
    return NextResponse.json(
      { error: "file and columnMap are required" },
      { status: 400 }
    );
  }

  const text = await file.text();
  const { data: rows } = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (rows.length > MAX_ROWS) {
    return NextResponse.json(
      { error: "max_rows_exceeded", limit: MAX_ROWS, found: rows.length },
      { status: 400 }
    );
  }

  const columnMap = JSON.parse(columnMapRaw) as Record<string, string>;

  type RowError = { row: number; error: string };
  const errors: RowError[] = [];
  const validRows: Array<{
    userId: string;
    type: TransactionType;
    amount: number;
    description: string;
    category: string;
    date: Date;
  }> = [];

  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i];
    const mapped = {
      type: raw[columnMap.type] ?? "",
      amount: raw[columnMap.amount] ?? "",
      currency: raw[columnMap.currency] ?? "ARS",
      date: raw[columnMap.date] ?? "",
      description: columnMap.description ? (raw[columnMap.description] ?? "") : "",
      category: columnMap.category ? (raw[columnMap.category] ?? "Other") : "Other",
    };

    const parsed = importRowSchema.safeParse(mapped);
    if (!parsed.success) {
      errors.push({ row: i + 1, error: parsed.error.issues[0].message });
      continue;
    }

    validRows.push({
      userId,
      type:
        parsed.data.type === "INCOME"
          ? TransactionType.INCOME
          : TransactionType.OUTCOME,
      amount: parsed.data.amount,
      description: parsed.data.description,
      category: parsed.data.category,
      date: new Date(parsed.data.date),
    });
  }

  const result = await prisma.transaction.createMany({
    data: validRows,
  });

  return NextResponse.json({
    imported: result.count,
    skipped: errors.length,
    errors,
  });
};
