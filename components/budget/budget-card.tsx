"use client";

import { BudgetWithSpend } from "@/app/actions/budgets";
import { formatCurrency, formatPercent } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { deleteBudget } from "@/app/actions/budgets";
import { useTransition } from "react";

const STATE_BAR_COLORS = {
  SAFE: "bg-green-500",
  WARNING: "bg-amber-500",
  DANGER: "bg-red-500",
};

const PERIOD_LABELS: Record<string, string> = {
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

type Props = {
  budget: BudgetWithSpend;
  onEdit?: (budget: BudgetWithSpend) => void;
};

export const BudgetCard = ({ budget, onEdit }: Props) => {
  const [isPending, startTransition] = useTransition();
  const isOverspent = budget.spent > budget.amount;

  const handleDelete = () => {
    startTransition(async () => {
      await deleteBudget(budget.id);
    });
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{budget.category}</span>
            <Badge variant="secondary" className="text-xs">
              {PERIOD_LABELS[budget.period] ?? budget.period}
            </Badge>
            {isOverspent && (
              <Badge variant="destructive" className="text-xs">
                Overspent
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {formatCurrency(budget.spent)} of {formatCurrency(budget.amount)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
            <Button
              size="icon"
              variant="ghost"
              className="size-7"
              onClick={() => onEdit(budget)}
            >
              <Pencil className="size-3.5" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="size-7 text-muted-foreground hover:text-destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${STATE_BAR_COLORS[budget.state]}`}
            style={{ width: `${budget.pct}%` }}
          />
        </div>
        <span className="text-xs font-medium tabular-nums w-10 text-right">
          {formatPercent(budget.pct)}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Remaining: {formatCurrency(budget.remaining)}</span>
        {isOverspent && (
          <span className="text-destructive font-medium">
            Over by {formatCurrency(budget.spent - budget.amount)}
          </span>
        )}
      </div>
    </div>
  );
};
