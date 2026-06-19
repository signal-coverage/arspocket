"use client";

import { useOptimistic, useTransition, useState } from "react";
import { useTranslations } from "next-intl";
import { SerializedHabit, StreakData } from "@/app/actions/habits";
import { toggleHabitLog, deleteHabit } from "@/app/actions/habits";
import { dateToString } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import { Flame, Plus, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { NoActivityDialog } from "./no-activity-dialog";
import { HabitForm } from "./habit-form";

type Props = {
  habits: SerializedHabit[];
  streak: StreakData;
};

export const HabitsTodayView = ({ habits, streak }: Props) => {
  const t = useTranslations("habits");
  const [optimisticHabits, setOptimisticHabits] = useOptimistic(
    habits,
    (state, payload: { id: string; completed: boolean }) =>
      state.map((h) =>
        h.id === payload.id ? { ...h, todayCompleted: payload.completed } : h,
      ),
  );
  const [, startTransition] = useTransition();
  const [addOpen, setAddOpen] = useState(false);

  const today = dateToString(new Date());

  const handleToggle = (habit: SerializedHabit) => {
    startTransition(async () => {
      setOptimisticHabits({ id: habit.id, completed: !habit.todayCompleted });
      await toggleHabitLog(habit.id, today);
    });
  };

  const handleDelete = (habitId: string) => {
    startTransition(async () => {
      await deleteHabit(habitId);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Streak banner */}
      <div className="flex items-center gap-3 rounded-lg bg-primary/5 border border-primary/20 p-4">
        <Flame className="size-8 text-orange-500" />
        <div>
          <p className="text-2xl font-bold">{streak.currentStreak}</p>
          <p className="text-xs text-muted-foreground">{t("dayStreak")}</p>
        </div>
        {streak.longestStreak > 0 && (
          <div className="ml-auto text-right">
            <p className="text-sm font-medium">{streak.longestStreak}</p>
            <p className="text-xs text-muted-foreground">
              {t("bestStreakShort")}
            </p>
          </div>
        )}
      </div>

      {/* Actions row */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">{t("todaysHabits")}</h2>
        <div className="flex items-center gap-2">
          <NoActivityDialog />
          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            className="gap-1.5"
          >
            <Plus className="size-4" />
            {t("addHabit")}
          </Button>
        </div>
      </div>

      {/* Habits list */}
      {optimisticHabits.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-sm text-muted-foreground">
            {t("noHabitsStarted")}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {optimisticHabits.map((habit) => (
            <li
              key={habit.id}
              className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors"
            >
              <button
                onClick={() => handleToggle(habit)}
                className="shrink-0 transition-colors"
                aria-label={
                  habit.todayCompleted ? t("markIncomplete") : t("markComplete")
                }
              >
                {habit.todayCompleted ? (
                  <CheckCircle2 className="size-5 text-green-500" />
                ) : (
                  <Circle className="size-5 text-muted-foreground" />
                )}
              </button>

              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-base shrink-0">{habit.icon}</span>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${habit.todayCompleted ? "line-through text-muted-foreground" : ""}`}
                  >
                    {habit.name}
                  </p>
                  {habit.weekCompletionRate !== undefined && (
                    <p className="text-xs text-muted-foreground">
                      {t("thisWeekPct", { pct: habit.weekCompletionRate })}
                    </p>
                  )}
                </div>
              </div>

              <div
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: habit.color }}
              />

              <Button
                size="icon"
                variant="ghost"
                className="size-7 text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => handleDelete(habit.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <HabitForm open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
};
