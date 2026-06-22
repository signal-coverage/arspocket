"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AutoContributeSection } from "./auto-contribute-section";
import { Progress } from "@/components/ui/progress";

type LinkedTransaction = {
  id: string;
  description: string;
  amount: number;
  recurringFrequency: string | null;
};

type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  isCompleted: boolean;
  percentage: number;
  linkedTransactions: LinkedTransaction[];
};

type Props = {
  goals: Goal[];
};

const fmtFull = (n: number, currency = "ARS") => {
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

export const GoalContributePanel = ({ goals }: Props) => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  return (
    <>
      <ul className="divide-y">
        {goals.map((goal) => (
          <li key={goal.id} className="py-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{goal.name}</p>
                <p className="text-xs text-muted-foreground">
                  {fmtFull(goal.currentAmount, goal.currency)} /{" "}
                  {fmtFull(goal.targetAmount, goal.currency)}
                  {goal.linkedTransactions.length > 0 && (
                    <span className="ml-2 text-primary">
                      · {goal.linkedTransactions.length} recurring linked
                    </span>
                  )}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0"
                onClick={() => setSelectedGoal(goal)}
              >
                Auto-Contribute
              </Button>
            </div>
            <Progress value={goal.percentage} className="h-1.5" />
          </li>
        ))}
      </ul>

      <Sheet open={!!selectedGoal} onOpenChange={(open) => !open && setSelectedGoal(null)}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedGoal?.name}</SheetTitle>
          </SheetHeader>
          {selectedGoal && (
            <div className="mt-6">
              <AutoContributeSection
                goalId={selectedGoal.id}
                linkedTransactions={selectedGoal.linkedTransactions}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
