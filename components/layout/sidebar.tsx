"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Globe, Ticket, Package, ShoppingCart, Settings, BarChart3, MapPin } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { hasPermission } from "@/lib/auth"

interface NavItem {
  path: string
  label: string
  icon: React.ReactNode
  permission?: string
}

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const navigationItems: NavItem[] = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      path: "/countries",
      label: "Countries",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      path: "/tickets",
      label: "Tickets",
      icon: <Ticket className="h-5 w-5" />,
    },
    {
      path: "/bookings",
      label: "Bookings",
      icon: <Package className="h-5 w-5" />,
    },
    {
      path: "/umrah",
      label: "Umrah Management",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      path: "/admin/buying",
      label: "Buy Tickets",
      icon: <ShoppingCart className="h-5 w-5" />,
      permission: "create_batches",
    },
    {
      path: "/reports",
      label: "Reports",
      icon: <BarChart3 className="h-5 w-5" />,
      permission: "view_profit",
    },
    {
      path: "/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const visibleNavItems = navigationItems.filter((item) => !item.permission || hasPermission(user, item.permission))

  return (
    <aside className="hidden lg:flex flex-col w-64 luxury-card border-r border-border h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-heading font-bold velvet-text">BD TicketPro</h1>
        <p className="text-sm text-muted-foreground font-body">Travel Management</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-body",
                isActive
                  ? "velvet-button text-primary-foreground font-medium shadow-md"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {user && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-heading font-semibold">{user.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate font-body">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize font-body">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
