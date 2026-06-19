"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { createHabit } from "@/app/actions/habits";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const PRESET_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

export const HabitForm = ({ open, onOpenChange }: Props) => {
  const t = useTranslations("habits");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("⭐");
  const [color, setColor] = useState("#6366f1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("habitNameRequired"));
      return;
    }
    startTransition(async () => {
      try {
        await createHabit({ name: name.trim(), icon, color });
        setName("");
        setIcon("⭐");
        setColor("#6366f1");
        onOpenChange(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("failedHabit"));
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("newHabit")}</SheetTitle>
          <SheetDescription>{t("addHabitDescription")}</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="habit-name">{tCommon("name")}</Label>
            <Input
              id="habit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Meditate 10 minutes"
              maxLength={60}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="habit-icon">{t("habitIcon")}</Label>
            <Input
              id="habit-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="⭐"
              maxLength={4}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t("habitColor")}</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`size-7 rounded-full border-2 transition-all ${color === c ? "border-foreground scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={t("habitColorLabel", { color: c })}
                />
              ))}
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="size-7 p-0 border-0 cursor-pointer rounded-full overflow-hidden"
                title={t("customColor")}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? t("creating") : t("createHabit")}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
