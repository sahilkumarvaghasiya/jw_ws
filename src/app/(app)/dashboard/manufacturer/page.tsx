"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { OrdersTable } from "@/components/orders/orders-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ImageGallery } from "@/components/files/file-upload";
import { Textarea } from "@/components/ui/input";
import { orders } from "@/lib/mock-data";
import { useFileForwards } from "@/context/file-forward-context";
import { formatFileSize, formatDateTime } from "@/lib/utils";
import { Factory, Clock, CheckCircle, Download, Inbox } from "lucide-react";

export default function ManufacturerDashboard() {
  const { getPackagesForManufacturer } = useFileForwards();
  const forwardedPackages = getPackagesForManufacturer("u4");
  const manufacturingOrders = orders.filter(
    (o) => o.status === "manufacturing" || o.status === "approved" || o.status === "completed"
  );
  const active = orders.filter((o) => o.status === "manufacturing");
  const completed = orders.filter((o) => o.status === "completed");

  return (
    <DashboardLayout
      title="Manufacturer Dashboard"
      description="View completed designs and manage production"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Active Production" value={active.length} icon={Factory} />
        <StatCard title="In Queue" value={1} icon={Clock} />
        <StatCard title="Completed" value={completed.length} icon={CheckCircle} />
      </div>

      {forwardedPackages.length > 0 && (
        <Card className="mb-8 border-blue-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-blue-500" />
              Files Forwarded by Seller
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {forwardedPackages.map((pkg) => (
              <div key={pkg.id} className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      From {pkg.sellerName} · {formatDateTime(pkg.createdAt)}
                    </p>
                    {pkg.note && (
                      <p className="text-sm mt-2 p-3 rounded-xl bg-background border border-border">
                        {pkg.note}
                      </p>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                    Download All
                  </Button>
                </div>
                <div className="space-y-2">
                  {pkg.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-background border border-border"
                    >
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.orderNumber} · {file.productTitle} · {file.type.toUpperCase()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {manufacturingOrders.slice(0, 2).map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{order.orderNumber}</h3>
                      <p className="text-muted-foreground">{order.title}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                      Download All
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-muted-foreground mb-1">Customer</p>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-muted-foreground">{order.customer.email}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <p className="text-muted-foreground mb-1">Designer</p>
                      <p className="font-medium">{order.designer?.name || "—"}</p>
                      <p className="text-muted-foreground">{order.designer?.email}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Manufacturing Progress</p>
                    <Progress value={order.progress} showLabel />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Design Files</p>
                    {order.designFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)} · v{file.version}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Textarea label="Manufacturing Notes" placeholder="Add production notes..." rows={3} />
                  <Button>Update Progress</Button>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Jewelry Preview</p>
                  <ImageGallery
                    images={
                      order.previewImages.length > 0
                        ? order.previewImages.map((img) => ({ id: img.id, url: img.url, name: img.name }))
                        : order.referenceImages.map((img) => ({ id: img.id, url: img.url, name: img.name }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>All Production Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTable orders={manufacturingOrders} showSeller showDesigner />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
