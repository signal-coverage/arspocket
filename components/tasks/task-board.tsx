"use client";

import { useOptimistic, startTransition } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useTranslations } from "next-intl";
import { SerializedTask, updateTaskStatus } from "@/app/actions/tasks";
import { TaskColumn } from "./task-column";
import { TaskStatus } from "@prisma/client";
import { toast } from "sonner";

type TasksByStatus = Record<TaskStatus, SerializedTask[]>;

type Props = {
  initialTasks: TasksByStatus;
};

type ColumnDef = {
  status: TaskStatus;
  labelKey: "backlog" | "todo" | "inProgress" | "done";
  color: string;
};

const COLUMNS: ColumnDef[] = [
  { status: "BACKLOG", labelKey: "backlog", color: "bg-muted-foreground" },
  { status: "TODO", labelKey: "todo", color: "bg-blue-500" },
  { status: "IN_PROGRESS", labelKey: "inProgress", color: "bg-amber-500" },
  { status: "DONE", labelKey: "done", color: "bg-green-500" },
];

export const TaskBoard = ({ initialTasks }: Props) => {
  const t = useTranslations("tasks");
  const [tasksByStatus, setTasksByStatus] = useOptimistic(
    initialTasks,
    (
      state: TasksByStatus,
      payload: { taskId: string; fromStatus: TaskStatus; toStatus: TaskStatus },
    ): TasksByStatus => {
      const task = state[payload.fromStatus].find(
        (t) => t.id === payload.taskId,
      );
      if (!task) return state;

      return {
        ...state,
        [payload.fromStatus]: state[payload.fromStatus].filter(
          (t) => t.id !== payload.taskId,
        ),
        [payload.toStatus]: [
          { ...task, status: payload.toStatus },
          ...state[payload.toStatus],
        ],
      };
    },
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const toStatus = over.id as TaskStatus;

    let fromStatus: TaskStatus | null = null;
    for (const status of Object.keys(tasksByStatus) as TaskStatus[]) {
      if (tasksByStatus[status].some((t) => t.id === taskId)) {
        fromStatus = status;
        break;
      }
    }

    if (!fromStatus || fromStatus === toStatus) return;

    startTransition(async () => {
      setTasksByStatus({ taskId, fromStatus: fromStatus!, toStatus });
      try {
        await updateTaskStatus(taskId, toStatus);
      } catch {
        toast.error("Failed to update task status. Please try again.");
      }
    });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => (
          <TaskColumn
            key={col.status}
            status={col.status}
            label={t(col.labelKey)}
            tasks={tasksByStatus[col.status]}
            color={col.color}
          />
        ))}
      </div>
    </DndContext>
  );
};
