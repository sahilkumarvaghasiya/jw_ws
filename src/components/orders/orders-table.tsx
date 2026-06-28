"use client";

import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { StatusBadge, DesignerStatusBadge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatDate, getOrderDraftStep, orderStatusDescriptions } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";
import { designers, manufacturers } from "@/lib/mock-data";
import { useFileRepairs } from "@/context/file-repair-context";
import { useOrderWorkflow } from "@/context/order-workflow-context";
import { ArrowUpDown, ChevronDown, Factory, Palette, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface OrdersTableProps {
  orders: Order[];
  showSeller?: boolean;
  showDesigner?: boolean;
  showManufacturer?: boolean;
  showTeamFilter?: boolean;
  designerView?: boolean;
  limit?: number;
  resumePendingOrders?: boolean;
}

type TeamFilterMode = "designer" | "manufacturer";

type DesignerStatusFilter = "all" | "pending" | "in_design" | "completed" | "repair";

const statusFilters: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Design", value: "in_design" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Completed", value: "completed" },
];

const designerStatusFilters: { label: string; value: DesignerStatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In design", value: "in_design" },
  { label: "Completed", value: "completed" },
  { label: "Repair", value: "repair" },
];

interface TeamMemberOption {
  id: string;
  name: string;
  email: string;
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
        active
          ? "bg-gold text-white shadow-sm"
          : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
      )}
    >
      {children}
    </button>
  );
}

function PersonFilter({
  mode,
  options,
  selectedIds,
  onChange,
}: {
  mode: TeamFilterMode;
  options: TeamMemberOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 224 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updateMenuPosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 8,
      left: rect.left,
      width: Math.max(rect.width, 224),
    });
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
    (o) =>
      !query.trim() ||
      o.name.toLowerCase().includes(query.toLowerCase()) ||
      o.email.toLowerCase().includes(query.toLowerCase())
  );

  const label = mode === "designer" ? "Designer" : "Manufacturer";

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
          placeholder={`Search ${label.toLowerCase()}...`}
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
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) setQuery("");
        }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:text-foreground transition-colors"
      >
        {label}
        {selectedIds.length > 0 && (
          <span className="bg-gold/20 text-gold-dark px-1.5 rounded-full">{selectedIds.length}</span>
        )}
        <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
      </button>
      {typeof document !== "undefined" && menu ? createPortal(menu, document.body) : null}
    </div>
  );
}

