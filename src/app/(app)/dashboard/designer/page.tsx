"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { OrdersTable } from "@/components/orders/orders-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload, ImageGallery } from "@/components/files/file-upload";
import { CommentsSection } from "@/components/orders/comments-section";
import { orders } from "@/lib/mock-data";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

export default function DesignerDashboard() {
  const assignedOrders = orders.filter((o) => o.designer?.name === "Sarah Chen" || o.status === "assigned");
  const pendingAcceptance = orders.filter((o) => o.status === "assigned");
  const inProgress = orders.filter((o) => o.status === "in_design");

  return (
    <DashboardLayout
      title="Designer Dashboard"
      description="View assigned orders and upload design files"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Assigned Orders" value={assignedOrders.length} icon={Package} />
        <StatCard title="Pending Acceptance" value={pendingAcceptance.length} icon={Clock} />
        <StatCard title="In Progress" value={inProgress.length} icon={CheckCircle} />
      </div>

      {pendingAcceptance.length > 0 && (
        <Card className="mb-8 border-gold/30">
          <CardHeader>
            <CardTitle>Pending Acceptance</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingAcceptance.map((order) => (
              <div key={order.id} className="flex flex-col lg:flex-row gap-6 p-4 rounded-xl bg-muted/30 mb-4 last:mb-0">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{order.orderNumber}</h3>
                    <span className="text-sm text-muted-foreground">— {order.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{order.description}</p>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Seller:</span> {order.seller.name}</p>
                    <p><span className="text-muted-foreground">Requirements:</span> {order.requirements}</p>
                  </div>
                  {order.referenceImages.length > 0 && (
                    <div className="mt-4 max-w-xs">
                      <ImageGallery images={order.referenceImages.map((img) => ({ id: img.id, url: img.url, name: img.name }))} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 lg:w-48">
                  <Button>Accept Order</Button>
                  <Button variant="outline">
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Design Files</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload
              accept=".stl,.3dm,image/*"
              label="Upload STL, 3DM, or Preview Images"
              description="Drag and drop design files for the active order"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Version History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { version: 2, file: "diamond-ring-v2.stl", date: "Jun 25, 2024", user: "Sarah Chen" },
                { version: 1, file: "diamond-ring-v1.stl", date: "Jun 23, 2024", user: "Sarah Chen" },
              ].map((v) => (
                <div key={v.version} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{v.file}</p>
                    <p className="text-xs text-muted-foreground">v{v.version} · {v.date} · {v.user}</p>
                  </div>
                  <Button variant="ghost" size="sm">Download</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>My Assigned Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTable orders={assignedOrders} showSeller />
        </CardContent>
      </Card>

      <CommentsSection comments={orders[0]?.comments || []} />
    </DashboardLayout>
  );
}
