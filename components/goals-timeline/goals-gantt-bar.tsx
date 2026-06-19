"use client";

import { formatPercent } from "@/lib/format";
import { formatDateDisplay } from "@/lib/dates";

type Props = {
  name: string;
  startCol: number;  // 0-indexed column start
  endCol: number;    // 0-indexed column end (inclusive)
  totalCols: number;
  pct: number;
  color: string | null;
  isPast: boolean;
  onClick?: () => void;
};

const DEFAULT_COLOR = "#6366f1";

export const GoalsGanttBar = ({
  name,
  startCol,
  endCol,
  totalCols,
  pct,
  color,
  isPast,
  onClick,
}: Props) => {
  const barColor = color ?? DEFAULT_COLOR;
  const left = `${(startCol / totalCols) * 100}%`;
  const width = `${((endCol - startCol + 1) / totalCols) * 100}%`;

  return (
    <div
      className="absolute top-1 bottom-1 rounded-md cursor-pointer group overflow-hidden"
      style={{ left, width, backgroundColor: `${barColor}30`, border: `1px solid ${barColor}` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      aria-label={`${name} — ${formatPercent(pct)} complete`}
    >
      {/* Fill bar */}
      <div
        className="absolute inset-y-0 left-0 transition-all"
        style={{ width: `${pct}%`, backgroundColor: `${barColor}60` }}
      />
      {/* Label */}
      <div className="relative flex items-center h-full px-2 gap-1.5">
        <span
          className={`text-xs font-medium truncate ${isPast ? "line-through opacity-60" : ""}`}
          style={{ color: barColor }}
        >
          {name}
        </span>
        <span className="text-xs text-muted-foreground shrink-0">
          {formatPercent(pct)}
        </span>
      </div>
    </div>
  );
};
