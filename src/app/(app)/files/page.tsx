"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FileManager } from "@/components/files/file-manager";
import { FileUpload } from "@/components/files/file-upload";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { allFiles } from "@/lib/mock-data";

export default function FilesPage() {
  return (
    <DashboardLayout
      title="File Manager"
      description="Upload, preview, and manage all design files"
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload />
        </CardContent>
      </Card>
      <FileManager files={allFiles} />
    </DashboardLayout>
  );
}
