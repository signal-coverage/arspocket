"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

interface MonthlyChartProps {
  data: { month: string; income: number; expenses: number }[];
}

export const MonthlyChart = ({ data }: MonthlyChartProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">Income vs Expenses</CardTitle>
    </CardHeader>
    <CardContent>
      {data.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
          Add transactions to see your monthly chart.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
            <Legend />
            <Bar
              dataKey="income"
              fill="#008080"
              radius={[4, 4, 0, 0]}
              name="Income"
            />
            <Bar
              dataKey="expenses"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              name="Expenses"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </CardContent>
  </Card>
);
