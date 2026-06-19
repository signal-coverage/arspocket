import type { Metadata } from "next";
import { format } from "date-fns";
import { TrendingUp, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getNetWorthSnapshots, deleteSnapshot } from "@/app/actions/net-worth";
import { NetWorthChart } from "@/components/net-worth/net-worth-chart";
import { NetWorthForm } from "@/components/net-worth/net-worth-form";

export const metadata: Metadata = { title: "Net Worth — ARSPocket" };

const fmt = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

export const NetWorthPage = async () => {
  const snapshots = await getNetWorthSnapshots();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Net Worth</h1>
        <p className="text-sm text-muted-foreground">
          Track your assets and liabilities over time.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle>New Snapshot</CardTitle>
            <CardDescription>
              Record your current assets and liabilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NetWorthForm />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="size-4" /> Net Worth Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NetWorthChart snapshots={snapshots} />
            </CardContent>
          </Card>

          {snapshots.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Snapshots</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  {[...snapshots].reverse().map((s) => (
                    <li
                      key={s.id}
                      className="py-3 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {format(new Date(s.date), "MMM d, yyyy")}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className="text-xs text-emerald-600"
                          >
                            Assets: {fmt(s.totalAssets)}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="text-xs text-red-600"
                          >
                            Liabilities: {fmt(s.totalLiabilities)}
                          </Badge>
                        </div>
                        <p
                          className={`text-sm font-semibold mt-1 ${s.netWorth >= 0 ? "text-emerald-600" : "text-red-600"}`}
                        >
                          Net: {fmt(s.netWorth)}
                        </p>
                      </div>
                      <form
                        action={async () => {
                          "use server";
                          await deleteSnapshot(s.id);
                        }}
                      >
                        <Button
                          type="submit"
                          size="icon"
                          variant="ghost"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </form>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetWorthPage;
