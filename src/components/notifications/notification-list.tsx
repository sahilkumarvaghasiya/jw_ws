"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notifications } from "@/lib/mock-data";
import { cn, formatDateTime } from "@/lib/utils";
import {
  Package,
  CheckCircle,
  Upload,
  Factory,
  Bell,
} from "lucide-react";
import Link from "next/link";

const typeIcons: Record<string, React.ElementType> = {
  new_order: Package,
  accepted: CheckCircle,
  file_upload: Upload,
  manufacturing_start: Factory,
  manufacturing_complete: CheckCircle,
  general: Bell,
};

export function NotificationList() {
  return (
    <div className="space-y-3">
      {notifications.map((notification) => {
        const Icon = typeIcons[notification.type] || Bell;
        return (
          <Card
            key={notification.id}
            className={cn(
              "transition-all duration-200 hover:shadow-[var(--shadow-lg)]",
              !notification.read && "border-gold/30 bg-gold/5"
            )}
          >
            <CardContent className="p-4 flex gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                !notification.read ? "bg-gold/10" : "bg-muted"
              )}>
                <Icon className={cn("w-5 h-5", !notification.read ? "text-gold" : "text-muted-foreground")} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-sm">{notification.title}</p>
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-gold shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(notification.createdAt)}
                  </span>
                  {notification.orderId && (
                    <Link href={`/orders/${notification.orderId}`} className="text-xs text-gold hover:underline">
                      View order
                    </Link>
                  )}
                </div>
              </div>
              {!notification.read && (
                <Button variant="ghost" size="sm" className="shrink-0 text-xs">
                  Mark read
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
