"use client";

import { useState } from "react";
import { SerializedReceipt } from "@/app/actions/receipts";
import { ReceiptCard } from "./receipt-card";
import { ReceiptUpload } from "./receipt-upload";
import { Button } from "@/components/ui/button";
import { Plus, Receipt } from "lucide-react";

type Props = {
  receipts: SerializedReceipt[];
};

export const ReceiptsGrid = ({ receipts }: Props) => {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setUploadOpen(true)} size="sm" className="gap-1.5">
          <Plus className="size-4" />
          Upload Receipt
        </Button>
      </div>

      {receipts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-lg border border-dashed">
          <Receipt className="size-10 text-muted-foreground/40" />
          <div className="text-center">
            <p className="text-sm font-medium">No receipts yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Upload your first receipt to start organizing.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {receipts.map((r) => (
            <ReceiptCard key={r.id} receipt={r} />
          ))}
        </div>
      )}

      <ReceiptUpload open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
};
