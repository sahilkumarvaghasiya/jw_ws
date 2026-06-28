"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gem, ArrowLeft, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-muted">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="p-2 rounded-xl bg-gold/10">
            <Gem className="w-6 h-6 text-gold" />
          </div>
          <h1 className="text-2xl font-medium">LuxeOrders</h1>
        </div>

        <div className="bg-card rounded-[14px] border border-border p-8 shadow-[var(--shadow-lg)]">
          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-6">
            <Mail className="w-6 h-6 text-gold" />
          </div>
          <h2 className="text-2xl font-medium mb-1">Reset your password</h2>
          <p className="text-muted-foreground mb-8">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <Input id="email" label="Email" type="email" placeholder="you@company.com" />
            <Button className="w-full" size="lg">
              Send Reset Link
            </Button>
          </form>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
