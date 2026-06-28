"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RoleBadge } from "@/components/ui/badge";
import { useApp } from "@/context/app-context";
import { Camera } from "lucide-react";

export default function ProfilePage() {
  const { user } = useApp();

  return (
    <DashboardLayout title="Profile" description="Manage your account information">
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center text-2xl font-medium text-gold-dark">
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-gold text-white shadow-md hover:bg-gold-dark transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-medium">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <RoleBadge role={user.role} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input id="name" label="Full Name" defaultValue={user.name} />
              <Input id="email" label="Email" type="email" defaultValue={user.email} />
            </div>
            <Input id="company" label="Company" defaultValue={user.company} />
            <Input id="phone" label="Phone" defaultValue={user.phone} />
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input id="currentPassword" label="Current Password" type="password" />
            <Input id="newPassword" label="New Password" type="password" />
            <Input id="confirmNewPassword" label="Confirm New Password" type="password" />
            <Button variant="secondary">Update Password</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
