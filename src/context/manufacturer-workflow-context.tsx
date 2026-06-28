"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { ManufacturerOrderState, ManufacturerWorkflowStatus } from "@/lib/types";

interface ManufacturerWorkflowContextType {
  getStatus: (orderId: string) => ManufacturerWorkflowStatus;
  getState: (orderId: string) => ManufacturerOrderState | undefined;
  acceptOrder: (orderId: string, manufacturingDeadline: string) => void;
  markReadyForPickup: (orderId: string) => void;
  registerPendingOrder: (orderId: string) => void;
}

const ManufacturerWorkflowContext = createContext<ManufacturerWorkflowContextType | undefined>(
  undefined
);

const initialStates: Record<string, ManufacturerOrderState> = {
  o3: {
    orderId: "o3",
    status: "in_production",
    manufacturingDeadline: "2024-07-10",
    acceptedAt: "2024-06-27T12:00:00Z",
  },
  o7: {
    orderId: "o7",
    status: "pending",
  },
};

export function ManufacturerWorkflowProvider({ children }: { children: ReactNode }) {
  const [states, setStates] = useState<Record<string, ManufacturerOrderState>>(initialStates);

  const registerPendingOrder = useCallback((orderId: string) => {
    setStates((prev) => {
      if (prev[orderId]) return prev;
      return { ...prev, [orderId]: { orderId, status: "pending" } };
    });
  }, []);

  const getState = useCallback(
    (orderId: string) => states[orderId],
    [states]
  );

  const getStatus = useCallback(
    (orderId: string): ManufacturerWorkflowStatus => states[orderId]?.status ?? "pending",
    [states]
  );

  const acceptOrder = useCallback((orderId: string, manufacturingDeadline: string) => {
    setStates((prev) => ({
      ...prev,
      [orderId]: {
        orderId,
        status: "in_production",
        manufacturingDeadline,
        acceptedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const markReadyForPickup = useCallback((orderId: string) => {
    setStates((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        orderId,
        status: "ready_for_pickup",
        readyAt: new Date().toISOString(),
      },
    }));
  }, []);

  return (
    <ManufacturerWorkflowContext.Provider
      value={{
        getStatus,
        getState,
        acceptOrder,
        markReadyForPickup,
        registerPendingOrder,
      }}
    >
      {children}
    </ManufacturerWorkflowContext.Provider>
  );
}

export function useManufacturerWorkflow() {
  const context = useContext(ManufacturerWorkflowContext);
  if (!context) {
    throw new Error("useManufacturerWorkflow must be used within ManufacturerWorkflowProvider");
  }
  return context;
}

export const manufacturerStatusLabels: Record<ManufacturerWorkflowStatus, string> = {
  pending: "Pending",
  in_production: "In production",
  ready_for_pickup: "Ready to pick up",
};
