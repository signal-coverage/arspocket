import type { Metadata } from "next";
import { getSavingsGoalsWithMilestones } from "@/app/actions/savings-goals-v2";
import { getGoals } from "@/app/actions/goals";
import { GoalsTimeline } from "@/components/goals-timeline/goals-timeline";
import { GoalContributePanel } from "@/components/goals/goal-contribute-panel";
import { GanttChartSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = { title: "Goals Timeline — ARSPocket" };

export const GoalsTimelinePage = async () => {
  const t = await getTranslations("goals");
  const [goals, savingsGoals] = await Promise.all([
    getGoals(),
    getSavingsGoalsWithMilestones(),
  ]);
  const goalsWithDeadline = savingsGoals.filter((g) => g.targetDate !== null);
  const goalsNoDeadline = savingsGoals.filter((g) => g.targetDate === null);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("pageSubtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <GanttChartSquare className="size-4" />
            {t("ganttTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GoalsTimeline
            goalsWithDeadline={goalsWithDeadline}
            goalsNoDeadline={goalsNoDeadline}
          />
        </CardContent>
      </Card>

      {goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Savings Goals — Auto-Contribute</CardTitle>
          </CardHeader>
          <CardContent>
            <GoalContributePanel goals={goals} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoalsTimelinePage;
