import type { Metadata } from "next";
import { getTasksByStatus } from "@/app/actions/tasks";
import { TaskBoard } from "@/components/tasks/task-board";
import { ListChecks } from "lucide-react";

export const metadata: Metadata = { title: "Tasks — ARSPocket" };

export const TasksPage = async () => {
  const tasksByStatus = await getTasksByStatus();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <ListChecks className="size-5" />
            Financial To-Dos
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your financial tasks in a Kanban board.
          </p>
        </div>
      </div>

      <TaskBoard initialTasks={tasksByStatus} />
    </div>
  );
};

export default TasksPage;
