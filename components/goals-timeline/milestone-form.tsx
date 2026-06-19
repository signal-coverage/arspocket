"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMilestone } from "@/app/actions/savings-goals-v2";

type Props = {
  goalId: string;
  onDone?: () => void;
};

export const MilestoneForm = ({ goalId, onDone }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetDate) {
      setError("Title and target date are required.");
      return;
    }
    startTransition(async () => {
      try {
        await createMilestone({ goalId, title, targetDate });
        setTitle("");
        setTargetDate("");
        onDone?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create milestone");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="milestone-title">Milestone Title</Label>
        <Input
          id="milestone-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="First $10k saved"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="milestone-date">Target Date</Label>
        <Input
          id="milestone-date"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Adding..." : "Add Milestone"}
      </Button>
    </form>
  );
};
