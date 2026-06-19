"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { SerializedTask } from "@/app/actions/tasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle, Pencil } from "lucide-react";
import { formatDateDisplay } from "@/lib/dates";
import { deleteTask } from "@/app/actions/tasks";
import { useTransition, useState } from "react";
import { TaskForm } from "./task-form";

type Props = {
  task: SerializedTask;
};

const PRIORITY_STYLES = {
  LOW: "bg-muted text-muted-foreground",
  MEDIUM: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  HIGH: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
  URGENT: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
};

export const TaskCard = ({ task }: Props) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });
  const [isPending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "DONE";

  const handleDelete = () => {
    startTransition(async () => {
      await deleteTask(task.id);
    });
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`rounded-lg border bg-card p-3 flex flex-col gap-2 cursor-grab active:cursor-grabbing shadow-sm ${isDragging ? "ring-2 ring-primary" : ""}`}
      >
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-medium line-clamp-2 flex-1">{task.title}</p>
          <div className="flex items-center gap-0.5 shrink-0">
            <Button
              size="icon"
              variant="ghost"
              className="size-6 text-muted-foreground"
              onClick={(e) => { e.stopPropagation(); setEditOpen(true); }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Pencil className="size-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-6 text-muted-foreground hover:text-destructive"
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
              onPointerDown={(e) => e.stopPropagation()}
              disabled={isPending}
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-1">
          <Badge className={`text-xs px-1.5 py-0 ${PRIORITY_STYLES[task.priority]}`}>
            {task.priority}
          </Badge>
          {task.labels.map((label) => (
            <Badge key={label} variant="outline" className="text-xs px-1.5 py-0">
              {label}
            </Badge>
          ))}
        </div>

        {task.dueDate && (
          <div className={`flex items-center gap-1 text-xs ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}>
            {isOverdue && <AlertCircle className="size-3 shrink-0" />}
            <span>{formatDateDisplay(task.dueDate, "MMM d, yyyy")}</span>
            {isOverdue && <span className="font-medium">(overdue)</span>}
          </div>
        )}
      </div>

      <TaskForm
        open={editOpen}
        onOpenChange={setEditOpen}
        editTask={task}
      />
    </>
  );
};
