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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTask, updateTask, SerializedTask } from "@/app/actions/tasks";
import { TaskStatus } from "@prisma/client";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStatus?: TaskStatus;
  editTask?: SerializedTask | null;
};

export const TaskForm = ({
  open,
  onOpenChange,
  defaultStatus = "BACKLOG",
  editTask,
}: Props) => {
  const t = useTranslations("tasks");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(editTask?.title ?? "");
  const [description, setDescription] = useState(editTask?.description ?? "");
  const [priority, setPriority] = useState<
    "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  >((editTask?.priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT") ?? "MEDIUM");
  const [dueDate, setDueDate] = useState(
    editTask?.dueDate
      ? new Date(editTask.dueDate).toISOString().split("T")[0]
      : "",
  );
  const [labelsInput, setLabelsInput] = useState(
    editTask?.labels.join(", ") ?? "",
  );

  const parseLabels = (input: string): string[] =>
    input
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t("titleIsRequired"));
      return;
    }
    const labels = parseLabels(labelsInput);
    if (labels.length > 5) {
      setError(t("maxLabels"));
      return;
    }

    startTransition(async () => {
      try {
        if (editTask) {
          await updateTask(editTask.id, {
            title: title.trim(),
            description: description || undefined,
            priority,
            dueDate: dueDate || null,
            labels,
          });
        } else {
          await createTask({
            title: title.trim(),
            description: description || undefined,
            priority,
            dueDate: dueDate || undefined,
            labels,
          });
        }
        onOpenChange(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("failedSave"));
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{editTask ? t("editTask") : t("newTask")}</SheetTitle>
          <SheetDescription>
            {editTask ? t("updateTaskDescription") : t("addTaskBoard")}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-title">{t("titleRequired")}</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Call the bank"
              maxLength={200}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-desc">{tCommon("description")}</Label>
            <Input
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("optionalDescription")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t("priorityLabel")}</Label>
            <Select
              value={priority}
              onValueChange={(v) =>
                setPriority(v as "LOW" | "MEDIUM" | "HIGH" | "URGENT")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">{t("priority.low")}</SelectItem>
                <SelectItem value="MEDIUM">{t("priority.medium")}</SelectItem>
                <SelectItem value="HIGH">{t("priority.high")}</SelectItem>
                <SelectItem value="URGENT">{t("priority.urgent")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-due">{t("dueDateLabel")}</Label>
            <Input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-labels">{t("labelsLabel")}</Label>
            <Input
              id="task-labels"
              value={labelsInput}
              onChange={(e) => setLabelsInput(e.target.value)}
              placeholder="urgent, follow-up, banking"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isPending} className="mt-2">
            {isPending
              ? t("saving")
              : editTask
                ? t("updateTaskBtn")
                : t("createTaskBtn")}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};
