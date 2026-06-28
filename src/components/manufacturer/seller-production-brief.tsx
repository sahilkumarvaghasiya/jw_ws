"use client";

import type { OrderFile } from "@/lib/types";
import { SellerAttachments } from "@/components/designer/seller-order-brief";
import { formatDate } from "@/lib/utils";

interface SellerProductionBriefProps {
  order: {
    orderNumber: string;
    title: string;
    description: string;
    requirements: string;
    designFiles: OrderFile[];
    previewImages: OrderFile[];
    referenceImages: OrderFile[];
  };
  sellerNote?: string;
  sellerPreferredDate?: string;
  manufacturingDeadline?: string;
}

function BriefField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm mt-0.5 font-medium">{value?.trim() || "—"}</dd>
    </div>
  );
}

export function SellerProductionBrief({
  order,
  sellerNote,
  sellerPreferredDate,
  manufacturingDeadline,
}: SellerProductionBriefProps) {
  const productionFiles = [
    ...order.designFiles,
    ...order.previewImages,
    ...order.referenceImages,
  ];

  return (
    <div className="rounded-xl border border-border bg-muted/20 divide-y divide-border overflow-hidden">
      {(sellerNote || sellerPreferredDate) && (
        <section className="p-4 sm:p-5 bg-blue-500/5">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Message from seller
          </h3>
          {sellerPreferredDate && (
            <p className="text-sm mb-2">
              <span className="text-muted-foreground">Requested by: </span>
              <span className="font-medium">{formatDate(sellerPreferredDate)}</span>
            </p>
          )}
          {sellerNote && <p className="text-sm leading-relaxed">{sellerNote}</p>}
        </section>
      )}

      {manufacturingDeadline && (
        <section className="p-4 sm:p-5">
          <BriefField label="Your manufacturing deadline" value={formatDate(manufacturingDeadline)} />
        </section>
      )}

      <section className="p-4 sm:p-5">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Production details
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
          Files from seller
        </h3>
        <SellerAttachments files={productionFiles} />
      </section>
    </div>
  );
}
