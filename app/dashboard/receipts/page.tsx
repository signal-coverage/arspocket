import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getReceipts } from "@/app/actions/receipts";
import { ReceiptsGrid } from "@/components/receipts/receipts-grid";
import { Receipt } from "lucide-react";

export const metadata: Metadata = { title: "Receipts — ARSPocket" };

export const ReceiptsPage = async () => {
  const t = await getTranslations("receipts");
  const receipts = await getReceipts(false);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Receipt className="size-5" />
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <ReceiptsGrid receipts={receipts} />
    </div>
  );
};

export default ReceiptsPage;
