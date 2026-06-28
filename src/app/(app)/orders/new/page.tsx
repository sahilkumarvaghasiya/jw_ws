"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { FileUpload } from "@/components/files/file-upload";
import { designers as initialDesigners, orders } from "@/lib/mock-data";
import { getOrderDraftStep } from "@/lib/utils";
import { ArrowLeft, Plus, Save, Search } from "lucide-react";

type DesignerOption = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  activeOrders: number;
};

function NewOrderContent() {
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draft");
  const stepParam = searchParams.get("step");

  const draftOrder = useMemo(
    () => (draftId ? orders.find((order) => order.id === draftId) : undefined),
    [draftId]
  );

  const [step, setStep] = useState(1);
  const [designerList, setDesignerList] = useState<DesignerOption[]>(initialDesigners);
  const [selectedDesignerId, setSelectedDesignerId] = useState("");
  const [showAddDesigner, setShowAddDesigner] = useState(false);
  const [newDesigner, setNewDesigner] = useState({ name: "", email: "", phone: "" });
  const [designerSearch, setDesignerSearch] = useState("");
  const [draftLoaded, setDraftLoaded] = useState(false);

  useEffect(() => {
    if (!draftOrder || draftLoaded) return;

    const resumeStep = stepParam ? Number(stepParam) : getOrderDraftStep(draftOrder);
    if (resumeStep >= 1 && resumeStep <= 4) {
      setStep(resumeStep);
    }
    if (draftOrder.designer) {
      setSelectedDesignerId(draftOrder.designer.id);
    }
    setDraftLoaded(true);
  }, [draftOrder, stepParam, draftLoaded]);

  const filteredDesigners = designerList.filter((designer) => {
    const query = designerSearch.toLowerCase().trim();
    if (!query) return true;
    return (
      designer.name.toLowerCase().includes(query) ||
      designer.email.toLowerCase().includes(query) ||
      designer.phone?.toLowerCase().includes(query)
    );
  });

  const handleAddDesigner = () => {
    if (!newDesigner.name.trim() || !newDesigner.email.trim()) return;

    const designer: DesignerOption = {
      id: `new-${Date.now()}`,
      name: newDesigner.name.trim(),
      email: newDesigner.email.trim(),
      phone: newDesigner.phone.trim() || undefined,
      activeOrders: 0,
    };

    setDesignerList((prev) => [...prev, designer]);
    setSelectedDesignerId(designer.id);
    setNewDesigner({ name: "", email: "", phone: "" });
    setShowAddDesigner(false);
  };

  return (
    <DashboardLayout
      title={draftOrder ? "Continue Order" : "Create New Order"}
      description={
        draftOrder
          ? `Resume ${draftOrder.orderNumber} — pick up where you left off`
          : "Enter customer details and jewelry requirements"
      }
      actions={
        <Link href="/orders">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </Button>
        </Link>
      }
    >
      <div className="flex gap-2 mb-8">
        {["Customer Info", "Requirements", "Reference Images", "Assign Designer"].map((label, i) => (
          <button
            key={label}
            onClick={() => setStep(i + 1)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              step === i + 1
                ? "bg-gold/10 text-gold-dark border border-gold/30"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="hidden sm:inline">{i + 1}. </span>{label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                id="customerName"
                label="Customer Name"
                placeholder="Michael & Jessica Thompson"
                defaultValue={draftOrder?.customer.name}
                key={draftOrder ? `name-${draftOrder.id}` : "name-new"}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="customerEmail"
                  label="Email"
                  type="email"
                  placeholder="customer@email.com"
                  defaultValue={draftOrder?.customer.email}
                  key={draftOrder ? `email-${draftOrder.id}` : "email-new"}
                />
                <Input
                  id="customerPhone"
                  label="Phone"
                  placeholder="+1 (555) 123-4567"
                  defaultValue={draftOrder?.customer.phone}
                  key={draftOrder ? `phone-${draftOrder.id}` : "phone-new"}
                />
              </div>
              <Input
                id="customerAddress"
                label="Address"
                placeholder="742 Park Avenue, New York, NY"
                defaultValue={draftOrder?.customer.address}
                key={draftOrder ? `address-${draftOrder.id}` : "address-new"}
              />
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)}>Continue</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Jewelry Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                id="orderId"
                label="Order ID"
                placeholder="JW-2024-089"
                defaultValue={draftOrder?.orderNumber}
                key={draftOrder ? `orderId-${draftOrder.id}` : "orderId-new"}
              />
              <Input
                id="orderTitle"
                label="Order Title"
                placeholder="Platinum Diamond Engagement Ring"
                defaultValue={draftOrder?.title}
                key={draftOrder ? `title-${draftOrder.id}` : "title-new"}
              />
              <Textarea
                id="description"
                label="Description"
                rows={3}
                placeholder="Describe the jewelry piece..."
                defaultValue={draftOrder?.description}
                key={draftOrder ? `desc-${draftOrder.id}` : "desc-new"}
              />
              <Textarea
                id="requirements"
                label="Technical Requirements"
                rows={4}
                placeholder="Metal type, stone specifications, dimensions, ring size..."
                defaultValue={draftOrder?.requirements}
                key={draftOrder ? `req-${draftOrder.id}` : "req-new"}
              />
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Continue</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Reference Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload
                accept="image/*"
                label="Upload Reference Images"
                description="Upload inspiration images, sketches, or reference photos"
              />
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={() => setStep(4)}>Continue</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Assign Designer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="designerSearch" className="block text-sm font-medium text-foreground">
                  Search Designer
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="designerSearch"
                    type="search"
                    placeholder="Search by name, email, or phone..."
                    value={designerSearch}
                    onChange={(e) => setDesignerSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                  />
                </div>
              </div>
              <div className="space-y-3">
                {filteredDesigners.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No designers found. Try a different search or add a new designer.
                  </p>
                ) : (
                  filteredDesigners.map((designer) => (
                  <label
                    key={designer.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-gold/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="designer"
                      value={designer.id}
                      checked={selectedDesignerId === designer.id}
                      onChange={() => setSelectedDesignerId(designer.id)}
                      className="text-gold focus:ring-gold"
                    />
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-sm font-medium text-gold-dark">
                      {designer.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{designer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {designer.email}
                        {designer.phone ? ` · ${designer.phone}` : ""}
                        {" · "}
                        {designer.activeOrders} active orders
                      </p>
                    </div>
                  </label>
                  ))
                )}
              </div>

              {!showAddDesigner ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={() => setShowAddDesigner(true)}
                >
                  <Plus className="w-4 h-4" />
                  Add new designer
                </Button>
              ) : (
                <div className="p-4 rounded-xl border border-gold/30 bg-gold/5 space-y-4">
                  <p className="text-sm font-medium">New Designer</p>
                  <Input
                    id="newDesignerName"
                    label="Full Name"
                    placeholder="Alex Rivera"
                    value={newDesigner.name}
                    onChange={(e) => setNewDesigner((prev) => ({ ...prev, name: e.target.value }))}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      id="newDesignerEmail"
                      label="Email"
                      type="email"
                      placeholder="alex@designstudio.com"
                      value={newDesigner.email}
                      onChange={(e) => setNewDesigner((prev) => ({ ...prev, email: e.target.value }))}
                    />
                    <Input
                      id="newDesignerPhone"
                      label="Phone"
                      placeholder="+1 (555) 987-6543"
                      value={newDesigner.phone}
                      onChange={(e) => setNewDesigner((prev) => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddDesigner(false);
                        setNewDesigner({ name: "", email: "", phone: "" });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAddDesigner}
                      disabled={!newDesigner.name.trim() || !newDesigner.email.trim()}
                    >
                      Save Designer
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                <Link href="/dashboard/seller">
                  <Button>
                    <Save className="w-4 h-4" />
                    Create Order
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function NewOrderPage() {
  return (
    <Suspense fallback={null}>
      <NewOrderContent />
    </Suspense>
  );
}
