import type { Metadata } from "next";
import { getStreakData, getHeatmapData } from "@/app/actions/habits";
import { ContributionHeatmap } from "@/components/habits/contribution-heatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, TrendingUp, CalendarDays } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = { title: "Habit Stats — ARSPocket" };

export const HabitStatsPage = async () => {
  const t = await getTranslations("habits");

  const [streak, heatmap] = await Promise.all([
    getStreakData(),
    getHeatmapData(365),
  ]);

  const totalDaysActive = heatmap.filter((d) => d.isActive).length;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/habits">
          <Button variant="ghost" size="icon" className="size-8">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold">{t("stats")}</h1>
          <p className="text-sm text-muted-foreground">{t("statsSubtitle")}</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-muted-foreground font-normal flex items-center gap-1">
              <Flame className="size-3.5 text-orange-500" />
              {t("currentStreak")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{streak.currentStreak}</p>
            <p className="text-xs text-muted-foreground">{t("days")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-muted-foreground font-normal flex items-center gap-1">
              <TrendingUp className="size-3.5 text-primary" />
              {t("bestStreakLabel")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{streak.longestStreak}</p>
            <p className="text-xs text-muted-foreground">{t("days")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs text-muted-foreground font-normal flex items-center gap-1">
              <CalendarDays className="size-3.5 text-green-500" />
              {t("totalActiveDays")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalDaysActive}</p>
            <p className="text-xs text-muted-foreground">{t("lastYear")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("activityHeatmap")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ContributionHeatmap data={heatmap} />
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitStatsPage;
