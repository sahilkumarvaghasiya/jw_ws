"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import type { UserRole } from "@/lib/types";
import { RoleBadge } from "@/components/ui/badge";
import {
  Search,
  Moon,
  Sun,
  ChevronDown,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const roleDashboard: Record<UserRole, string> = {
  seller: "/dashboard/seller",
  designer: "/dashboard/designer",
  manufacturer: "/dashboard/manufacturer",
};

export function TopNav() {
  const router = useRouter();
  const { user, role, setRole, darkMode, setDarkMode, sidebarCollapsed, setSidebarCollapsed } = useApp();
  const [showProfile, setShowProfile] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const roles = [
    { value: "seller" as const, label: "Seller" },
    { value: "designer" as const, label: "Designer" },
    { value: "manufacturer" as const, label: "Manufacturer" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 border-b border-border bg-card/90 backdrop-blur-md flex items-center justify-between px-6 transition-all duration-200 dark:bg-card/95",
        sidebarCollapsed ? "left-0 lg:left-[72px]" : "left-0 lg:left-[260px]"
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search orders, files, customers..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-muted transition-colors"
          >
            <RoleBadge role={role} />
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
          <AnimatePresence>
            {showRoleSwitcher && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card shadow-lg py-1 z-50"
              >
                {roles.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => {
                      setRole(r.value);
                      setShowRoleSwitcher(false);
                      router.push(roleDashboard[r.value]);
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors capitalize",
                      role === r.value && "text-gold font-medium"
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-muted transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-sm font-medium text-gold-dark">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <span className="text-sm font-medium hidden md:block">{user.name}</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground hidden md:block" />
          </button>
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card shadow-lg py-1 z-50"
              >
                <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-muted" onClick={() => setShowProfile(false)}>
                  Profile
                </Link>
                <Link href="/settings" className="block px-4 py-2 text-sm hover:bg-muted" onClick={() => setShowProfile(false)}>
                  Settings
                </Link>
                <hr className="my-1 border-border" />
                <Link href="/login" className="block px-4 py-2 text-sm text-error hover:bg-muted" onClick={() => setShowProfile(false)}>
                  Sign out
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
