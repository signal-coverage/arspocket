import { getUnreadCount, getNotifications } from "@/app/actions/notifications";
import { NotificationPanel } from "./notification-panel";

export const NotificationBell = async () => {
  const [count, notifications] = await Promise.all([
    getUnreadCount(),
    getNotifications(),
  ]);

  return (
    <NotificationPanel initialNotifications={notifications} unreadCount={count} />
  );
};
