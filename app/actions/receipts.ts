"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const getS3Client = () =>
  new S3Client({
    region: process.env.AWS_REGION ?? "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });

export type SerializedReceipt = {
  id: string;
  userId: string;
  transactionId: string | null;
  fileName: string;
  fileKey: string;
  fileSize: number;
  mimeType: string;
  description: string | null;
  deletedAt: string | null;
  createdAt: string;
  transactionDescription?: string | null;
};

export const getReceipts = async (
  includeDeleted = false,
): Promise<SerializedReceipt[]> => {
  const { userId } = await auth();
  if (!userId) return [];

  const receipts = await prisma.receipt.findMany({
    where: {
      userId,
      ...(includeDeleted ? {} : { deletedAt: null }),
    },
    include: {
      transaction: { select: { description: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return receipts.map((r) => ({
    id: r.id,
    userId: r.userId,
    transactionId: r.transactionId,
    fileName: r.fileName,
    fileKey: r.fileKey,
    fileSize: r.fileSize,
    mimeType: r.mimeType,
    description: r.description,
    deletedAt: r.deletedAt ? r.deletedAt.toISOString() : null,
    createdAt: r.createdAt.toISOString(),
    transactionDescription: r.transaction?.description ?? null,
  }));
};

export const getReceiptsForTransaction = async (
  transactionId: string,
): Promise<SerializedReceipt[]> => {
  const { userId } = await auth();
  if (!userId) return [];

  const receipts = await prisma.receipt.findMany({
    where: { userId, transactionId, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return receipts.map((r) => ({
    id: r.id,
    userId: r.userId,
    transactionId: r.transactionId,
    fileName: r.fileName,
    fileKey: r.fileKey,
    fileSize: r.fileSize,
    mimeType: r.mimeType,
    description: r.description,
    deletedAt: null,
    createdAt: r.createdAt.toISOString(),
  }));
};

export const createReceiptMetadata = async (data: {
  fileName: string;
  fileKey: string;
  fileSize: number;
  mimeType: string;
  transactionId?: string;
  description?: string;
}): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Validate transactionId belongs to this user if provided
  if (data.transactionId) {
    const tx = await prisma.transaction.findUnique({
      where: { id: data.transactionId, userId },
      select: { id: true },
    });
    if (!tx) throw new Error("Transaction not found or unauthorized");
  }

  await prisma.receipt.create({
    data: {
      userId,
      fileName: data.fileName,
      fileKey: data.fileKey,
      fileSize: data.fileSize,
      mimeType: data.mimeType,
      transactionId: data.transactionId ?? null,
      description: data.description ?? null,
    },
  });

  revalidatePath("/dashboard/receipts");
};

export const deleteReceipt = async (id: string): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.receipt.update({
    where: { id, userId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/dashboard/receipts");
};

export const permanentlyDeleteReceipt = async (id: string): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const receipt = await prisma.receipt.findUnique({
    where: { id, userId },
    select: { fileKey: true },
  });
  if (!receipt) throw new Error("Receipt not found");

  // Attempt S3 deletion
  try {
    const s3 = getS3Client();
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME ?? "",
        Key: receipt.fileKey,
      }),
    );
  } catch (err) {
    // Log S3 error but do NOT delete DB record — leave orphaned in trash
    console.error("S3 deletion failed for key:", receipt.fileKey, err);
    throw new Error(
      "Failed to delete file from storage. Receipt remains in trash.",
    );
  }

  await prisma.receipt.delete({ where: { id, userId } });

  revalidatePath("/dashboard/receipts");
};

export const linkReceiptToTransaction = async (
  receiptId: string,
  transactionId: string,
): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Validate transaction belongs to user
  const tx = await prisma.transaction.findUnique({
    where: { id: transactionId, userId },
    select: { id: true },
  });
  if (!tx) throw new Error("Transaction not found or unauthorized");

  await prisma.receipt.update({
    where: { id: receiptId, userId },
    data: { transactionId },
  });

  revalidatePath("/dashboard/receipts");
};

export const unlinkReceiptFromTransaction = async (
  receiptId: string,
): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.receipt.update({
    where: { id: receiptId, userId },
    data: { transactionId: null },
  });

  revalidatePath("/dashboard/receipts");
};
