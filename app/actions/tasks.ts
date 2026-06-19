"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { TaskStatus, TaskPriority } from "@prisma/client";

export type SerializedTask = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  labels: string[];
  sortOrder: number;
  createdAt: string;
};

const serializeTask = (task: {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  labels: unknown;
  sortOrder: number;
  createdAt: Date;
}): SerializedTask => ({
  id: task.id,
  userId: task.userId,
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  dueDate: task.dueDate ? task.dueDate.toISOString() : null,
  labels: task.labels as string[],
  sortOrder: task.sortOrder,
  createdAt: task.createdAt.toISOString(),
});

export const getTasks = async (): Promise<SerializedTask[]> => {
  const { userId } = await auth();
  if (!userId) return [];

  const tasks = await prisma.financialTask.findMany({
    where: { userId },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return tasks.map(serializeTask);
};

export const getTasksByStatus = async (): Promise<Record<TaskStatus, SerializedTask[]>> => {
  const { userId } = await auth();
  if (!userId) {
    return {
      BACKLOG: [],
      TODO: [],
      IN_PROGRESS: [],
      DONE: [],
    };
  }

  const tasks = await prisma.financialTask.findMany({
    where: { userId },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const result: Record<TaskStatus, SerializedTask[]> = {
    BACKLOG: [],
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  };

  for (const task of tasks) {
    result[task.status].push(serializeTask(task));
  }

  return result;
};

export const createTask = async (data: {
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string;
  labels?: string[];
}): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const labels = data.labels ?? [];
  if (labels.length > 5) throw new Error("Maximum 5 labels per task");

  await prisma.financialTask.create({
    data: {
      userId,
      title: data.title,
      description: data.description ?? null,
      priority: data.priority as TaskPriority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      labels,
    },
  });

  revalidatePath("/dashboard/tasks");
};

export const updateTask = async (
  id: string,
  data: {
    title?: string;
    description?: string;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    dueDate?: string | null;
    labels?: string[];
  }
): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (data.labels && data.labels.length > 5) {
    throw new Error("Maximum 5 labels per task");
  }

  await prisma.financialTask.update({
    where: { id, userId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.priority !== undefined && { priority: data.priority as TaskPriority }),
      ...(data.dueDate !== undefined && {
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      }),
      ...(data.labels !== undefined && { labels: data.labels }),
    },
  });

  revalidatePath("/dashboard/tasks");
};

export const updateTaskStatus = async (
  id: string,
  status: TaskStatus
): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.financialTask.update({
    where: { id, userId },
    data: { status },
  });

  revalidatePath("/dashboard/tasks");
};

export const deleteTask = async (id: string): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.financialTask.delete({ where: { id, userId } });

  revalidatePath("/dashboard/tasks");
};
