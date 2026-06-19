"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMilestone } from "@/app/actions/savings-goals-v2";

type Props = {
  goalId: string;
  onDone?: () => void;
};

export const MilestoneForm = ({ goalId, onDone }: Props) => {
  const t = useTranslations("goals");
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetDate) {
      setError(t("milestoneRequired"));
      return;
    }
    startTransition(async () => {
      try {
        await createMilestone({ goalId, title, targetDate });
        setTitle("");
        setTargetDate("");
        onDone?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : t("failedMilestone"));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="milestone-title">{t("milestoneTitle")}</Label>
        <Input
          id="milestone-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="First $10k saved"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="milestone-date">{t("milestoneDate")}</Label>
        <Input
          id="milestone-date"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? t("adding") : t("addMilestone")}
      </Button>
    </form>
  );
};
