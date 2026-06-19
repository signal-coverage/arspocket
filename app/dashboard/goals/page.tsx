import type { Metadata } from "next";
import { getSavingsGoalsWithMilestones } from "@/app/actions/savings-goals-v2";
import { GoalsTimeline } from "@/components/goals-timeline/goals-timeline";
import { GanttChartSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Goals Timeline — ARSPocket" };

export const GoalsTimelinePage = async () => {
  const goals = await getSavingsGoalsWithMilestones();
  const goalsWithDeadline = goals.filter((g) => g.targetDate !== null);
  const goalsNoDeadline = goals.filter((g) => g.targetDate === null);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Goals Timeline</h1>
        <p className="text-sm text-muted-foreground">
          Visualize your savings goals on a month-level Gantt chart.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GanttChartSquare className="size-4" />
            Savings Goals Gantt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GoalsTimeline
            goalsWithDeadline={goalsWithDeadline}
            goalsNoDeadline={goalsNoDeadline}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalsTimelinePage;
