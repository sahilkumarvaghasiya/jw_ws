import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-muted text-muted-foreground" },
  assigned: { label: "Assigned", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  in_design: { label: "In Design", className: "bg-gold/15 text-gold-dark dark:text-gold" },
  design_review: { label: "Design Review", className: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  approved: { label: "Approved", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  manufacturing: { label: "Manufacturing", className: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  completed: { label: "Completed", className: "bg-success/15 text-success" },
  rejected: { label: "Rejected", className: "bg-error/15 text-error" },
};

interface BadgeProps {
  status: OrderStatus;
  className?: string;
}

export function StatusBadge({ status, className }: BadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

interface RoleBadgeProps {
  role: string;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold/15 text-gold-dark dark:text-gold capitalize",
        className
      )}
    >
      {role}
    </span>
  );
}
