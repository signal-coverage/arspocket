"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ProjectionPoint } from "@/lib/utils/projection";

type Props = {
  data30: ProjectionPoint[];
  data60: ProjectionPoint[];
  data90: ProjectionPoint[];
};

const fmt = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    notation: "compact",
    maximumFractionDigits: 0,
  }).format(n);

export const CashFlowChart = ({ data30, data60, data90 }: Props) => {
  const t = useTranslations("dashboard");
  const [days, setDays] = useState<30 | 60 | 90>(30);

  const data = days === 30 ? data30 : days === 60 ? data60 : data90;
  const hasData = data.some((p) => p.projected !== 0 || p.cumulative !== 0);

  // Only show every 7th point label to avoid crowding
  const labeledData = data.filter(
    (_, i) => i % 7 === 0 || i === data.length - 1,
  );
  const labelSet = new Set(labeledData.map((d) => d.date));

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {t("cashFlowProjection")}{" "}
            <span className="text-xs font-normal text-muted-foreground ml-1">
              ({t("estimate")})
            </span>
          </CardTitle>
          <div className="flex gap-1">
            {([30, 60, 90] as const).map((d) => (
              <Button
                key={d}
                size="sm"
                variant={days === d ? "default" : "outline"}
                className="h-7 px-2 text-xs"
                onClick={() => setDays(d)}
              >
                {d}d
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
            {t("notEnoughData")}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tickFormatter={(v) => (labelSet.has(v) ? v.slice(5) : "")}
                interval={0}
              />
              <YAxis tickFormatter={fmt} className="text-xs" width={70} />
              <Tooltip
                formatter={(v) => fmt(Number(v))}
                labelFormatter={(l) => `${t("dateLabel")}: ${l}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="projected"
                name={t("daily")}
                stroke="#6366f1"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                name={t("cumulative")}
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
