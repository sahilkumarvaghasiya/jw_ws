"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { FileUpload } from "@/components/files/file-upload";
import { SellerOrderBrief } from "@/components/designer/seller-order-brief";
import { orders } from "@/lib/mock-data";
import { useFileRepairs } from "@/context/file-repair-context";
import { useDesignerFiles, type PendingUpload } from "@/context/designer-files-context";
import {
  useOrderWorkflow,
  workflowStatusLabels,
  type DesignerWorkflowStatus,
} from "@/context/order-workflow-context";
import type { FileRepairRequest, Order, OrderUrgency } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Info,
  Search,
  Send,
  User,
  Wrench,
  X,
} from "lucide-react";

const CURRENT_DESIGNER = { id: "u2", name: "Sarah Chen" };

type StatusFilter = "all" | DesignerWorkflowStatus;

interface SellerOption {
  id: string;
  name: string;
}

interface RowDraft {
  message: string;
  files: PendingUpload[];
  uploadKey: number;
}

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "in_design", label: "In design" },
  { value: "completed", label: "Completed" },
  { value: "repair", label: "Repair" },
];

const statusBadgeStyles: Record<DesignerWorkflowStatus, string> = {
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  in_design: "bg-gold/10 text-gold-dark",
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  repair: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

function UrgencyBadge({ urgency }: { urgency: OrderUrgency }) {
  const styles: Record<OrderUrgency, string> = {
    urgent: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    normal: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    low: "bg-muted text-muted-foreground border-border",
  };
  const labels: Record<OrderUrgency, string> = {
    urgent: "Urgent",
    normal: "Normal",
    low: "Low",
  };
  return (
    <span
      className={cn(
        "text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wide",
        styles[urgency]
      )}
    >
      {labels[urgency]}
    </span>
  );
}

function SellerMultiSelect({
  options,
  selectedIds,
  onChange,
}: {
  options: SellerOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 220 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updateMenuPosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom + 8, left: rect.left, width: Math.max(rect.width, 220) });
  };

  useEffect(() => {
    if (!open) return;
    updateMenuPosition();
    const onScrollOrResize = () => updateMenuPosition();
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("scroll", onScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter(
    (o) => !query.trim() || o.name.toLowerCase().includes(query.toLowerCase())
  );

  const menu = open ? (
    <div
      ref={menuRef}
      className="fixed z-[200] rounded-xl border border-border bg-card shadow-lg p-2"
      style={{ top: menuPosition.top, left: menuPosition.left, width: menuPosition.width }}
    >
      <div className="relative mb-2">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search seller..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-8 pr-2 py-1.5 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-gold/30"
        />
      </div>
      <div className="max-h-48 overflow-y-auto space-y-0.5">
        {filtered.map((o) => (
          <label
            key={o.id}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted cursor-pointer text-sm"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(o.id)}
              onChange={() =>
                onChange(
                  selectedIds.includes(o.id)
                    ? selectedIds.filter((id) => id !== o.id)
                    : [...selectedIds, o.id]
                )
              }
              className="rounded text-gold focus:ring-gold"
            />
            <span className="truncate">{o.name}</span>
          </label>
        ))}
      </div>
      {selectedIds.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground py-1"
        >
          Clear
        </button>
      )}
    </div>
  ) : null;

  return (
    <div ref={containerRef} className="relative min-w-[140px]">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) setQuery("");
        }}
        className={cn(
          "flex items-center gap-2 w-full px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors",
          open || selectedIds.length > 0 ? "border-gold/40 bg-gold/5" : "border-border bg-background"
        )}
      >
        <User className="w-4 h-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 text-left truncate">
          {selectedIds.length === 0
            ? "All sellers"
            : `${selectedIds.length} seller${selectedIds.length > 1 ? "s" : ""}`}
        </span>
        <ChevronDown className={cn("w-4 h-4 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {typeof document !== "undefined" && menu ? createPortal(menu, document.body) : null}
    </div>
  );
}

interface OrderRowProps {
  order: Order;
  repair?: FileRepairRequest;
  workflowStatus: DesignerWorkflowStatus;
  expanded: boolean;
  onToggle: () => void;
  draft: RowDraft;
  onDraftChange: (draft: RowDraft) => void;
  onApprove: () => void;
  onSend: () => void;
  sendSuccess: boolean;
  approveSuccess: boolean;
  canSend: boolean;
}

