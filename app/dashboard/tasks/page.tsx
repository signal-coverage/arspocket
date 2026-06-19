import type { Metadata } from "next";
import { getTasksByStatus } from "@/app/actions/tasks";
import { TaskBoard } from "@/components/tasks/task-board";
import { ListChecks } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = { title: "Tasks — ARSPocket" };

export const TasksPage = async () => {
  const t = await getTranslations("tasks");
  const tasksByStatus = await getTasksByStatus();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <ListChecks className="size-5" />
            {t("financialTodos")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("kanbanSubtitle")}</p>
        </div>
      </div>

      <TaskBoard initialTasks={tasksByStatus} />
    </div>
  );
};

export default TasksPage;
