"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/app-context";
import type { UserRole } from "@/lib/types";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderOpen,
  Settings,
  User,
  ChevronLeft,
  Gem,
  Palette,
  Factory,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/seller", icon: LayoutDashboard, roles: ["seller"] },
  { label: "Dashboard", href: "/dashboard/designer", icon: LayoutDashboard, roles: ["designer"] },
  { label: "Dashboard", href: "/dashboard/manufacturer", icon: LayoutDashboard, roles: ["manufacturer"] },
  { label: "New Order", href: "/orders/new", icon: PlusCircle, roles: ["seller"] },
  { label: "Orders", href: "/orders", icon: Package, roles: ["seller", "designer", "manufacturer"] },
  { label: "Files", href: "/files", icon: FolderOpen, roles: ["seller", "designer", "manufacturer"] },
  { label: "Profile", href: "/profile", icon: User, roles: ["seller", "designer", "manufacturer"] },
  { label: "Settings", href: "/settings", icon: Settings, roles: ["seller", "designer", "manufacturer"] },
];

const roleIcons: Record<UserRole, React.ElementType> = {
  seller: Gem,
  designer: Palette,
  manufacturer: Factory,
};

export function Sidebar() {
  const pathname = usePathname();
  const { role, sidebarCollapsed, setSidebarCollapsed } = useApp();
  const RoleIcon = roleIcons[role];

  const filteredNav = navItems.filter((item) => item.roles.includes(role));
  const uniqueNav = filteredNav.filter(
    (item, index, self) => self.findIndex((i) => i.label === item.label) === index
  );

  return (
    <>
    {(!sidebarCollapsed) && (
      <div
        className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
        onClick={() => setSidebarCollapsed(true)}
      />
    )}
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card flex flex-col dark:bg-[#0f0f0f]",
        sidebarCollapsed && "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold/10 shrink-0">
          <Gem className="w-5 h-5 text-gold" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              <h1 className="text-lg font-medium whitespace-nowrap">LuxeOrders</h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Jewelry Platform</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {uniqueNav.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard/seller" && item.href !== "/dashboard/designer" && item.href !== "/dashboard/manufacturer" && pathname.startsWith(item.href));
          const dashboardActive = item.label === "Dashboard" && pathname.startsWith("/dashboard");
          const active = item.label === "Dashboard" ? dashboardActive : isActive;

          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-gold/10 text-gold-dark"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", active && "text-gold")} />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/50",
            sidebarCollapsed && "justify-center"
          )}
        >
          <RoleIcon className="w-4 h-4 text-gold shrink-0" />
          {!sidebarCollapsed && (
            <span className="text-xs font-medium capitalize">{role}</span>
          )}
        </div>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="mt-2 flex items-center justify-center w-full py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              sidebarCollapsed && "rotate-180"
            )}
          />
        </button>
      </div>
    </motion.aside>
    </>
  );
}
