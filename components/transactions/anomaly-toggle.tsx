"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export const AnomalyToggle = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = searchParams.get("anomaly") === "true";

  const handleToggle = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (isActive) {
      params.delete("anomaly");
    } else {
      params.set("anomaly", "true");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      className="gap-1.5"
      aria-pressed={isActive}
      aria-label="Filter anomalous transactions"
    >
      <AlertTriangle className="size-3.5" />
      Anomalies
    </Button>
  );
};
