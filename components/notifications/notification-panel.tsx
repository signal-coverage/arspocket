"use client";

import { useState, useTransition } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import type { Notification } from "@prisma/client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { markRead, markAllRead } from "@/app/actions/notifications";

interface NotificationPanelProps {
  initialNotifications: Notification[];
  unreadCount: number;
}

export const NotificationPanel = ({
  initialNotifications,
  unreadCount,
}: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [localUnread, setLocalUnread] = useState(unreadCount);
  const [, startTransition] = useTransition();

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    setLocalUnread((prev) => Math.max(0, prev - 1));
    startTransition(async () => {
      await markRead(id);
    });
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setLocalUnread(0);
    startTransition(async () => {
      await markAllRead();
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer">
          <Bell className="size-5" />
          {localUnread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground leading-none">
              {localUnread > 99 ? "99+" : localUnread}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <p className="text-sm font-semibold">Notifications</p>
          {localUnread > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground"
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No notifications
            </p>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`flex items-start gap-2 border-b px-3 py-2.5 last:border-0 cursor-pointer hover:bg-accent/50 ${
                    !n.isRead ? "bg-accent/20" : ""
                  }`}
                  onClick={() => !n.isRead && handleMarkRead(n.id)}
                >
                  {!n.isRead && (
                    <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  )}
                  {n.isRead && <div className="mt-1.5 size-1.5 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 wrap-break-word">
                      {n.body}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
