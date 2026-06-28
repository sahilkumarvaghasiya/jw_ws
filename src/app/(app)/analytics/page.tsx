"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  MonthlyOrderChart,
  OrderProgressChart,
  TeamPerformance,
  RecentActivity,
} from "@/components/dashboard/charts";
import { dashboardStats, monthlyOrderData, orderProgressData, teamPerformance, orders } from "@/lib/mock-data";
import {
  Package,
  Clock,
  Palette,
  Factory,
  CheckCircle,
} from "lucide-react";

export default function AnalyticsPage() {
  const allActivity = orders.flatMap((o) => o.activity).slice(0, 6);

  return (
    <DashboardLayout
      title="Analytics"
      description="Insights and performance metrics for your jewelry business"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Orders" value={dashboardStats.totalOrders} change="+12% from last month" trend="up" icon={Package} />
        <StatCard title="Pending" value={dashboardStats.pendingOrders} icon={Clock} />
        <StatCard title="In Design" value={dashboardStats.inDesign} icon={Palette} />
        <StatCard title="Manufacturing" value={dashboardStats.manufacturing} icon={Factory} />
        <StatCard title="Completed" value={dashboardStats.completedOrders} change="+8% from last month" trend="up" icon={CheckCircle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <MonthlyOrderChart data={monthlyOrderData} />
        <OrderProgressChart data={orderProgressData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamPerformance data={teamPerformance} />
        <RecentActivity activities={allActivity} />
      </div>
    </DashboardLayout>
  );
}
