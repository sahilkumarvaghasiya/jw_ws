"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { FileUpload } from "@/components/files/file-upload";
import { designers } from "@/lib/mock-data";
import { ArrowLeft, Save } from "lucide-react";

export default function NewOrderPage() {
  const [step, setStep] = useState(1);

  return (
    <DashboardLayout
      title="Create New Order"
      description="Enter customer details and jewelry requirements"
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
              <Input id="customerName" label="Customer Name" placeholder="Michael & Jessica Thompson" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input id="customerEmail" label="Email" type="email" placeholder="customer@email.com" />
                <Input id="customerPhone" label="Phone" placeholder="+1 (555) 123-4567" />
              </div>
              <Input id="customerAddress" label="Address" placeholder="742 Park Avenue, New York, NY" />
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
              <Input id="orderTitle" label="Order Title" placeholder="Platinum Diamond Engagement Ring" />
              <Textarea id="description" label="Description" rows={3} placeholder="Describe the jewelry piece..." />
              <Textarea
                id="requirements"
                label="Technical Requirements"
                rows={4}
                placeholder="Metal type, stone specifications, dimensions, ring size..."
              />
              <Input id="dueDate" label="Due Date" type="date" />
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
              <Select
                id="designer"
                label="Select Designer"
                options={[
                  { value: "", label: "Choose a designer..." },
                  ...designers.map((d) => ({
                    value: d.id,
                    label: `${d.name} (${d.activeOrders} active orders)`,
                  })),
                ]}
              />
              <div className="space-y-3">
                {designers.map((designer) => (
                  <label
                    key={designer.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-gold/50 cursor-pointer transition-colors"
                  >
                    <input type="radio" name="designer" value={designer.id} className="text-gold focus:ring-gold" />
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-sm font-medium text-gold-dark">
                      {designer.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{designer.name}</p>
                      <p className="text-sm text-muted-foreground">{designer.email} · {designer.activeOrders} active orders</p>
                    </div>
                  </label>
                ))}
              </div>
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
