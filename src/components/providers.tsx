"use client";

import { AppProvider } from "@/context/app-context";
import { FileRepairProvider } from "@/context/file-repair-context";
import { FileForwardProvider } from "@/context/file-forward-context";
import { DesignerFilesProvider } from "@/context/designer-files-context";
import { OrderWorkflowProvider } from "@/context/order-workflow-context";
import { ManufacturerWorkflowProvider } from "@/context/manufacturer-workflow-context";
import { ManufacturerFilesProvider } from "@/context/manufacturer-files-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <FileRepairProvider>
        <OrderWorkflowProvider>
          <ManufacturerWorkflowProvider>
            <FileForwardProvider>
              <DesignerFilesProvider>
                <ManufacturerFilesProvider>{children}</ManufacturerFilesProvider>
              </DesignerFilesProvider>
            </FileForwardProvider>
          </ManufacturerWorkflowProvider>
        </OrderWorkflowProvider>
      </FileRepairProvider>
    </AppProvider>
  );
}
