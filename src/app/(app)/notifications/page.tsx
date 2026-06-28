"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NotificationList } from "@/components/notifications/notification-list";
import { Button } from "@/components/ui/button";
import { notifications } from "@/lib/mock-data";

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout
      title="Notifications"
      description={`You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
      actions={
        <Button variant="outline" size="sm">
          Mark all as read
        </Button>
      }
    >
      <NotificationList />
    </DashboardLayout>
  );
}
