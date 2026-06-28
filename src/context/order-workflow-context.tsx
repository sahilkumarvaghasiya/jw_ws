"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type DesignerWorkflowStatus = "pending" | "in_design" | "completed" | "repair";

interface OrderWorkflowContextType {
  getStatus: (orderId: string, hasRepair: boolean, baseOrderStatus: string) => DesignerWorkflowStatus;
  approveOrder: (orderId: string) => void;
  markDelivered: (orderId: string) => void;
  isApproved: (orderId: string) => boolean;
}

const OrderWorkflowContext = createContext<OrderWorkflowContextType | undefined>(undefined);

function baseStatusFromOrder(orderStatus: string): DesignerWorkflowStatus {
  if (["completed", "manufacturing", "approved"].includes(orderStatus)) return "completed";
  if (["in_design", "design_review"].includes(orderStatus)) return "in_design";
  if (orderStatus === "assigned") return "pending";
  return "pending";
}

export function OrderWorkflowProvider({ children }: { children: ReactNode }) {
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [deliveredIds, setDeliveredIds] = useState<Set<string>>(new Set());

  const getStatus = useCallback(
    (orderId: string, hasRepair: boolean, baseOrderStatus: string): DesignerWorkflowStatus => {
      if (hasRepair) return "repair";
      if (deliveredIds.has(orderId) || baseStatusFromOrder(baseOrderStatus) === "completed") {
        return "completed";
      }
      if (approvedIds.has(orderId) || baseStatusFromOrder(baseOrderStatus) === "in_design") {
        return "in_design";
      }
      return "pending";
    },
    [approvedIds, deliveredIds]
  );

  const approveOrder = useCallback((orderId: string) => {
    setApprovedIds((prev) => new Set(prev).add(orderId));
  }, []);

  const markDelivered = useCallback((orderId: string) => {
    setDeliveredIds((prev) => new Set(prev).add(orderId));
  }, []);

  const isApproved = useCallback(
    (orderId: string) => approvedIds.has(orderId),
    [approvedIds]
  );

  return (
    <OrderWorkflowContext.Provider
      value={{ getStatus, approveOrder, markDelivered, isApproved }}
    >
      {children}
    </OrderWorkflowContext.Provider>
  );
}

export function useOrderWorkflow() {
  const context = useContext(OrderWorkflowContext);
  if (!context) {
    throw new Error("useOrderWorkflow must be used within OrderWorkflowProvider");
  }
  return context;
}

export const workflowStatusLabels: Record<DesignerWorkflowStatus, string> = {
  pending: "Pending",
  in_design: "In design",
  completed: "Completed",
  repair: "Repair",
};
