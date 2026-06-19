import Link from "next/link";
import { BookMarked, Star, Archive, Trash2 } from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard/library", label: "All", icon: BookMarked },
  { href: "/dashboard/library/favorites", label: "Favorites", icon: Star },
  { href: "/dashboard/library/archive", label: "Archive", icon: Archive },
  { href: "/dashboard/library/trash", label: "Trash", icon: Trash2 },
];

export const LibraryLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1 flex-col">
      {/* Sub-nav */}
      <div className="border-b px-6 pt-4">
        <nav className="flex gap-1 pb-0">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-t-md hover:bg-muted/50 transition-colors"
            >
              <link.icon className="size-3.5" />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
};

export default LibraryLayout;
