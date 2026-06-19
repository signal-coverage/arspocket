import type { Metadata } from "next";
import { getBookmarks, getCollections } from "@/app/actions/library";
import { BookmarkGrid } from "@/components/library/bookmark-grid";

export const metadata: Metadata = { title: "Archive — ARSPocket" };

export const LibraryArchivePage = async () => {
  const [bookmarks, collections] = await Promise.all([
    getBookmarks("archive"),
    getCollections(),
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <div>
        <h1 className="text-xl font-semibold">Archive</h1>
        <p className="text-sm text-muted-foreground">Archived resources.</p>
      </div>
      <BookmarkGrid
        bookmarks={bookmarks}
        collections={collections}
        emptyMessage="Nothing archived yet."
      />
    </div>
  );
};

export default LibraryArchivePage;
