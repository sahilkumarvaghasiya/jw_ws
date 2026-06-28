"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { Order } from "@/lib/types";

export interface ManufacturerOutboundMessage {
  id: string;
  orderId: string;
  orderNumber: string;
  message: string;
  sentAt: string;
  manufacturerName: string;
  type: "message" | "ready_for_pickup";
}

interface ManufacturerFilesContextType {
  outboundMessages: ManufacturerOutboundMessage[];
  sendToSeller: (params: {
    order: Order;
    message: string;
    manufacturerName: string;
    type?: "message" | "ready_for_pickup";
  }) => void;
}

const ManufacturerFilesContext = createContext<ManufacturerFilesContextType | undefined>(
  undefined
);

export function ManufacturerFilesProvider({ children }: { children: ReactNode }) {
  const [outboundMessages, setOutboundMessages] = useState<ManufacturerOutboundMessage[]>([]);

  const sendToSeller = ({
    order,
    message,
    manufacturerName,
    type = "message",
  }: {
    order: Order;
    message: string;
    manufacturerName: string;
    type?: "message" | "ready_for_pickup";
  }) => {
    const trimmed = message.trim();
    if (!trimmed) return;

    setOutboundMessages((prev) => [
      {
        id: `mfr-msg-${order.id}-${Date.now()}`,
        orderId: order.id,
        orderNumber: order.orderNumber,
        message: trimmed,
        sentAt: new Date().toISOString(),
        manufacturerName,
        type,
      },
      ...prev,
    ]);
  };

  return (
    <ManufacturerFilesContext.Provider value={{ outboundMessages, sendToSeller }}>
      {children}
    </ManufacturerFilesContext.Provider>
  );
}

export function useManufacturerFiles() {
  const context = useContext(ManufacturerFilesContext);
  if (!context) {
    throw new Error("useManufacturerFiles must be used within ManufacturerFilesProvider");
  }
  return context;
}
