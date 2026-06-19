import type { Metadata } from "next";
import { format } from "date-fns";
import { Target, Trash2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { deleteSavingsGoal, getSavingsGoals } from "@/app/actions/savings";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
} from "@/components/ui";
import { SavingsFormWrapper } from "./savings-form-wrapper";
import { ContributeDialog } from "./contribute-dialog";

export const metadata: Metadata = { title: "Savings Goals — ARSPocket" };

export const SavingsPage = async () => {
  const t = await getTranslations("savings");
  const tCommon = await getTranslations("common");

  const goals = await getSavingsGoals();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t("addGoal")}</CardTitle>
            <CardDescription>{t("addGoalDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <SavingsFormWrapper />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base">{t("myGoals")}</CardTitle>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                <Target className="size-10 text-muted-foreground/50" />
                <div>
                  <p className="text-sm font-medium">{t("noGoals")}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("noGoalsDescription")}
                  </p>
                </div>
              </div>
            ) : (
              <ul className="divide-y">
                {goals.map((g) => {
                  const current = Number(g.currentAmount);
                  const target = Number(g.targetAmount);
                  const progress =
                    target > 0 ? Math.min((current / target) * 100, 100) : 0;
                  return (
                    <li key={g.id} className="py-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-semibold">{g.goalName}</p>
                        <div className="flex items-center gap-1.5">
                          <ContributeDialog
                            goalId={g.id}
                            goalName={g.goalName}
                            remaining={target - current}
                          />
                          <form
                            action={async () => {
                              "use server";
                              await deleteSavingsGoal(g.id);
                            }}
                          >
                            <Button
                              type="submit"
                              size="icon"
                              variant="ghost"
                              className="size-7 text-muted-foreground hover:text-destructive shrink-0"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </form>
                        </div>
                      </div>
                      <Progress value={progress} className="h-2 mb-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          $
                          {current.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          / $
                          {target.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                        <span>
                          {tCommon("total")}:{" "}
                          {g.targetDate
                            ? format(new Date(g.targetDate), "MMM d, yyyy")
                            : t("noDeadline")}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SavingsPage;
