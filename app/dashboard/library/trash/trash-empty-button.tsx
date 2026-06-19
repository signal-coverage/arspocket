"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { emptyTrash } from "@/app/actions/library";

export const TrashEmptyButton = () => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      size="sm"
      className="gap-1.5"
      disabled={isPending}
      onClick={() => startTransition(async () => { await emptyTrash(); })}
    >
      <Trash2 className="size-4" />
      {isPending ? "Clearing..." : "Empty Trash"}
    </Button>
  );
};
