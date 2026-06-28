"use client";

import { use } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { ImageGallery } from "@/components/files/file-upload";
import { CommentsSection } from "@/components/orders/comments-section";
import { orders } from "@/lib/mock-data";
import { formatDate, formatFileSize, formatDateTime } from "@/lib/utils";
import { ArrowLeft, Download, User, Mail, Phone, MapPin } from "lucide-react";
import { notFound } from "next/navigation";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const order = orders.find((o) => o.id === id);

  if (!order) notFound();

  return (
    <DashboardLayout
      title={order.title}
      description={order.orderNumber}
      actions={
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <Link href="/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{order.description}</p>
              <div className="p-4 rounded-xl bg-muted/50">
                <p className="text-sm font-medium mb-1">Requirements</p>
                <p className="text-sm text-muted-foreground">{order.requirements}</p>
              </div>
              <Progress value={order.progress} showLabel />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Due Date</p>
                  <p className="font-medium">{order.dueDate ? formatDate(order.dueDate) : "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reference Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGallery
                images={order.referenceImages.map((img) => ({ id: img.id, url: img.url, name: img.name }))}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>STL Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {order.designFiles.filter((f) => f.type === "stl").length === 0 ? (
                  <p className="text-sm text-muted-foreground">No STL files uploaded</p>
                ) : (
                  order.designFiles.filter((f) => f.type === "stl").map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)} · v{file.version}</p>
                      </div>
                      <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>3DM Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {order.designFiles.filter((f) => f.type === "3dm").length === 0 ? (
                  <p className="text-sm text-muted-foreground">No 3DM files uploaded</p>
                ) : (
                  order.designFiles.filter((f) => f.type === "3dm").map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)} · v{file.version}</p>
                      </div>
                      <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {order.previewImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Preview Images</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageGallery
                  images={order.previewImages.map((img) => ({ id: img.id, url: img.url, name: img.name }))}
                />
              </CardContent>
            </Card>
          )}

          <CommentsSection comments={order.comments} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline currentStatus={order.status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gold" />
                <span>{order.customer.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold" />
                <span>{order.customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                <span>{order.customer.phone}</span>
              </div>
              {order.customer.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>{order.customer.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-muted-foreground text-xs mb-1">Seller</p>
                <p className="font-medium">{order.seller.name}</p>
                <p className="text-muted-foreground">{order.seller.email}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-muted-foreground text-xs mb-1">Designer</p>
                <p className="font-medium">{order.designer?.name || "Not assigned"}</p>
                {order.designer && <p className="text-muted-foreground">{order.designer.email}</p>}
              </div>
              <div className="p-3 rounded-xl bg-muted/50">
                <p className="text-muted-foreground text-xs mb-1">Manufacturer</p>
                <p className="font-medium">{order.manufacturer?.name || "Not assigned"}</p>
                {order.manufacturer && <p className="text-muted-foreground">{order.manufacturer.email}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.activity.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-gold mt-1.5 shrink-0" />
                    <div>
                      <p><span className="font-medium">{item.user}</span> <span className="text-muted-foreground">{item.action}</span></p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(item.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
