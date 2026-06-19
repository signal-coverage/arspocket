"use client";

import { useState, useRef, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { createReceiptMetadata } from "@/app/actions/receipts";
import { Upload } from "lucide-react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ReceiptUpload = ({ open, onOpenChange }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!ALLOWED_TYPES.includes(f.type)) {
      setError("Only JPEG, PNG, WebP, and PDF files are allowed.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("File exceeds 10 MB limit.");
      return;
    }
    setError(null);
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setError(null);
    setUploading(true);

    try {
      // Step 1: Get presigned URL
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          fileSize: file.size,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to get upload URL");
      }

      const { uploadUrl, fileKey } = await res.json();

      // Step 2: Upload directly to S3
      const s3Res = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!s3Res.ok) {
        throw new Error("Upload to storage failed. Please try again.");
      }

      // Step 3: Save metadata
      startTransition(async () => {
        await createReceiptMetadata({
          fileName: file.name,
          fileKey,
          fileSize: file.size,
          mimeType: file.type,
          description: description || undefined,
        });
        setFile(null);
        setDescription("");
        if (inputRef.current) inputRef.current.value = "";
        onOpenChange(false);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Upload Receipt</SheetTitle>
          <SheetDescription>
            Upload a receipt to your vault. Max 10 MB. Accepted: JPEG, PNG, WebP, PDF.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="receipt-file">File</Label>
            <Input
              id="receipt-file"
              type="file"
              ref={inputRef}
              accept={ALLOWED_TYPES.join(",")}
              onChange={handleFileChange}
            />
          </div>

          {file && (
            <p className="text-xs text-muted-foreground">
              Selected: {file.name} ({(file.size / 1024).toFixed(0)} KB)
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="receipt-desc">Description (optional)</Label>
            <Input
              id="receipt-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Grocery receipt — March 2025"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="gap-1.5 mt-2"
          >
            <Upload className="size-4" />
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
