import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const getS3Client = () =>
  new S3Client({
    region: process.env.AWS_REGION ?? "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });

// POST /api/upload — Generate a presigned PUT URL for S3 upload
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { fileName?: string; mimeType?: string; fileSize?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { fileName, mimeType, fileSize } = body;

  if (!fileName || typeof fileName !== "string" || fileName.trim() === "") {
    return NextResponse.json(
      { error: "fileName is required" },
      { status: 400 },
    );
  }

  if (!mimeType || !ALLOWED_MIME_TYPES.includes(mimeType)) {
    return NextResponse.json(
      { error: `mimeType must be one of: ${ALLOWED_MIME_TYPES.join(", ")}` },
      { status: 400 },
    );
  }

  if (fileSize !== undefined && fileSize > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File exceeds 10 MB limit" },
      { status: 400 },
    );
  }

  // Sanitize fileName: remove path traversal, keep only safe characters
  const sanitized = fileName
    .split("/")
    .pop()!
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .substring(0, 200);

  const fileKey = `receipts/${userId}/${Date.now()}-${sanitized}`;

  const s3 = getS3Client();
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME ?? "",
    Key: fileKey,
    ContentType: mimeType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  return NextResponse.json({ uploadUrl, fileKey });
};

// GET /api/upload?fileKey=... — Generate a presigned GET URL to view a receipt
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fileKey = searchParams.get("fileKey");

  if (!fileKey) {
    return NextResponse.json({ error: "fileKey is required" }, { status: 400 });
  }

  // Security: verify the fileKey starts with the user's prefix
  if (!fileKey.startsWith(`receipts/${userId}/`)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const s3 = getS3Client();
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME ?? "",
    Key: fileKey,
  });

  const viewUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  return NextResponse.json({ viewUrl });
};
