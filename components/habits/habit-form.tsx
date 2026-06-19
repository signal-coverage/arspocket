"use client";

import { useState, useTransition } from "react";
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
  "#6366f1", "#10b981", "#f59e0b", "#ef4444",
  "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
];

export const HabitForm = ({ open, onOpenChange }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("⭐");
  const [color, setColor] = useState("#6366f1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Habit name is required.");
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
        setError(err instanceof Error ? err.message : "Failed to create habit");
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Habit</SheetTitle>
          <SheetDescription>Add a habit to track daily.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="habit-name">Name</Label>
            <Input
              id="habit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Meditate 10 minutes"
              maxLength={60}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="habit-icon">Icon (emoji)</Label>
            <Input
              id="habit-icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="⭐"
              maxLength={4}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`size-7 rounded-full border-2 transition-all ${color === c ? "border-foreground scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                />
              ))}
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="size-7 p-0 border-0 cursor-pointer rounded-full overflow-hidden"
                title="Custom color"
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending ? "Creating..." : "Create Habit"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
