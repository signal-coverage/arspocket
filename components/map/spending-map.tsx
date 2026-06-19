"use client";

import dynamic from "next/dynamic";
import { GeoTransaction } from "./spending-map-inner";
import { Loader2 } from "lucide-react";

const SpendingMapInner = dynamic(
  () =>
    import("./spending-map-inner").then((m) => m.SpendingMapInner),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

type Props = {
  transactions: GeoTransaction[];
};

export const SpendingMap = ({ transactions }: Props) => {
  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border">
      <SpendingMapInner transactions={transactions} />
    </div>
  );
};