function OrderRow({
  order,
  repair,
  workflowStatus,
  expanded,
  onToggle,
  draft,
  onDraftChange,
  onApprove,
  onSend,
  sendSuccess,
  approveSuccess,
  canSend,
}: OrderRowProps) {
  const urgency = order.urgency ?? "urgent";
  const canUpload = workflowStatus === "in_design" || workflowStatus === "repair";
  const isPending = workflowStatus === "pending";

  const removeFile = (index: number) => {
    onDraftChange({ ...draft, files: draft.files.filter((_, i) => i !== index) });
  };

  return (
    <div className={cn("border-b border-border last:border-0", expanded && "bg-muted/20")}>
      <div className="flex items-center gap-2 sm:gap-4 px-4 py-3">
        <button
          type="button"
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          <ChevronDown className={cn("w-4 h-4 transition-transform", expanded && "rotate-180")} />
        </button>

        <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)_auto_auto] gap-1 sm:gap-4 sm:items-center">
          <p className="text-sm font-medium truncate">{order.orderNumber}</p>
          <p className="text-sm text-muted-foreground truncate hidden sm:block">{order.title}</p>
          <p className="text-xs text-muted-foreground truncate hidden sm:block">{order.seller.name}</p>
          <span
            className={cn(
              "hidden sm:inline-flex text-xs font-medium px-2 py-0.5 rounded-full",
              statusBadgeStyles[workflowStatus]
            )}
          >
            {workflowStatusLabels[workflowStatus]}
          </span>
          <UrgencyBadge urgency={urgency} />
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-gold transition-colors shrink-0"
          aria-label="View details"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      <div className="px-4 pb-2 sm:hidden -mt-1">
        <p className="text-xs text-muted-foreground truncate">{order.title}</p>
        <p className="text-xs text-muted-foreground">
          {order.seller.name} · {workflowStatusLabels[workflowStatus]}
        </p>
      </div>

      {expanded && (
        <div className="px-4 pb-5 pt-1 space-y-4 border-t border-border/60 mx-4 mb-3 rounded-b-xl">
          {workflowStatus === "pending" && (
            <div className="p-3 rounded-xl border border-amber-500/25 bg-amber-500/5 text-sm text-amber-800 dark:text-amber-300">
              New order from seller. Review requirements, download reference files, then approve to
              start designing. Status updates to <strong>In design</strong> for you and the seller.
            </div>
          )}

          {repair && (
            <div className="p-3 rounded-xl border border-orange-500/25 bg-orange-500/5 space-y-1.5">
              <p className="text-sm font-medium flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <AlertCircle className="w-4 h-4" />
                Seller sent this for repair — {repair.fileName}
              </p>
              {repair.notes.map((note, i) => (
                <p key={i} className="text-sm text-muted-foreground pl-6">
                  {note}
                </p>
              ))}
            </div>
          )}

          <SellerOrderBrief order={order} />

          {isPending && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Button onClick={onApprove} className="sm:w-auto w-full">
                <CheckCircle2 className="w-4 h-4" />
                Approve order
              </Button>
              {approveSuccess && (
                <span className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Approved — status is now In design
                </span>
              )}
            </div>
          )}

          {canUpload && (
            <div className="rounded-xl border border-border bg-background p-4 space-y-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Deliver to seller
              </p>

              <Textarea
                label="Message (WhatsApp)"
                rows={3}
                placeholder="Your message will be sent to the seller's WhatsApp..."
                value={draft.message}
                onChange={(e) => onDraftChange({ ...draft, message: e.target.value })}
              />

              <FileUpload
                key={draft.uploadKey}
                accept=".stl,.3dm,image/*"
                label="Design files"
                description="STL, 3DM, or preview images for this order"
                onFilesSelected={(files) => {
                  const mapped: PendingUpload[] = Array.from(files).map((f) => ({
                    name: f.name,
                    size: f.size,
                    type: f.type,
                    preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
                  }));
                  onDraftChange({ ...draft, files: [...draft.files, ...mapped] });
                }}
              />

              {draft.files.length > 0 && (
                <div className="space-y-1.5">
                  {draft.files.map((file, i) => (
                    <div
                      key={`${file.name}-${i}`}
                      className="flex items-center justify-between gap-2 text-sm px-3 py-2 rounded-lg bg-muted/50"
                    >
                      <span className="truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="p-1 rounded hover:bg-muted shrink-0"
                      >
                        <X className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                <Button onClick={onSend} disabled={!canSend} className="sm:w-auto w-full">
                  <Send className="w-4 h-4" />
                  {workflowStatus === "repair"
                    ? "Send repair & notify seller"
                    : "Send to seller via WhatsApp"}
                </Button>
                {sendSuccess && (
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Sent — seller notified · status Completed
                  </span>
                )}
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Received {formatDateTime(order.createdAt)} · Seller: {order.seller.name}
          </p>
        </div>
      )}
    </div>
  );
}

const emptyDraft = (): RowDraft => ({ message: "", files: [], uploadKey: 0 });

export function DesignerWorkspace() {
  const { getPendingRepairsForDesigner, resolveRepairRequest } = useFileRepairs();
  const { submitToSeller } = useDesignerFiles();
  const { getStatus, approveOrder, markDelivered } = useOrderWorkflow();

  const [selectedSellerIds, setSelectedSellerIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, RowDraft>>({});
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());

  const designerOrders = useMemo(
    () => orders.filter((o) => o.designer?.id === CURRENT_DESIGNER.id),
    []
  );

  const sellerOptions = useMemo(() => {
    const map = new Map<string, SellerOption>();
    designerOrders.forEach((o) => map.set(o.seller.id, { id: o.seller.id, name: o.seller.name }));
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [designerOrders]);

  const repairByOrder = useMemo(() => {
    const pending = getPendingRepairsForDesigner();
    const map = new Map<string, FileRepairRequest>();
    pending.forEach((r) => {
      if (designerOrders.some((o) => o.id === r.orderId)) map.set(r.orderId, r);
    });
    return map;
  }, [getPendingRepairsForDesigner, designerOrders]);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return designerOrders
      .filter((order) => {
        const repair = repairByOrder.has(order.id);
        const workflowStatus = getStatus(order.id, repair, order.status);
        const matchesSeller =
          selectedSellerIds.length === 0 || selectedSellerIds.includes(order.seller.id);
        const matchesStatus = statusFilter === "all" || workflowStatus === statusFilter;
        const matchesSearch =
          !q ||
          order.orderNumber.toLowerCase().includes(q) ||
          order.seller.name.toLowerCase().includes(q) ||
          order.title.toLowerCase().includes(q);
        return matchesSeller && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        const urgencyOrder = { urgent: 0, normal: 1, low: 2 };
        const ua = urgencyOrder[a.urgency ?? "urgent"];
        const ub = urgencyOrder[b.urgency ?? "urgent"];
        if (ua !== ub) return ua - ub;
        return b.updatedAt.localeCompare(a.updatedAt);
      });
  }, [designerOrders, selectedSellerIds, statusFilter, searchQuery, repairByOrder, getStatus]);

  const getDraft = (orderId: string): RowDraft => drafts[orderId] ?? emptyDraft();

  const handleApprove = (orderId: string) => {
    approveOrder(orderId);
    setApprovedIds((prev) => new Set(prev).add(orderId));
    setTimeout(() => {
      setApprovedIds((prev) => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }, 3000);
  };

  const handleSend = (order: Order, repair?: FileRepairRequest) => {
    const draft = getDraft(order.id);
    const hasContent = draft.message.trim().length > 0 || draft.files.length > 0;
    if (!hasContent) return;

    submitToSeller({
      order,
      files: draft.files,
      message: draft.message,
      designerName: CURRENT_DESIGNER.name,
      designerId: CURRENT_DESIGNER.id,
    });

    if (repair) resolveRepairRequest(repair.id);
    markDelivered(order.id);

    setDrafts((prev) => ({
      ...prev,
      [order.id]: { message: "", files: [], uploadKey: (prev[order.id]?.uploadKey ?? 0) + 1 },
    }));
    setSentIds((prev) => new Set(prev).add(order.id));
    setTimeout(() => {
      setSentIds((prev) => {
        const next = new Set(prev);
        next.delete(order.id);
        return next;
      });
    }, 4000);
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-[var(--shadow-sm)] overflow-visible">
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search order ID or seller name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:bg-background transition-colors"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <SellerMultiSelect
              options={sellerOptions}
              selectedIds={selectedSellerIds}
              onChange={setSelectedSellerIds}
            />
            <div className="relative min-w-[160px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="w-full px-3 py-2.5 pr-9 rounded-xl border border-border bg-background text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/30"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground sm:ml-auto">
              {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-[var(--shadow-sm)] overflow-hidden">
        <div className="hidden sm:grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)_auto_auto_auto] gap-4 px-4 py-3 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <span className="w-8" />
          <span>Order</span>
          <span>Product</span>
          <span>Seller</span>
          <span>Status</span>
          <span>Urgency</span>
          <span className="w-8" />
        </div>

        {filteredOrders.length === 0 ? (
          <p className="p-10 text-sm text-muted-foreground text-center">No orders match your filters.</p>
        ) : (
          filteredOrders.map((order) => {
            const repair = repairByOrder.get(order.id);
            const workflowStatus = getStatus(order.id, !!repair, order.status);
            const draft = getDraft(order.id);
            const canSend = draft.message.trim().length > 0 || draft.files.length > 0;
            return (
              <OrderRow
                key={order.id}
                order={order}
                repair={repair}
                workflowStatus={workflowStatus}
                expanded={expandedId === order.id}
                onToggle={() => setExpandedId((id) => (id === order.id ? null : order.id))}
                draft={draft}
                onDraftChange={(d) => setDrafts((prev) => ({ ...prev, [order.id]: d }))}
                onApprove={() => handleApprove(order.id)}
                onSend={() => handleSend(order, repair)}
                sendSuccess={sentIds.has(order.id)}
                approveSuccess={approvedIds.has(order.id)}
                canSend={canSend}
              />
            );
          })
        )}
      </Card>
    </div>
  );
}
