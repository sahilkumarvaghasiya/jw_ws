"use client";

import { useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { DesignerWorkspace } from "@/components/designer/designer-workspace";
import { orders } from "@/lib/mock-data";
import { useFileRepairs } from "@/context/file-repair-context";
import { useOrderWorkflow } from "@/context/order-workflow-context";
import { Package, Clock, Wrench, CheckCircle } from "lucide-react";

const CURRENT_DESIGNER_ID = "u2";

export default function DesignerDashboard() {
  const { getPendingRepairsForDesigner } = useFileRepairs();
  const { getStatus } = useOrderWorkflow();

  const designerOrders = useMemo(
    () => orders.filter((o) => o.designer?.id === CURRENT_DESIGNER_ID),
    []
  );

  const repairByOrder = useMemo(() => {
    const pending = getPendingRepairsForDesigner();
    return new Set(pending.map((r) => r.orderId));
  }, [getPendingRepairsForDesigner]);

  const counts = useMemo(() => {
    let pending = 0;
    let inDesign = 0;
    let repair = 0;
    let completed = 0;
    designerOrders.forEach((o) => {
      const hasRepair = repairByOrder.has(o.id);
      const s = getStatus(o.id, hasRepair, o.status);
      if (s === "pending") pending++;
      else if (s === "in_design") inDesign++;
      else if (s === "repair") repair++;
      else completed++;
    });
    return { pending, inDesign, repair, completed };
  }, [designerOrders, repairByOrder, getStatus]);

  return (
    <DashboardLayout
      title="Designer Dashboard"
      description="Approve orders, design, and deliver files to sellers"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Pending" value={counts.pending} icon={Package} delay={0} />
        <StatCard title="In Design" value={counts.inDesign} icon={Clock} delay={0.1} />
        <StatCard title="Repair" value={counts.repair} icon={Wrench} delay={0.2} />
        <StatCard title="Completed" value={counts.completed} icon={CheckCircle} delay={0.3} />
      </div>

      <DesignerWorkspace />
    </DashboardLayout>
  );
}
