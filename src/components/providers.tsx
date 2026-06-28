"use client";

import { AppProvider } from "@/context/app-context";
import { FileRepairProvider } from "@/context/file-repair-context";
import { FileForwardProvider } from "@/context/file-forward-context";
import { DesignerFilesProvider } from "@/context/designer-files-context";
import { OrderWorkflowProvider } from "@/context/order-workflow-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <FileRepairProvider>
        <OrderWorkflowProvider>
          <FileForwardProvider>
            <DesignerFilesProvider>{children}</DesignerFilesProvider>
          </FileForwardProvider>
        </OrderWorkflowProvider>
      </FileRepairProvider>
    </AppProvider>
  );
}
