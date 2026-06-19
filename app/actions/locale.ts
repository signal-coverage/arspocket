"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export const setLocale = async (locale: "en" | "es"): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  revalidatePath("/", "layout");
};
