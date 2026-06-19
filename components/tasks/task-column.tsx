"use client";

import { useDroppable } from "@dnd-kit/core";
import { useTranslations } from "next-intl";
import { SerializedTask } from "@/app/actions/tasks";
import { TaskCard } from "./task-card";
import { Button } from "@/components/ui/button";
import { Plus, Inbox } from "lucide-react";
import { useState } from "react";
import { TaskForm } from "./task-form";
import { TaskStatus } from "@prisma/client";

type Props = {
  status: TaskStatus;
  label: string;
  tasks: SerializedTask[];
  color: string;
};

export const TaskColumn = ({ status, label, tasks, color }: Props) => {
  const t = useTranslations("tasks");
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* Column header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${color}`} />
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs text-muted-foreground bg-muted rounded-full px-1.5">
            {tasks.length}
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="size-6"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="size-3.5" />
        </Button>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 min-h-[200px] rounded-lg p-2 transition-colors ${isOver ? "bg-primary/5 ring-1 ring-primary/30" : "bg-muted/30"}`}
      >
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <Inbox className="size-5 text-muted-foreground/50" />
            <p className="text-xs text-muted-foreground">{t("dropHere")}</p>
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>

      <TaskForm
        open={addOpen}
        onOpenChange={setAddOpen}
        defaultStatus={status}
      />
    </div>
  );
};
