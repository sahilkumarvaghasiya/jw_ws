"use client";

import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { OrdersTable } from "@/components/orders/orders-table";
import { Button } from "@/components/ui/button";
import { orders } from "@/lib/mock-data";
import { Plus } from "lucide-react";
import { useApp } from "@/context/app-context";

export default function OrdersPage() {
  const { role } = useApp();

  return (
    <DashboardLayout
      title="Orders"
      description="View and manage all jewelry orders"
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
        orders={orders}
        showSeller={role !== "seller"}
        showDesigner={role !== "designer"}
      />
    </DashboardLayout>
  );
}
