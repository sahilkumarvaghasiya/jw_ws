"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gem, Mail, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=1600&fit=crop')] bg-cover bg-center opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-dark/80 to-dark/60" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-gold/20">
                <Gem className="w-8 h-8 text-gold" />
              </div>
              <div>
                <h1 className="text-3xl font-medium">LuxeOrders</h1>
                <p className="text-sm text-white/60 tracking-widest uppercase">Jewelry Platform</p>
              </div>
            </div>
            <h2 className="text-4xl font-medium leading-tight mb-4">
              Craft Excellence,<br />Manage with Grace
            </h2>
            <p className="text-white/70 text-lg max-w-md leading-relaxed">
              The premium order management platform connecting sellers, designers, and manufacturers in the world of fine jewelry.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-muted">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="p-2 rounded-xl bg-gold/10">
              <Gem className="w-6 h-6 text-gold" />
            </div>
            <h1 className="text-2xl font-medium">LuxeOrders</h1>
          </div>

          <div className="bg-card rounded-[14px] border border-border p-8 shadow-[var(--shadow-lg)]">
            <h2 className="text-2xl font-medium mb-1">Welcome back</h2>
            <p className="text-muted-foreground mb-8">Sign in to your account to continue</p>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <Mail className="absolute left-3 top-[38px] w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="you@company.com"
                  className="pl-10"
                  defaultValue="eleanor@luxejewels.com"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-[38px] w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  defaultValue="password"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border text-gold focus:ring-gold" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-gold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Link href="/dashboard/seller">
                <Button className="w-full" size="lg">
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-gold font-medium hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
