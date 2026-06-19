"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BillForm } from "@/components/bills/bill-form";

export const BillsPageClient = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" className="gap-1.5">
        <Plus className="size-4" />
        Add Bill
      </Button>
      <BillForm open={open} onOpenChange={setOpen} />
    </>
  );
};
