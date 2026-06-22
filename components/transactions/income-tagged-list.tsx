"use client";

import { format } from "date-fns";
import { Inbox, MoveUpRight, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { deleteTransaction } from "@/app/actions/transactions";
import type { getTransactions } from "@/app/actions/transactions";
import { formatCurrency } from "@/lib/format";
import { TagFilter } from "@/components/tags/tag-filter";
import { AnomalyBadge } from "@/components/transactions/anomaly-badge";
import { Badge, Button } from "@/components/ui";

type Transaction = Awaited<ReturnType<typeof getTransactions>>[number];

interface Tag {
  id: string;
  name: string;
  color: string | null;
}

interface IncomeTaggedListProps {
  tags: Tag[];
  transactions: Transaction[];
  hasActiveFilters: boolean;
}

export const IncomeTaggedList = ({
  tags,
  transactions,
  hasActiveFilters,
}: IncomeTaggedListProps) => {
  const t = useTranslations("income");
  const tCommon = useTranslations("common");

  return (
    <TagFilter tags={tags} transactions={transactions}>
      {(tagFiltered) =>
        tagFiltered.length === 0 && hasActiveFilters ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <p className="text-sm text-muted-foreground">{tCommon("noResults")}</p>
          </div>
        ) : tagFiltered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <Inbox className="size-10 text-muted-foreground/50" />
            <div>
              <p className="text-sm font-medium">{t("noIncomePeriod")}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("incomeEntriesAppear")}
              </p>
            </div>
          </div>
        ) : (
          <ul className="divide-y">
            {tagFiltered.map((tx) => (
              <li key={tx.id} className="flex items-center gap-3 py-3">
                <div className="flex items-center justify-center rounded-md bg-green-50 dark:bg-green-950 p-1.5 shrink-0">
                  <MoveUpRight className="size-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tx.description}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {tx.category}
                    </Badge>
                    <AnomalyBadge isAnomaly={tx.isAnomaly} />
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(tx.date), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(Number(tx.amount))}
                  </span>
                  <form action={deleteTransaction.bind(null, tx.id)}>
                    <Button
                      type="submit"
                      size="icon"
                      variant="ghost"
                      className="size-7 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )
      }
    </TagFilter>
  );
};
