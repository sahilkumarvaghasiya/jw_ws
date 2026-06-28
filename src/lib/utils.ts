import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { OrderStatus, Order } from "@/lib/types";

export const orderStatusDescriptions: Partial<Record<OrderStatus, string>> = {
  pending: "Seller has added all information but the create order flow has not been finished.",
};

/** Returns create-order wizard step (1–4) for an incomplete pending order */
export function getOrderDraftStep(order: Order): number {
  if (order.draftStep) return order.draftStep;
  if (!order.customer.name) return 1;
  if (!order.title || !order.requirements) return 2;
  if (!order.designer) {
    return order.referenceImages.length === 0 ? 3 : 4;
  }
  return 4;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
