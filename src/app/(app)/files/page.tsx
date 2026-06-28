"use client";

import { useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FileManager } from "@/components/files/file-manager";
import { allFiles } from "@/lib/mock-data";
import { useDesignerFiles } from "@/context/designer-files-context";
import { useApp } from "@/context/app-context";

const CURRENT_DESIGNER_ID = "u2";

export default function FilesPage() {
  const { role } = useApp();
  const { submittedFiles } = useDesignerFiles();

  const files = useMemo(() => {
    const merged = [...submittedFiles, ...allFiles];

    if (role !== "designer") return merged;

    return merged.filter(
      (f) =>
        f.designerId === CURRENT_DESIGNER_ID &&
        f.uploadedByRole !== "manufacturer"
    );
  }, [submittedFiles, role]);

  return (
    <DashboardLayout
      title="File Manager"
      description={
        role === "designer"
          ? "Files shared between you and sellers"
          : "Review design files from your team"
      }
    >
      <FileManager files={files} />
    </DashboardLayout>
  );
}
