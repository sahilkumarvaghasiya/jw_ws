"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { FileRepairRequest } from "@/lib/types";

interface FileRepairContextType {
  repairRequests: FileRepairRequest[];
  addRepairRequest: (request: Omit<FileRepairRequest, "id" | "createdAt" | "status">) => void;
  resolveRepairRequest: (id: string) => void;
  getRepairsForFile: (fileId: string) => FileRepairRequest[];
  getPendingRepairsForDesigner: () => FileRepairRequest[];
}

const FileRepairContext = createContext<FileRepairContextType | undefined>(undefined);

const initialRepairs: FileRepairRequest[] = [
  {
    id: "rep-1",
    fileId: "o1-f3",
    orderId: "o1",
    orderNumber: "JW-2024-089",
    fileName: "diamond-ring-v2.stl",
    productTitle: "Platinum Diamond Engagement Ring",
    notes: ["Pavé spacing looks too tight near the prongs.", "Please widen the band to 2.5mm as discussed."],
    status: "pending",
    createdAt: "2024-06-26T11:00:00Z",
    sellerName: "Eleanor Whitmore",
  },
];

export function FileRepairProvider({ children }: { children: ReactNode }) {
  const [repairRequests, setRepairRequests] = useState<FileRepairRequest[]>(initialRepairs);

  const addRepairRequest = (request: Omit<FileRepairRequest, "id" | "createdAt" | "status">) => {
    const newRequest: FileRepairRequest = {
      ...request,
      id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setRepairRequests((prev) => [newRequest, ...prev]);
  };

  const resolveRepairRequest = (id: string) => {
    setRepairRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "resolved" as const } : r))
    );
  };

  const getRepairsForFile = (fileId: string) =>
    repairRequests.filter((r) => r.fileId === fileId);

  const getPendingRepairsForDesigner = () =>
    repairRequests.filter((r) => r.status === "pending");

  return (
    <FileRepairContext.Provider
      value={{
        repairRequests,
        addRepairRequest,
        resolveRepairRequest,
        getRepairsForFile,
        getPendingRepairsForDesigner,
      }}
    >
      {children}
    </FileRepairContext.Provider>
  );
}

export function useFileRepairs() {
  const context = useContext(FileRepairContext);
  if (!context) {
    throw new Error("useFileRepairs must be used within FileRepairProvider");
  }
  return context;
}
