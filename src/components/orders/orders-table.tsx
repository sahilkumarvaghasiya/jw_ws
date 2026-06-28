"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Eye } from "lucide-react";
import { useState } from "react";

interface OrdersTableProps {
  orders: Order[];
  showSeller?: boolean;
  showDesigner?: boolean;
}

const statusFilters: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Design", value: "in_design" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Completed", value: "completed" },
];

export function OrdersTable({ orders, showSeller, showDesigner }: OrdersTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [sortField, setSortField] = useState<"createdAt" | "orderNumber">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = orders
    .filter((o) => {
      const matchesSearch =
        o.title.toLowerCase().includes(search.toLowerCase()) ||
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aVal = sortField === "createdAt" ? a.createdAt : a.orderNumber;
      const bVal = sortField === "createdAt" ? b.createdAt : b.orderNumber;
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  const toggleSort = (field: "createdAt" | "orderNumber") => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
        />
        <div className="flex gap-2 overflow-x-auto">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                statusFilter === f.value
                  ? "bg-gold/10 text-gold-dark"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

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
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
                {showSeller && <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Seller</th>}
                {showDesigner && <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Designer</th>}
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Progress</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">
                  <button onClick={() => toggleSort("createdAt")} className="flex items-center gap-1 hover:text-foreground">
                    Date <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{order.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">{order.customer.name}</td>
                  {showSeller && <td className="px-4 py-4 text-muted-foreground hidden lg:table-cell">{order.seller.name}</td>}
                  {showDesigner && <td className="px-4 py-4 text-muted-foreground hidden lg:table-cell">{order.designer?.name || "—"}</td>}
                  <td className="px-4 py-4"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-4 hidden md:table-cell w-32"><Progress value={order.progress} /></td>
                  <td className="px-4 py-4 text-muted-foreground hidden sm:table-cell">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-4 text-right">
                    <Link href={`/orders/${order.id}`} className="inline-flex p-2 rounded-lg hover:bg-muted transition-colors text-gold">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No orders found</div>
        )}
      </div>
    </div>
  );
}
