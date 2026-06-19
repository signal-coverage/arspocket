"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { ChevronsUpDown, LogOut, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Loader,
} from "@/components/ui";
import { getInitials } from "@/lib/helpers";

export const NavUser = () => {
  const t = useTranslations("nav");
  const { user, isLoaded } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) router.push("/signin");
  }, [isLoaded, user, router]);

  if (isLoaded && !user) return null;

  const email = user?.primaryEmailAddress?.emailAddress;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="w-full min-h-12 flex items-center gap-3 rounded-md px-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {!isLoaded ? (
            <Loader />
          ) : (
            <>
              <Avatar className="h-8 w-8 shrink-0 rounded-2xl">
                <AvatarImage
                  src={user?.hasImage ? user?.imageUrl : undefined}
                  alt={user?.firstName ?? "User"}
                />
                <AvatarFallback className="rounded-2xl">
                  {getInitials(user?.fullName ?? "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col text-left">
                <span className="truncate text-sm font-semibold">
                  {user?.firstName ?? ""}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {email ?? ""}
                </span>
              </div>
              <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-8 w-8 shrink-0 rounded-2xl">
            <AvatarImage
              src={user?.hasImage ? user?.imageUrl : undefined}
              alt={user?.firstName ?? "User"}
            />
            <AvatarFallback className="rounded-2xl">
              {getInitials(user?.fullName ?? "")}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold">
              {user?.firstName ?? ""}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {email ?? ""}
            </span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => openUserProfile()}
        >
          <UserIcon className="size-4" />
          {t("viewProfile")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => signOut({ redirectUrl: "/" })}
        >
          <LogOut className="size-4" />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
