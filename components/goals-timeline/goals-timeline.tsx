"use client";

import { useState } from "react";
import { SerializedSavingsGoalWithMilestones } from "@/app/actions/savings-goals-v2";
import { GoalsGanttBar } from "./goals-gantt-bar";
import { GoalDetailSheet } from "./goal-detail-sheet";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import Link from "next/link";

type Props = {
  goalsWithDeadline: SerializedSavingsGoalWithMilestones[];
  goalsNoDeadline: SerializedSavingsGoalWithMilestones[];
};

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const GoalsTimeline = ({ goalsWithDeadline, goalsNoDeadline }: Props) => {
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [selectedGoal, setSelectedGoal] = useState<SerializedSavingsGoalWithMilestones | null>(null);

  const today = new Date();
  const months = MONTH_NAMES.map((name, i) => ({ name, monthIndex: i, year: viewYear }));

  // Helper: get month index (0-11) relative to viewYear start
  const getColIndex = (dateStr: string, clampToYear = false): number => {
    const d = new Date(dateStr);
    const diffYear = d.getFullYear() - viewYear;
    const col = diffYear * 12 + d.getMonth();
    if (clampToYear) return Math.max(0, Math.min(11, col));
    return col;
  };

  const isInView = (goal: SerializedSavingsGoalWithMilestones): boolean => {
    const startCol = getColIndex(goal.createdAt);
    const endCol = goal.targetDate ? getColIndex(goal.targetDate) : 11;
    return endCol >= 0 && startCol <= 11;
  };

  const visibleGoals = goalsWithDeadline.filter(isInView);

  return (
    <div className="flex flex-col gap-6">
      {/* Year navigation */}
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          className="size-8"
          onClick={() => setViewYear((y) => y - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-sm font-medium w-12 text-center">{viewYear}</span>
        <Button
          size="icon"
          variant="outline"
          className="size-8"
          onClick={() => setViewYear((y) => y + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {goalsWithDeadline.length === 0 && goalsNoDeadline.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-sm text-muted-foreground">No savings goals yet.</p>
          <Link href="/dashboard/savings" className="text-sm text-primary underline mt-1 inline-block">
            Create your first goal on the Savings page
          </Link>
        </div>
      )}

      {/* Gantt chart */}
      {visibleGoals.length > 0 && (
        <div className="rounded-lg border overflow-x-auto">
          {/* Header row */}
          <div className="grid border-b" style={{ gridTemplateColumns: `160px repeat(12, 1fr)` }}>
            <div className="border-r p-2 text-xs font-medium text-muted-foreground">Goal</div>
            {months.map((m) => {
              const isCurrent =
                m.year === today.getFullYear() && m.monthIndex === today.getMonth();
              return (
                <div
                  key={m.name}
                  className={`p-2 text-xs text-center font-medium ${isCurrent ? "bg-primary/5 text-primary" : "text-muted-foreground"}`}
                >
                  {m.name}
                </div>
              );
            })}
          </div>

          {/* Goal rows */}
          {visibleGoals.map((goal) => {
            const startCol = Math.max(0, getColIndex(goal.createdAt));
            const endCol = Math.min(11, goal.targetDate ? getColIndex(goal.targetDate) : 11);
            const isPast = goal.targetDate
              ? new Date(goal.targetDate) < today
              : false;

            return (
              <div
                key={goal.id}
                className="grid border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                style={{ gridTemplateColumns: `160px repeat(12, 1fr)`, height: "48px" }}
              >
                <div className="border-r px-3 flex items-center">
                  <span className="text-xs font-medium truncate">{goal.goalName}</span>
                </div>
                <div
                  className="col-span-12 relative"
                  onClick={() => setSelectedGoal(goal)}
                >
                  <GoalsGanttBar
                    name={goal.goalName}
                    startCol={startCol}
                    endCol={endCol}
                    totalCols={12}
                    pct={goal.pct}
                    color={goal.color}
                    isPast={isPast}
                    onClick={() => setSelectedGoal(goal)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No Deadline section */}
      {goalsNoDeadline.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
            No Deadline
          </h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {goalsNoDeadline.map((goal) => (
              <div
                key={goal.id}
                className="rounded-lg border p-4 flex flex-col gap-2"
              >
                <span className="text-sm font-medium">{goal.goalName}</span>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(goal.currentAmount)}</span>
                  <span>/ {formatCurrency(goal.targetAmount)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${goal.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail sheet */}
      {selectedGoal && (
        <GoalDetailSheet
          goal={selectedGoal}
          open={!!selectedGoal}
          onOpenChange={(open) => !open && setSelectedGoal(null)}
        />
      )}
    </div>
  );
};
