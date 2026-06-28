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
  }) => void;
  getForwardForFile: (fileId: string) => FileForwardPackage | undefined;
  getPackagesForManufacturer: (manufacturerId: string) => FileForwardPackage[];
}

const FileForwardContext = createContext<FileForwardContextType | undefined>(undefined);

export function FileForwardProvider({ children }: { children: ReactNode }) {
  const [forwardPackages, setForwardPackages] = useState<FileForwardPackage[]>([]);

  const forwardFiles = ({
    files,
    manufacturerId,
    manufacturerName,
    sellerName,
    note,
  }: {
    files: ManagedFile[];
    manufacturerId: string;
    manufacturerName: string;
    sellerName: string;
    note?: string;
  }) => {
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
      manufacturerId,
      manufacturerName,
      sellerName,
      note,
      createdAt: new Date().toISOString(),
    };

    setForwardPackages((prev) => [newPackage, ...prev]);
  };

  const getForwardForFile = (fileId: string) =>
    forwardPackages.find((pkg) => pkg.fileIds.includes(fileId));

  const getPackagesForManufacturer = (manufacturerId: string) =>
    forwardPackages.filter((pkg) => pkg.manufacturerId === manufacturerId);

  return (
    <FileForwardContext.Provider
      value={{
        forwardPackages,
        forwardFiles,
        getForwardForFile,
        getPackagesForManufacturer,
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
