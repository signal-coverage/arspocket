import type { Metadata } from "next";
import { getBookmarks, getCollections } from "@/app/actions/library";
import { BookmarkGrid } from "@/components/library/bookmark-grid";

export const metadata: Metadata = { title: "Library — ARSPocket" };

export const LibraryPage = async () => {
  const [bookmarks, collections] = await Promise.all([
    getBookmarks("all"),
    getCollections(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div>
        <h1 className="text-xl font-semibold">Resource Library</h1>
        <p className="text-sm text-muted-foreground">
          Save financial articles, tools, and resources.
        </p>
      </div>
      <BookmarkGrid
        bookmarks={bookmarks}
        collections={collections}
        showAddButton
        emptyMessage="No bookmarks yet. Add your first resource."
      />
    </div>
  );
};

export default LibraryPage;
