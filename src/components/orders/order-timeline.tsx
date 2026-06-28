"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { OrderStatus } from "@/lib/types";

interface TimelineStep {
  label: string;
  status: OrderStatus;
  date?: string;
}

const allSteps: TimelineStep[] = [
  { label: "Order Created", status: "pending" },
  { label: "Assigned to Designer", status: "assigned" },
  { label: "In Design", status: "in_design" },
  { label: "Design Review", status: "design_review" },
  { label: "Approved", status: "approved" },
  { label: "Manufacturing", status: "manufacturing" },
  { label: "Completed", status: "completed" },
];

const statusOrder: OrderStatus[] = [
  "pending", "assigned", "in_design", "design_review", "approved", "manufacturing", "completed",
];

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  className?: string;
  compact?: boolean;
}

export function OrderTimeline({ currentStatus, className, compact }: OrderTimelineProps) {
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className={cn("space-y-0", className)}>
      {allSteps.map((step, index) => {
        const isComplete = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === allSteps.length - 1;

        return (
          <div key={step.status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                  isComplete
                    ? "bg-gold text-white shadow-md"
                    : "bg-muted border-2 border-border text-muted-foreground",
                  isCurrent && "ring-4 ring-gold/20"
                )}
              >
                {isComplete ? <Check className="w-4 h-4" /> : <span className="text-xs">{index + 1}</span>}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-[24px] my-1 transition-colors duration-300",
                    index < currentIndex ? "bg-gold" : "bg-border"
                  )}
                />
              )}
            </div>
            {!compact && (
              <div className="pb-6">
                <p className={cn("text-sm font-medium", isCurrent && "text-gold-dark")}>
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-xs text-muted-foreground mt-0.5">{step.date}</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
