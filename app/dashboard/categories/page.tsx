import type { Metadata } from "next";
import { Trash2 } from "lucide-react";

import { getCategories, createCategory, deleteCategory } from "@/app/actions/categories";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/lib/categories";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui";

export const metadata: Metadata = { title: "Categories — ARSPocket" };

export const CategoriesPage = async () => {
  const allUserCategories = await getCategories();

  const userIncome = allUserCategories.filter(
    (c) => c.type === "income" || c.type === "both",
  );
  const userExpense = allUserCategories.filter(
    (c) => c.type === "outcome" || c.type === "both",
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Manage your custom categories. Built-in categories are always available and cannot be deleted.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Income Categories</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Built-in (read-only)</p>
              <ul className="flex flex-wrap gap-1.5">
                {INCOME_CATEGORIES.map((cat) => (
                  <li
                    key={cat}
                    className="rounded-full border bg-muted px-2.5 py-0.5 text-xs"
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            {userIncome.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Custom</p>
                <ul className="flex flex-col gap-1">
                  {userIncome.map((cat) => (
                    <li key={cat.id} className="flex items-center justify-between gap-2 rounded-md border px-3 py-1.5">
                      <span className="text-sm">{cat.name}</span>
                      <form
                        action={async () => {
                          "use server";
                          await deleteCategory(cat.id);
                        }}
                      >
                        <Button type="submit" size="icon" variant="ghost" className="size-7 text-muted-foreground hover:text-destructive">
                          <Trash2 className="size-3.5" />
                        </Button>
                      </form>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <form
              action={async (formData: FormData) => {
                "use server";
                const name = formData.get("name") as string;
                if (!name?.trim()) return;
                await createCategory({ name: name.trim(), type: "income" });
              }}
              className="flex flex-col gap-2"
            >
              <Label htmlFor="income-cat-name">Add income category</Label>
              <div className="flex gap-2">
                <Input
                  id="income-cat-name"
                  name="name"
                  placeholder="e.g. Dividends"
                  className="flex-1"
                />
                <Button type="submit" size="sm">Add</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Expense Categories</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Built-in (read-only)</p>
              <ul className="flex flex-wrap gap-1.5">
                {EXPENSE_CATEGORIES.map((cat) => (
                  <li
                    key={cat}
                    className="rounded-full border bg-muted px-2.5 py-0.5 text-xs"
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            </div>

            {userExpense.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Custom</p>
                <ul className="flex flex-col gap-1">
                  {userExpense.map((cat) => (
                    <li key={cat.id} className="flex items-center justify-between gap-2 rounded-md border px-3 py-1.5">
                      <span className="text-sm">{cat.name}</span>
                      <form
                        action={async () => {
                          "use server";
                          await deleteCategory(cat.id);
                        }}
                      >
                        <Button type="submit" size="icon" variant="ghost" className="size-7 text-muted-foreground hover:text-destructive">
                          <Trash2 className="size-3.5" />
                        </Button>
                      </form>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <form
              action={async (formData: FormData) => {
                "use server";
                const name = formData.get("name") as string;
                if (!name?.trim()) return;
                await createCategory({ name: name.trim(), type: "outcome" });
              }}
              className="flex flex-col gap-2"
            >
              <Label htmlFor="expense-cat-name">Add expense category</Label>
              <div className="flex gap-2">
                <Input
                  id="expense-cat-name"
                  name="name"
                  placeholder="e.g. Pets"
                  className="flex-1"
                />
                <Button type="submit" size="sm">Add</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoriesPage;
