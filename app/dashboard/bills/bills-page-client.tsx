"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BillForm } from "@/components/bills/bill-form";
import { useTranslations } from "next-intl";

export const BillsPageClient = () => {
  const t = useTranslations("bills");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" className="gap-1.5">
        <Plus className="size-4" />
        {t("addBill")}
      </Button>
      <BillForm open={open} onOpenChange={setOpen} />
    </>
  );
};
