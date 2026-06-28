"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { FileForwardPackage, ForwardedFile, ManagedFile } from "@/lib/types";

interface FileForwardContextType {
  forwardPackages: FileForwardPackage[];
  forwardFiles: (params: {
    files: ManagedFile[];
    manufacturerId: string;
    manufacturerName: string;
    sellerName: string;
    note?: string;
    sellerPreferredDate?: string;
  }) => void;
  getForwardForFile: (fileId: string) => FileForwardPackage | undefined;
  getPackagesForManufacturer: (manufacturerId: string) => FileForwardPackage[];
  getPackageForOrder: (orderId: string) => FileForwardPackage | undefined;
}

const FileForwardContext = createContext<FileForwardContextType | undefined>(undefined);

const initialForwardPackages: FileForwardPackage[] = [
  {
    id: "fwd-initial-o7",
    orderId: "o7",
    orderNumber: "JW-2024-083",
    fileIds: ["o7-f3", "o7-f5"],
    files: [
      {
        id: "o7-f3",
        name: "diamond-ring-v2.stl",
        orderId: "o7",
        orderNumber: "JW-2024-083",
        productTitle: "Silver Chain Bracelet",
        type: "stl",
      },
      {
        id: "o7-f5",
        name: "diamond-ring-preview.jpg",
        orderId: "o7",
        orderNumber: "JW-2024-083",
        productTitle: "Silver Chain Bracelet",
        type: "jpg",
      },
    ],
    manufacturerId: "u4",
    manufacturerName: "Elena Rossi",
    sellerName: "Eleanor Whitmore",
    note: "Approved design files attached. Please confirm production timeline.",
    sellerPreferredDate: "2024-07-20",
    createdAt: "2024-06-29T09:00:00Z",
  },
];

export function FileForwardProvider({ children }: { children: ReactNode }) {
  const [forwardPackages, setForwardPackages] = useState<FileForwardPackage[]>(initialForwardPackages);

  const forwardFiles = ({
    files,
    manufacturerId,
    manufacturerName,
    sellerName,
    note,
    sellerPreferredDate,
  }: {
    files: ManagedFile[];
    manufacturerId: string;
    manufacturerName: string;
    sellerName: string;
    note?: string;
    sellerPreferredDate?: string;
  }) => {
    if (files.length === 0) return;

    const forwarded: ForwardedFile[] = files.map((file) => ({
      id: file.id,
      name: file.name,
      orderId: file.orderId,
      orderNumber: file.orderNumber,
      productTitle: file.productTitle,
      type: file.type,
    }));

    const newPackage: FileForwardPackage = {
      id: `fwd-${Date.now()}`,
      fileIds: files.map((f) => f.id),
      files: forwarded,
      orderId: files[0].orderId,
      orderNumber: files[0].orderNumber,
      manufacturerId,
      manufacturerName,
      sellerName,
      note,
      sellerPreferredDate,
      createdAt: new Date().toISOString(),
    };

    setForwardPackages((prev) => [newPackage, ...prev]);
  };

  const getForwardForFile = (fileId: string) =>
    forwardPackages.find((pkg) => pkg.fileIds.includes(fileId));

  const getPackagesForManufacturer = (manufacturerId: string) =>
    forwardPackages.filter((pkg) => pkg.manufacturerId === manufacturerId);

  const getPackageForOrder = (orderId: string) =>
    forwardPackages.find((pkg) => pkg.orderId === orderId);

  return (
    <FileForwardContext.Provider
      value={{
        forwardPackages,
        forwardFiles,
        getForwardForFile,
        getPackagesForManufacturer,
        getPackageForOrder,
      }}
    >
      {children}
    </FileForwardContext.Provider>
  );
}

export function useFileForwards() {
  const context = useContext(FileForwardContext);
  if (!context) {
    throw new Error("useFileForwards must be used within FileForwardProvider");
  }
  return context;
}
