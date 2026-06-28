"use client";

import { useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { ManufacturerWorkspace } from "@/components/manufacturer/manufacturer-workspace";
import { orders } from "@/lib/mock-data";
import { useFileForwards } from "@/context/file-forward-context";
import {
  manufacturerStatusLabels,
  useManufacturerWorkflow,
} from "@/context/manufacturer-workflow-context";
import { Clock, Factory, PackageCheck } from "lucide-react";

const CURRENT_MANUFACTURER_ID = "u4";

export default function ManufacturerDashboard() {
  const { getPackagesForManufacturer } = useFileForwards();
  const { getStatus } = useManufacturerWorkflow();

  const manufacturerOrders = useMemo(() => {
    const forwardPackages = getPackagesForManufacturer(CURRENT_MANUFACTURER_ID);
    const orderIds = new Set<string>();
    orders
      .filter((o) => o.manufacturer?.id === CURRENT_MANUFACTURER_ID)
      .forEach((o) => orderIds.add(o.id));
    forwardPackages.forEach((pkg) => orderIds.add(pkg.orderId));
    return orders.filter((o) => orderIds.has(o.id));
  }, [getPackagesForManufacturer]);

  const counts = useMemo(() => {
    let pending = 0;
    let inProduction = 0;
    let ready = 0;
    manufacturerOrders.forEach((o) => {
      const s = getStatus(o.id);
      if (s === "pending") pending++;
      else if (s === "in_production") inProduction++;
      else ready++;
    });
    return { pending, inProduction, ready };
  }, [manufacturerOrders, getStatus]);

  return (
    <DashboardLayout
      title="Manufacturer Dashboard"
      description="Accept production requests, manufacture, and notify sellers when ready for pickup"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title={manufacturerStatusLabels.pending} value={counts.pending} icon={Clock} delay={0} />
        <StatCard
          title={manufacturerStatusLabels.in_production}
          value={counts.inProduction}
          icon={Factory}
          delay={0.1}
        />
        <StatCard
          title={manufacturerStatusLabels.ready_for_pickup}
          value={counts.ready}
          icon={PackageCheck}
          delay={0.2}
        />
      </div>

      <ManufacturerWorkspace />
    </DashboardLayout>
  );
}
