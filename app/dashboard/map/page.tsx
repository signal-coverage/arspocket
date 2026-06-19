import type { Metadata } from "next";
import { getGeoTaggedTransactions } from "@/app/actions/transactions";
import { SpendingMap } from "@/components/map/spending-map";
import { formatCurrency } from "@/lib/format";
import { formatDateDisplay } from "@/lib/dates";
import { MapPin, MoveUpRight, MoveDownLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Spending Map — ARSPocket" };

export const SpendingMapPage = async () => {
  const transactions = await getGeoTaggedTransactions();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="size-5" />
          Spending Map
        </h1>
        <p className="text-sm text-muted-foreground">
          View your geo-tagged transactions on a map.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <SpendingMap transactions={transactions} />
        </div>

        {/* Sidebar list */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">
              Geo-tagged Transactions ({transactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No geo-tagged transactions.
              </p>
            ) : (
              <ul className="divide-y max-h-[440px] overflow-y-auto">
                {transactions.map((tx) => (
                  <li key={tx.id} className="py-3 flex items-center gap-2">
                    <div
                      className={`flex items-center justify-center rounded-md p-1.5 shrink-0 ${
                        tx.type === "INCOME"
                          ? "bg-green-50 dark:bg-green-950"
                          : "bg-red-50 dark:bg-red-950"
                      }`}
                    >
                      {tx.type === "INCOME" ? (
                        <MoveUpRight className="size-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <MoveDownLeft className="size-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tx.description}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant="secondary" className="text-xs">
                          {tx.category}
                        </Badge>
                        {tx.locationName && (
                          <span className="text-xs text-muted-foreground truncate">
                            📍 {tx.locationName}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-sm font-semibold shrink-0 ${
                        tx.type === "INCOME"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {formatCurrency(tx.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpendingMapPage;
