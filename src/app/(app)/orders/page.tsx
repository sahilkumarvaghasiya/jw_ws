"use client";

import Link from "next/link";
import { useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { OrdersTable } from "@/components/orders/orders-table";
import { Button } from "@/components/ui/button";
import { orders } from "@/lib/mock-data";
import { useFileForwards } from "@/context/file-forward-context";
import { Plus } from "lucide-react";
import { useApp } from "@/context/app-context";

const CURRENT_DESIGNER_ID = "u2";
const CURRENT_MANUFACTURER_ID = "u4";

export default function OrdersPage() {
  const { role } = useApp();
  const { getPackagesForManufacturer } = useFileForwards();

  const tableOrders = useMemo(() => {
    if (role === "designer") {
      return orders.filter((o) => o.designer?.id === CURRENT_DESIGNER_ID);
    }
    if (role === "manufacturer") {
      const forwardPackages = getPackagesForManufacturer(CURRENT_MANUFACTURER_ID);
      const orderIds = new Set<string>();
      orders
        .filter((o) => o.manufacturer?.id === CURRENT_MANUFACTURER_ID)
        .forEach((o) => orderIds.add(o.id));
      forwardPackages.forEach((pkg) => orderIds.add(pkg.orderId));
      return orders.filter((o) => orderIds.has(o.id));
    }
    return orders;
  }, [role, getPackagesForManufacturer]);

  const description =
    role === "designer"
      ? "Your design orders with sellers"
      : role === "manufacturer"
        ? "Production orders from sellers"
        : "View and manage all jewelry orders";

  return (
    <DashboardLayout
      title="Orders"
      description={description}
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
        showDesigner={role === "seller"}
        showManufacturer={role === "seller"}
        showTeamFilter={role === "seller"}
        designerView={role === "designer"}
        manufacturerView={role === "manufacturer"}
        sellerManufacturingView={role === "seller"}
        resumePendingOrders={role === "seller"}
      />
    </DashboardLayout>
  );
}
