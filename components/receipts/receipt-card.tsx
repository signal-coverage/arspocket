"use client";

import { useTransition } from "react";
import { SerializedReceipt } from "@/app/actions/receipts";
import { deleteReceipt } from "@/app/actions/receipts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Image, Trash2, ExternalLink } from "lucide-react";
import { formatDateDisplay } from "@/lib/dates";

type Props = {
  receipt: SerializedReceipt;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const ReceiptCard = ({ receipt }: Props) => {
  const [isPending, startTransition] = useTransition();

  const isImage = receipt.mimeType.startsWith("image/");

  const handleView = async () => {
    try {
      const res = await fetch(`/api/upload?fileKey=${encodeURIComponent(receipt.fileKey)}`);
      const data = await res.json();
      if (data.viewUrl) {
        window.open(data.viewUrl, "_blank");
      }
    } catch {
      alert("Failed to generate view URL.");
    }
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteReceipt(receipt.id);
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      {/* Icon + name */}
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-md bg-muted flex items-center justify-center shrink-0">
          {isImage ? (
            <Image className="size-5 text-muted-foreground" />
          ) : (
            <FileText className="size-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{receipt.fileName}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-muted-foreground">
              {formatFileSize(receipt.fileSize)}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">
              {formatDateDisplay(receipt.createdAt, "MMM d, yyyy")}
            </span>
          </div>
        </div>
      </div>

      {/* Linked transaction */}
      {receipt.transactionDescription && (
        <div className="text-xs text-muted-foreground">
          Linked to:{" "}
          <span className="font-medium">{receipt.transactionDescription}</span>
        </div>
      )}

      {/* Description */}
      {receipt.description && (
        <p className="text-xs text-muted-foreground">{receipt.description}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 border-t pt-2 mt-1">
        <Button
          size="sm"
          variant="ghost"
          className="gap-1 text-xs h-7"
          onClick={handleView}
        >
          <ExternalLink className="size-3" />
          View
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-7 text-muted-foreground hover:text-destructive ml-auto"
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
};
