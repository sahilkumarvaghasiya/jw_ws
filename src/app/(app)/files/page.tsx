"use client";

import { useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FileManager } from "@/components/files/file-manager";
import { allFiles, orders } from "@/lib/mock-data";
import { useDesignerFiles } from "@/context/designer-files-context";
import { useFileForwards } from "@/context/file-forward-context";
import { useApp } from "@/context/app-context";

const CURRENT_DESIGNER_ID = "u2";
const CURRENT_MANUFACTURER_ID = "u4";

export default function FilesPage() {
  const { role } = useApp();
  const { submittedFiles } = useDesignerFiles();
  const { getPackagesForManufacturer } = useFileForwards();

  const files = useMemo(() => {
    const merged = [...submittedFiles, ...allFiles];

    if (role === "designer") {
      return merged.filter(
        (f) =>
          f.designerId === CURRENT_DESIGNER_ID &&
          f.uploadedByRole !== "manufacturer"
      );
    }

    if (role === "manufacturer") {
      const forwardPackages = getPackagesForManufacturer(CURRENT_MANUFACTURER_ID);
      const orderIds = new Set<string>();
      orders
        .filter((o) => o.manufacturer?.id === CURRENT_MANUFACTURER_ID)
        .forEach((o) => orderIds.add(o.id));
      forwardPackages.forEach((pkg) => orderIds.add(pkg.orderId));

      return merged.filter((f) => orderIds.has(f.orderId));
    }

    return merged;
  }, [submittedFiles, role, getPackagesForManufacturer]);

  const description =
    role === "designer"
      ? "Files shared between you and sellers"
      : role === "manufacturer"
        ? "Files shared between you and sellers"
        : "Review design files from your team";

  return (
    <DashboardLayout title="File Manager" description={description}>
      <FileManager files={files} />
    </DashboardLayout>
  );
}
