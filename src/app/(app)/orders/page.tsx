"use client";

import Link from "next/link";
import { useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { OrdersTable } from "@/components/orders/orders-table";
import { Button } from "@/components/ui/button";
import { orders } from "@/lib/mock-data";
import { Plus } from "lucide-react";
import { useApp } from "@/context/app-context";

const CURRENT_DESIGNER_ID = "u2";

export default function OrdersPage() {
  const { role } = useApp();

  const tableOrders = useMemo(() => {
    if (role !== "designer") return orders;
    return orders.filter((o) => o.designer?.id === CURRENT_DESIGNER_ID);
  }, [role]);

  return (
    <DashboardLayout
      title="Orders"
      description={
        role === "designer"
          ? "Your design orders with sellers"
          : "View and manage all jewelry orders"
      }
      actions={
        role === "seller" ? (
          <Link href="/orders/new">
            <Button>
              <Plus className="w-4 h-4" />
              New Order
            </Button>
          </Link>
        ) : undefined
      }
    >
      <OrdersTable
        orders={tableOrders}
        showSeller={role !== "seller"}
        showDesigner={role !== "designer"}
        showManufacturer={role === "seller"}
        showTeamFilter={role === "seller"}
        designerView={role === "designer"}
        resumePendingOrders={role === "seller"}
      />
    </DashboardLayout>
  );
}
