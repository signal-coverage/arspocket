"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, XIcon } from "lucide-react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

interface TransactionFiltersProps {
  categories: string[];
}

export const TransactionFilters = ({ categories }: TransactionFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const clear = () => router.push(pathname);
  const hasFilters = search || category;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative flex-1 min-w-[180px]">
        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-8 h-8 text-sm"
          value={search}
          onChange={(e) => update("search", e.target.value)}
        />
      </div>
      <Select
        value={category || "all"}
        onValueChange={(v) => update("category", v === "all" ? "" : v)}
      >
        <SelectTrigger className="h-8 text-sm w-[160px]">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button variant="ghost" size="sm" className="h-8 px-2" onClick={clear}>
          <XIcon className="size-3.5 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};
