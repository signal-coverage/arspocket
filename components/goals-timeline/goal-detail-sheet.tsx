"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { SerializedSavingsGoalWithMilestones } from "@/app/actions/savings-goals-v2";
import {
  toggleMilestoneComplete,
  deleteMilestone,
} from "@/app/actions/savings-goals-v2";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { formatCurrency, formatPercent } from "@/lib/format";
import { formatDateDisplay } from "@/lib/dates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import { MilestoneForm } from "./milestone-form";

type Props = {
  goal: SerializedSavingsGoalWithMilestones;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const GoalDetailSheet = ({ goal, open, onOpenChange }: Props) => {
  const t = useTranslations("goals");
  const today = new Date();
  const targetDate = goal.targetDate ? new Date(goal.targetDate) : null;
  const daysRemaining = targetDate
    ? Math.ceil(
        (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      )
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{goal.goalName}</SheetTitle>
          {goal.description && (
            <SheetDescription>{goal.description}</SheetDescription>
          )}
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-5">
          {/* Progress */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("progress")}</span>
              <span className="font-semibold">{formatPercent(goal.pct)}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${goal.pct}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(goal.currentAmount)}</span>
              <span>{formatCurrency(goal.targetAmount)}</span>
            </div>
          </div>

          {/* Target date + days remaining */}
          {targetDate && (
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  {t("targetDate")}
                </span>
                <span className="text-sm font-medium">
                  {formatDateDisplay(targetDate, "MMMM d, yyyy")}
                </span>
              </div>
              {daysRemaining !== null && (
                <Badge
                  variant={daysRemaining < 0 ? "destructive" : "secondary"}
                >
                  {daysRemaining < 0
                    ? t("overdueBy", { days: Math.abs(daysRemaining) })
                    : t("daysLeftLabel", { days: daysRemaining })}
                </Badge>
              )}
            </div>
          )}

          {/* Milestones */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-medium">{t("milestones")}</h4>
            {goal.milestones.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                {t("noMilestones")}
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {goal.milestones.map((m) => (
                  <MilestoneItem key={m.id} milestone={m} />
                ))}
              </ul>
            )}
          </div>

          {/* Add milestone form */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">{t("addMilestone")}</h4>
            <MilestoneForm goalId={goal.id} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

type MilestoneItemProps = {
  milestone: SerializedSavingsGoalWithMilestones["milestones"][0];
};

const MilestoneItem = ({ milestone }: MilestoneItemProps) => {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleMilestoneComplete(milestone.id);
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteMilestone(milestone.id);
    });
  };

  return (
    <li className="flex items-center gap-2 py-1">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
      >
        {milestone.isCompleted ? (
          <CheckCircle2 className="size-4 text-green-500" />
        ) : (
          <Circle className="size-4" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm ${milestone.isCompleted ? "line-through text-muted-foreground" : ""}`}
        >
          {milestone.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDateDisplay(milestone.targetDate, "MMM d, yyyy")}
        </p>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="size-6 text-muted-foreground hover:text-destructive"
        onClick={handleDelete}
        disabled={isPending}
      >
        <Trash2 className="size-3" />
      </Button>
    </li>
  );
};
