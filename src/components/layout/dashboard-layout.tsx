"use client";

import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";
import { BackgroundWatermark } from "./background-watermark";
import { useApp } from "@/context/app-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function DashboardLayout({ children, title, description, actions }: DashboardLayoutProps) {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-muted">
      <Sidebar />
      <TopNav />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "relative pt-16 min-h-screen transition-all duration-200",
          sidebarCollapsed ? "pl-0 lg:pl-[72px]" : "pl-0 lg:pl-[260px]"
        )}
      >
        <BackgroundWatermark />
        <div className="relative z-10 p-6 lg:p-8 max-w-[1600px] mx-auto">
          {(title || actions) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                {title && <h1 className="text-2xl lg:text-3xl font-medium">{title}</h1>}
                {description && (
                  <p className="text-muted-foreground mt-1">{description}</p>
                )}
              </div>
              {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
          )}
          {children}
        </div>
      </motion.main>
    </div>
  );
}
