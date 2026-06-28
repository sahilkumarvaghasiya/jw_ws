"use client";

import { useState } from "react";
import type { OrderFile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils";
import { Download, FileIcon, ImageIcon, Loader2 } from "lucide-react";

interface SellerAttachmentsProps {
  files: OrderFile[];
}

function simulateDownloadFromStorage(file: OrderFile): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (file.url && file.url !== "#") {
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.name;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.click();
      }
      resolve();
    }, 600);
  });
}

export function SellerAttachments({ files }: SellerAttachmentsProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set());

  const handleDownload = async (file: OrderFile) => {
    setDownloadingId(file.id);
    await simulateDownloadFromStorage(file);
    setDownloadedIds((prev) => new Set(prev).add(file.id));
    setDownloadingId(null);
  };

  if (files.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-border bg-background/50 text-sm text-muted-foreground">
        <ImageIcon className="w-5 h-5 shrink-0 opacity-50" />
        No files from the seller yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => {
        const isLoading = downloadingId === file.id;
        const isImage = file.type === "jpg" || file.type === "png" || file.type === "reference";

        return (
          <div
            key={file.id}
            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background/50"
          >
            <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
              {isImage ? (
                <ImageIcon className="w-4 h-4 text-gold" />
              ) : (
                <FileIcon className="w-4 h-4 text-gold" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {file.type.toUpperCase()} · {formatFileSize(file.size)}
                {downloadedIds.has(file.id) && " · Downloaded"}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleDownload(file)}
              disabled={isLoading}
              className="shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              Download
            </Button>
          </div>
        );
      })}
    </div>
  );
}

interface SellerOrderBriefProps {
  order: {
    orderNumber: string;
    title: string;
    description: string;
    requirements: string;
    referenceImages: OrderFile[];
  };
}

function BriefField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm mt-0.5 font-medium">{value?.trim() || "—"}</dd>
    </div>
  );
}

export function SellerOrderBrief({ order }: SellerOrderBriefProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 divide-y divide-border overflow-hidden">
      <section className="p-4 sm:p-5">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Jewelry requirements
        </h3>
        <dl className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            <BriefField label="Order ID" value={order.orderNumber} />
            <BriefField label="Order title" value={order.title} />
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Description</dt>
            <dd className="text-sm mt-0.5 leading-relaxed">{order.description || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Technical requirements</dt>
            <dd className="text-sm mt-0.5 leading-relaxed whitespace-pre-wrap">
              {order.requirements || "—"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="p-4 sm:p-5">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Seller files
        </h3>
        <SellerAttachments files={order.referenceImages} />
      </section>
    </div>
  );
}
