"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export type SerializedBookmark = {
  id: string;
  userId: string;
  title: string;
  url: string;
  description: string | null;
  favicon: string | null;
  collectionId: string | null;
  collectionName: string | null;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  deletedAt: string | null;
  createdAt: string;
};

export type SerializedCollection = {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  createdAt: string;
  bookmarkCount?: number;
};

const serializeBookmark = (b: {
  id: string;
  userId: string;
  title: string;
  url: string;
  description: string | null;
  favicon: string | null;
  collectionId: string | null;
  tags: unknown;
  isFavorite: boolean;
  isArchived: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  collection?: { name: string } | null;
}): SerializedBookmark => ({
  id: b.id,
  userId: b.userId,
  title: b.title,
  url: b.url,
  description: b.description,
  favicon: b.favicon,
  collectionId: b.collectionId,
  collectionName: b.collection?.name ?? null,
  tags: b.tags as string[],
  isFavorite: b.isFavorite,
  isArchived: b.isArchived,
  deletedAt: b.deletedAt ? b.deletedAt.toISOString() : null,
  createdAt: b.createdAt.toISOString(),
});

// Best-effort favicon fetch
const fetchFavicon = async (url: string): Promise<string | null> => {
  try {
    const hostname = new URL(url).hostname;
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    // We just store the URL — the browser fetches it
    return faviconUrl;
  } catch {
    return null;
  }
};

export const getBookmarks = async (
  filter: "all" | "favorites" | "archive" | "trash" = "all",
  collectionId?: string
): Promise<SerializedBookmark[]> => {
  const { userId } = await auth();
  if (!userId) return [];

  const bookmarks = await prisma.resourceBookmark.findMany({
    where: {
      userId,
      ...(filter === "all" && { deletedAt: null, isArchived: false }),
      ...(filter === "favorites" && { deletedAt: null, isFavorite: true }),
      ...(filter === "archive" && { deletedAt: null, isArchived: true }),
      ...(filter === "trash" && { deletedAt: { not: null } }),
      ...(collectionId ? { collectionId } : {}),
    },
    include: { collection: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return bookmarks.map(serializeBookmark);
};

export const getCollections = async (): Promise<SerializedCollection[]> => {
  const { userId } = await auth();
  if (!userId) return [];

  const collections = await prisma.bookmarkCollection.findMany({
    where: { userId },
    include: {
      _count: { select: { bookmarks: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return collections.map((c) => ({
    id: c.id,
    userId: c.userId,
    name: c.name,
    icon: c.icon,
    color: c.color,
    createdAt: c.createdAt.toISOString(),
    bookmarkCount: c._count.bookmarks,
  }));
};

export const createBookmark = async (data: {
  title: string;
  url: string;
  description?: string;
  collectionId?: string;
  tags?: string[];
  isFavorite?: boolean;
}): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Validate URL
  try {
    new URL(data.url);
  } catch {
    throw new Error("Invalid URL");
  }

  const tags = data.tags ?? [];
  if (tags.length > 10) throw new Error("Maximum 10 tags per bookmark");

  const favicon = await fetchFavicon(data.url);

  await prisma.resourceBookmark.create({
    data: {
      userId,
      title: data.title,
      url: data.url,
      description: data.description ?? null,
      collectionId: data.collectionId ?? null,
      tags,
      favicon,
      isFavorite: data.isFavorite ?? false,
    },
  });

  revalidatePath("/dashboard/library");
};

export const updateBookmark = async (
  id: string,
  data: {
    title?: string;
    url?: string;
    description?: string;
    collectionId?: string | null;
    tags?: string[];
  }
): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  if (data.tags && data.tags.length > 10) {
    throw new Error("Maximum 10 tags per bookmark");
  }

  await prisma.resourceBookmark.update({
    where: { id, userId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.url !== undefined && { url: data.url }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.collectionId !== undefined && { collectionId: data.collectionId }),
      ...(data.tags !== undefined && { tags: data.tags }),
    },
  });

  revalidatePath("/dashboard/library");
};

export const toggleFavorite = async (id: string): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const bookmark = await prisma.resourceBookmark.findUnique({
    where: { id, userId },
    select: { isFavorite: true },
  });
  if (!bookmark) throw new Error("Bookmark not found");

  await prisma.resourceBookmark.update({
    where: { id, userId },
    data: { isFavorite: !bookmark.isFavorite },
  });

  revalidatePath("/dashboard/library");
  revalidatePath("/dashboard/library/favorites");
};

export const archiveBookmark = async (id: string): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.resourceBookmark.update({
    where: { id, userId },
    data: { isArchived: true },
  });

  revalidatePath("/dashboard/library");
  revalidatePath("/dashboard/library/archive");
};

export const softDeleteBookmark = async (id: string): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.resourceBookmark.update({
    where: { id, userId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/dashboard/library");
  revalidatePath("/dashboard/library/trash");
};

export const restoreBookmark = async (id: string): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.resourceBookmark.update({
    where: { id, userId },
    data: { deletedAt: null, isArchived: false },
  });

  revalidatePath("/dashboard/library");
  revalidatePath("/dashboard/library/trash");
};

export const permanentDeleteBookmark = async (id: string): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.resourceBookmark.delete({ where: { id, userId } });

  revalidatePath("/dashboard/library/trash");
};

export const emptyTrash = async (): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.resourceBookmark.deleteMany({
    where: { userId, deletedAt: { not: null } },
  });

  revalidatePath("/dashboard/library/trash");
};

export const createCollection = async (data: {
  name: string;
  icon?: string;
  color?: string;
}): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.bookmarkCollection.create({
    data: {
      userId,
      name: data.name,
      icon: data.icon ?? "folder",
      color: data.color ?? "#6366f1",
    },
  });

  revalidatePath("/dashboard/library");
};

export const updateCollection = async (
  id: string,
  data: { name?: string; icon?: string; color?: string }
): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.bookmarkCollection.update({
    where: { id, userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.icon !== undefined && { icon: data.icon }),
      ...(data.color !== undefined && { color: data.color }),
    },
  });

  revalidatePath("/dashboard/library");
};

export const deleteCollection = async (id: string): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Bookmarks in this collection will have collectionId set to null (SetNull cascade)
  await prisma.bookmarkCollection.delete({ where: { id, userId } });

  revalidatePath("/dashboard/library");
};
