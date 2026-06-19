"use client";

import { HeatmapDay } from "@/app/actions/habits";

type Props = {
  data: HeatmapDay[];
};

const INTENSITY_COLORS = [
  "bg-muted",            // 0 — no activity
  "bg-primary/20",      // 1
  "bg-primary/40",      // 2-3
  "bg-primary/60",      // 4-5
  "bg-primary/80",      // 6+
];

const getIntensity = (count: number): number => {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  return 4;
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const ContributionHeatmap = ({ data }: Props) => {
  if (data.length === 0) return null;

  // Build weekly columns from data
  const firstDay = new Date(data[0].date);
  const startDow = firstDay.getDay(); // 0=Sun

  // Pad start with empty cells
  const padded: (HeatmapDay | null)[] = [
    ...Array(startDow).fill(null),
    ...data,
  ];

  // Split into weeks
  const weeks: (HeatmapDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  // Get month labels at week boundaries
  const monthPositions: { label: string; col: number }[] = [];
  let lastMonth = -1;
  for (let col = 0; col < weeks.length; col++) {
    const firstRealDay = weeks[col].find((d) => d !== null);
    if (firstRealDay) {
      const month = new Date(firstRealDay.date).getMonth();
      if (month !== lastMonth) {
        monthPositions.push({ label: MONTH_LABELS[month], col });
        lastMonth = month;
      }
    }
  }

  return (
    <div className="flex flex-col gap-2 overflow-x-auto">
      {/* Month labels */}
      <div className="flex" style={{ paddingLeft: "32px" }}>
        {weeks.map((_, colIdx) => {
          const mp = monthPositions.find((m) => m.col === colIdx);
          return (
            <div key={colIdx} className="w-3.5 shrink-0 mr-0.5 text-[9px] text-muted-foreground">
              {mp?.label ?? ""}
            </div>
          );
        })}
      </div>

      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 mr-1">
          {DAY_LABELS.map((d, i) => (
            <div key={d} className="h-3.5 text-[9px] text-muted-foreground flex items-center">
              {i % 2 === 1 ? d : ""}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-0.5">
          {weeks.map((week, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-0.5">
              {week.map((day, rowIdx) => {
                if (!day) {
                  return <div key={rowIdx} className="size-3.5 rounded-sm" />;
                }
                const intensity = getIntensity(day.count);
                return (
                  <div
                    key={rowIdx}
                    className={`size-3.5 rounded-sm ${INTENSITY_COLORS[intensity]}`}
                    title={`${day.date}: ${day.count} activities`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 mt-1 ml-8 text-[10px] text-muted-foreground">
        <span>Less</span>
        {INTENSITY_COLORS.map((c, i) => (
          <div key={i} className={`size-3 rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};
