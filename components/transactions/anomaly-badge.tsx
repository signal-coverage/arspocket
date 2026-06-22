"use client";

import { Badge } from "@/components/ui/badge";

interface AnomalyBadgeProps {
  isAnomaly: boolean;
}

export const AnomalyBadge = ({ isAnomaly }: AnomalyBadgeProps) => {
  if (!isAnomaly) return null;

  return (
    <Badge
      variant="destructive"
      className="text-xs"
      aria-label="Anomalous transaction"
    >
      Anomaly
    </Badge>
  );
};
