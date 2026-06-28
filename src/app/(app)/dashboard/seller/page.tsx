"use client";

import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { MonthlyOrderChart, RecentActivity } from "@/components/dashboard/charts";
import { OrdersTable } from "@/components/orders/orders-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { dashboardStats, orders, monthlyOrderData } from "@/lib/mock-data";
import {
  Package,
  Clock,
  Palette,
  Factory,
  CheckCircle,
  Plus,
} from "lucide-react";

export default function SellerDashboard() {
  const recentActivities = orders[0]?.activity || [];

  return (
    <DashboardLayout
      title="Seller Dashboard"
      description="Manage your jewelry orders and track progress"
      actions={
        <Link href="/orders/new">
          <Button>
            <Plus className="w-4 h-4" />
            New Order
          </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Orders" value={dashboardStats.totalOrders} change="+12% from last month" trend="up" icon={Package} delay={0} />
        <StatCard title="Pending" value={dashboardStats.pendingOrders} icon={Clock} delay={0.1} />
        <StatCard title="In Design" value={dashboardStats.inDesign} icon={Palette} delay={0.2} />
        <StatCard title="Manufacturing" value={dashboardStats.manufacturing} icon={Factory} delay={0.3} />
        <StatCard title="Completed" value={dashboardStats.completedOrders} change="+8% from last month" trend="up" icon={CheckCircle} delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <MonthlyOrderChart data={monthlyOrderData} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Order Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderTimeline currentStatus="in_design" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link href="/orders">
                <Button variant="ghost" size="sm">View all</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <OrdersTable orders={orders.slice(0, 5)} showDesigner />
            </CardContent>
          </Card>
        </div>
        <RecentActivity activities={recentActivities} />
      </div>
    </DashboardLayout>
  );
}
