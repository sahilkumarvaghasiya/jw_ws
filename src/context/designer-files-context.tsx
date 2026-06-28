"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { FileType, ManagedFile, Order } from "@/lib/types";

export interface PendingUpload {
  name: string;
  size: number;
  type: string;
  preview?: string;
}

export interface DesignerOutboundMessage {
  id: string;
  orderId: string;
  orderNumber: string;
  productTitle: string;
  message: string;
  sentAt: string;
  designerName: string;
}

interface DesignerFilesContextType {
  submittedFiles: ManagedFile[];
  outboundMessages: DesignerOutboundMessage[];
  whatsappLog: { orderId: string; message: string; sentAt: string; direction: "to_seller" }[];
  submitToSeller: (params: {
    order: Order;
    files: PendingUpload[];
    message: string;
    designerName: string;
    designerId: string;
  }) => void;
}

const DesignerFilesContext = createContext<DesignerFilesContextType | undefined>(undefined);

function inferFileType(name: string): FileType {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "stl") return "stl";
  if (ext === "3dm") return "3dm";
  if (ext === "png") return "png";
  if (ext === "reference") return "reference";
  return "jpg";
}

export function DesignerFilesProvider({ children }: { children: ReactNode }) {
  const [submittedFiles, setSubmittedFiles] = useState<ManagedFile[]>([]);
  const [outboundMessages, setOutboundMessages] = useState<DesignerOutboundMessage[]>([]);
  const [whatsappLog, setWhatsappLog] = useState<
    { orderId: string; message: string; sentAt: string; direction: "to_seller" }[]
  >([]);

  const sendWhatsAppToSeller = (orderId: string, text: string) => {
    if (!text.trim()) return;
    setWhatsappLog((prev) => [
      { orderId, message: text.trim(), sentAt: new Date().toISOString(), direction: "to_seller" },
      ...prev,
    ]);
  };

  const submitToSeller = ({
    order,
    files,
    message,
    designerName,
    designerId,
  }: {
    order: Order;
    files: PendingUpload[];
    message: string;
    designerName: string;
    designerId: string;
  }) => {
    const now = new Date().toISOString();
    const trimmedMessage = message.trim();

    if (files.length > 0) {
      const newFiles: ManagedFile[] = files.map((file, index) => ({
        id: `sub-${order.id}-${Date.now()}-${index}`,
        name: file.name,
        type: inferFileType(file.name),
        size: file.size,
        uploadedAt: now,
        uploadedBy: designerName,
        uploadedByRole: "designer",
        url: file.preview || "#",
        orderId: order.id,
        orderNumber: order.orderNumber,
        productTitle: order.title,
        designerId,
        designerName,
        sellerId: order.seller.id,
        sellerName: order.seller.name,
        designerNote: index === 0 && trimmedMessage ? trimmedMessage : undefined,
      }));
      setSubmittedFiles((prev) => [...newFiles, ...prev]);
    }

    if (trimmedMessage && files.length === 0) {
      setOutboundMessages((prev) => [
        {
          id: `msg-${order.id}-${Date.now()}`,
          orderId: order.id,
          orderNumber: order.orderNumber,
          productTitle: order.title,
          message: trimmedMessage,
          sentAt: now,
          designerName,
        },
        ...prev,
      ]);
    }

    const whatsappParts: string[] = [];
    if (trimmedMessage) whatsappParts.push(trimmedMessage);
    if (files.length > 0) {
      whatsappParts.push(`Design files: ${files.map((f) => f.name).join(", ")}`);
    }
    if (whatsappParts.length > 0) {
      sendWhatsAppToSeller(order.id, whatsappParts.join("\n"));
    }
  };

  return (
    <DesignerFilesContext.Provider value={{ submittedFiles, outboundMessages, whatsappLog, submitToSeller }}>
      {children}
    </DesignerFilesContext.Provider>
  );
}

export function useDesignerFiles() {
  const context = useContext(DesignerFilesContext);
  if (!context) {
    throw new Error("useDesignerFiles must be used within DesignerFilesProvider");
  }
  return context;
}
