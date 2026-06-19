"use client";

import { useState } from "react";
import { differenceInDays } from "date-fns";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteGoal, addGoalContribution } from "@/app/actions/goals";

type Goal = {
  id: string;
  name: string;
  targetAmount: unknown;
  currentAmount: unknown;
  currency: string;
  deadline?: Date | null;
  description?: string | null;
  isCompleted: boolean;
  percentage: number;
};

const fmt = (n: number, currency = "ARS") => {
  try {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
};

export const GoalCard = ({ goal }: { goal: Goal }) => {
  const t = useTranslations("goals");
  const tCommon = useTranslations("common");
  const [contributeOpen, setContributeOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const current = Number(goal.currentAmount);
  const target = Number(goal.targetAmount);
  const daysLeft = goal.deadline
    ? differenceInDays(new Date(goal.deadline), new Date())
    : null;

  const handleContribute = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    await addGoalContribution(goal.id, fd);
    setPending(false);
    setContributeOpen(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Delete goal "${goal.name}"?`)) return;
    await deleteGoal(goal.id);
  };

  return (
    <Card className={goal.isCompleted ? "border-emerald-500" : ""}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{goal.name}</CardTitle>
          <div className="flex gap-1">
            {goal.isCompleted && (
              <Badge
                variant="default"
                className="bg-emerald-500 text-white text-xs"
              >
                {t("completed")}
              </Badge>
            )}
          </div>
        </div>
        {goal.description && (
          <p className="text-xs text-muted-foreground">{goal.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">{fmt(current, goal.currency)}</span>
            <span className="text-muted-foreground">
              {fmt(target, goal.currency)}
            </span>
          </div>
          <Progress value={goal.percentage} className="h-2" />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">
              {goal.percentage.toFixed(0)}
              {t("savedPct")}
            </span>
            {daysLeft !== null && (
              <span
                className={`text-xs ${daysLeft < 0 ? "text-destructive" : "text-muted-foreground"}`}
              >
                {daysLeft < 0
                  ? t("daysOverdue", { days: Math.abs(daysLeft) })
                  : t("daysLeft", { days: daysLeft })}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog open={contributeOpen} onOpenChange={setContributeOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                disabled={goal.isCompleted}
              >
                {t("addFunds")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {t("addContributionTitle", { name: goal.name })}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleContribute} className="space-y-4">
                <div>
                  <Label htmlFor="c-amount">
                    {t("amountCurrency", { currency: goal.currency })}
                  </Label>
                  <Input
                    id="c-amount"
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="5000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="c-date">{tCommon("date")}</Label>
                  <Input
                    id="c-date"
                    name="date"
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="c-note">{t("noteOptional")}</Label>
                  <Input
                    id="c-note"
                    name="note"
                    placeholder="Monthly savings"
                  />
                </div>
                <Button type="submit" disabled={pending} className="w-full">
                  {pending ? t("adding") : t("addContributionBtn")}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={handleDelete}
          >
            {tCommon("delete")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
