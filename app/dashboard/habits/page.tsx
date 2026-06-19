import type { Metadata } from "next";
import {
  seedDefaultHabits,
  getHabitsWithTodayLogs,
  getStreakData,
} from "@/app/actions/habits";
import { HabitsTodayView } from "@/components/habits/habits-today-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = { title: "Habits — ARSPocket" };

export const HabitsPage = async () => {
  const t = await getTranslations("habits");

  // Seed default habits if user has none
  await seedDefaultHabits();

  const [habits, streak] = await Promise.all([
    getHabitsWithTodayLogs(),
    getStreakData(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("pageSubtitle")}</p>
        </div>
        <Link href="/dashboard/habits/stats">
          <Button variant="outline" size="sm" className="gap-1.5">
            <BarChart3 className="size-4" />
            {t("statsLink")}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Flame className="size-4" />
            {t("todayCheckin")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HabitsTodayView habits={habits} streak={streak} />
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitsPage;
