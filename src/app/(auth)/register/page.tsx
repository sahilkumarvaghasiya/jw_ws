"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/input";
import { Gem, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-muted">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="p-2 rounded-xl bg-gold/10">
            <Gem className="w-6 h-6 text-gold" />
          </div>
          <h1 className="text-2xl font-medium">LuxeOrders</h1>
        </div>

        <div className="bg-card rounded-[14px] border border-border p-8 shadow-[var(--shadow-lg)]">
          <h2 className="text-2xl font-medium mb-1">Create your account</h2>
          <p className="text-muted-foreground mb-8">Join the premium jewelry order platform</p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input id="firstName" label="First Name" placeholder="Eleanor" />
              <Input id="lastName" label="Last Name" placeholder="Whitmore" />
            </div>
            <Input id="email" label="Email" type="email" placeholder="you@company.com" />
            <Input id="company" label="Company" placeholder="Luxe Jewels Co." />
            <Select
              id="role"
              label="Role"
              options={[
                { value: "seller", label: "Seller" },
                { value: "designer", label: "Designer" },
                { value: "manufacturer", label: "Manufacturer" },
              ]}
            />
            <Input id="password" label="Password" type="password" placeholder="••••••••" />
            <Input id="confirmPassword" label="Confirm Password" type="password" placeholder="••••••••" />
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="rounded border-border text-gold focus:ring-gold mt-0.5" />
              <span className="text-muted-foreground">
                I agree to the Terms of Service and Privacy Policy
              </span>
            </label>
            <Link href="/dashboard/seller">
              <Button className="w-full" size="lg">
                Create Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-gold font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