export function OrdersTable({
  orders,
  showSeller,
  showDesigner,
  showManufacturer,
  showTeamFilter,
  designerView,
  limit,
  resumePendingOrders,
}: OrdersTableProps) {
  const router = useRouter();
  const { getPendingRepairsForDesigner } = useFileRepairs();
  const { getStatus } = useOrderWorkflow();
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [designerStatusFilter, setDesignerStatusFilter] = useState<DesignerStatusFilter>("all");
  const [sortField, setSortField] = useState<"createdAt" | "orderNumber">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [teamFilterMode, setTeamFilterMode] = useState<TeamFilterMode>("designer");
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);

  const teamOptions = teamFilterMode === "designer" ? designers : manufacturers;

  const handleRowClick = (order: Order) => {
    if (resumePendingOrders && order.status === "pending") {
      const step = getOrderDraftStep(order);
      router.push(`/orders/new?draft=${order.id}&step=${step}`);
    }
  };

  const repairOrderIds = useMemo(() => {
    if (!designerView) return new Set<string>();
    const pending = getPendingRepairsForDesigner();
    return new Set(pending.map((r) => r.orderId));
  }, [designerView, getPendingRepairsForDesigner]);

  const getDesignerOrderStatus = (order: Order) =>
    getStatus(order.id, repairOrderIds.has(order.id), order.status);

  const filtered = orders
    .filter((o) => {
      const query = search.toLowerCase();
      const matchesSearch = designerView
        ? !query ||
          o.title.toLowerCase().includes(query) ||
          o.orderNumber.toLowerCase().includes(query) ||
          o.seller.name.toLowerCase().includes(query)
        : o.title.toLowerCase().includes(query) ||
          o.orderNumber.toLowerCase().includes(query) ||
          o.customer.name.toLowerCase().includes(query);

      const matchesStatus = designerView
        ? designerStatusFilter === "all" || getDesignerOrderStatus(o) === designerStatusFilter
        : statusFilter === "all" || o.status === statusFilter;

      const matchesTeam =
        !showTeamFilter ||
        selectedTeamIds.length === 0 ||
        (teamFilterMode === "designer"
          ? o.designer && selectedTeamIds.includes(o.designer.id)
          : o.manufacturer && selectedTeamIds.includes(o.manufacturer.id));

      return matchesSearch && matchesStatus && matchesTeam;
    })
    .sort((a, b) => {
      const aVal = sortField === "createdAt" ? a.createdAt : a.orderNumber;
      const bVal = sortField === "createdAt" ? b.createdAt : b.orderNumber;
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  const toggleSort = (field: "createdAt" | "orderNumber") => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const showDesignerColumn = !!showDesigner;
  const showManufacturerColumn = !!showManufacturer;

  const activeFilterCount = designerView
    ? (designerStatusFilter !== "all" ? 1 : 0)
    : (statusFilter !== "all" ? 1 : 0) +
      selectedTeamIds.length +
      (showTeamFilter && teamFilterMode !== "designer" ? 1 : 0);

  return (
    <div className="space-y-4">
      <Card className="overflow-visible shadow-[var(--shadow-sm)]">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                placeholder={
                  designerView
                    ? "Search order ID, seller, or product..."
                    : "Search order ID, customer, or product..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:bg-background transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowFilters((v) => !v)}
                className={cn(showFilters && "border-gold/40 bg-gold/5")}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 bg-gold text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {displayed.length} order{displayed.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {showFilters && (
            <div className="pt-3 border-t border-border flex flex-col gap-3 overflow-visible">
              <div className="flex flex-wrap gap-2">
                {(designerView ? designerStatusFilters : statusFilters).map((f) => (
                  <FilterChip
                    key={f.value}
                    active={
                      designerView
                        ? designerStatusFilter === f.value
                        : statusFilter === f.value
                    }
                    onClick={() =>
                      designerView
                        ? setDesignerStatusFilter(f.value as DesignerStatusFilter)
                        : setStatusFilter(f.value as OrderStatus | "all")
                    }
                  >
                    {f.label}
                  </FilterChip>
                ))}
              </div>

              {showTeamFilter && (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex rounded-full border border-border p-0.5 bg-muted/40">
                    <button
                      type="button"
                      onClick={() => {
                        setTeamFilterMode("designer");
                        setSelectedTeamIds([]);
                      }}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                        teamFilterMode === "designer"
                          ? "bg-background shadow-sm text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      <Palette className="w-3 h-3" />
                      Designer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTeamFilterMode("manufacturer");
                        setSelectedTeamIds([]);
                      }}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                        teamFilterMode === "manufacturer"
                          ? "bg-background shadow-sm text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      <Factory className="w-3 h-3" />
                      Manufacturer
                    </button>
                  </div>
                  <PersonFilter
                    key={teamFilterMode}
                    mode={teamFilterMode}
                    options={teamOptions}
                    selectedIds={selectedTeamIds}
                    onChange={setSelectedTeamIds}
                  />
                </div>
              )}

              {resumePendingOrders && (
                <p className="text-xs text-muted-foreground">
                  Click a pending order to continue where you left off in create order.
                </p>
              )}
              {statusFilter === "pending" && orderStatusDescriptions.pending && (
                <p className="text-xs text-muted-foreground">{orderStatusDescriptions.pending}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="rounded-[12px] border border-border bg-card overflow-hidden shadow-[var(--shadow-sm)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  <button onClick={() => toggleSort("orderNumber")} className="flex items-center gap-1 hover:text-foreground">
                    Order <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  {designerView ? "Product" : "Customer"}
                </th>
                {showSeller && <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Seller</th>}
                {showDesignerColumn && (
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Designer</th>
                )}
                {showManufacturerColumn && (
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Manufacturer</th>
                )}
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                {!designerView && (
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Progress</th>
                )}
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                  <button onClick={() => toggleSort("createdAt")} className="flex items-center gap-1 hover:text-foreground">
                    Date <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((order) => {
                const isPendingResume = resumePendingOrders && order.status === "pending";

                return (
                <tr
                  key={order.id}
                  onClick={() => handleRowClick(order)}
                  className={cn(
                    "border-b border-border last:border-0 transition-colors",
                    isPendingResume ? "cursor-pointer hover:bg-gold/5" : "hover:bg-muted/30"
                  )}
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{order.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {designerView ? order.title : order.customer.name}
                  </td>
                  {showSeller && <td className="px-4 py-4 text-muted-foreground hidden lg:table-cell">{order.seller.name}</td>}
                  {showDesignerColumn && (
                    <td className="px-4 py-4 text-muted-foreground hidden lg:table-cell">{order.designer?.name || "—"}</td>
                  )}
                  {showManufacturerColumn && (
                    <td className="px-4 py-4 text-muted-foreground hidden lg:table-cell">{order.manufacturer?.name || "—"}</td>
                  )}
                  <td className="px-4 py-4">
                    {designerView ? (
                      <DesignerStatusBadge status={getDesignerOrderStatus(order)} />
                    ) : (
                      <StatusBadge status={order.status} />
                    )}
                  </td>
                  {!designerView && (
                    <td className="px-4 py-4 hidden md:table-cell w-32"><Progress value={order.progress} /></td>
                  )}
                  <td className="px-4 py-4 text-muted-foreground hidden sm:table-cell">{formatDate(order.createdAt)}</td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {displayed.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No orders found</div>
        )}
      </div>
    </div>
  );
}
