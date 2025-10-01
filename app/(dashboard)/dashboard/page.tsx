"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { hasPermission } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Ticket, Lock, Package, TrendingUp, RefreshCw } from "lucide-react"
import type { DashboardStats } from "@/types"
import { cn } from "@/lib/utils"

interface DashboardTileProps {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  color: string
  onClick?: () => void
}

function DashboardTile({ title, value, description, icon, color, onClick }: DashboardTileProps) {
  return (
    <Card
      className={cn(
        "luxury-card transition-all duration-300",
        onClick ? "cursor-pointer hover:shadow-xl hover:-translate-y-1" : "",
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium font-heading">{title}</CardTitle>
        <div className={`p-2 rounded-full ${color}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-heading">{value}</div>
        <p className="text-xs text-muted-foreground mt-1 font-body">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const loadDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/dashboard/stats")
      const data = await response.json()
      setStats(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to load dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const commonTiles = [
    {
      title: "Today's Sales",
      value: `৳${stats?.todaysSales?.amount?.toLocaleString() || "0"}`,
      description: `${stats?.todaysSales?.count || 0} tickets sold today`,
      icon: <DollarSign className="h-4 w-4 text-white" />,
      color: "bg-green-500",
      onClick: () => router.push("/reports"),
    },
    {
      title: "Total Bookings",
      value: stats?.totalBookings || 0,
      description: "Active booking requests",
      icon: <Package className="h-4 w-4 text-white" />,
      color: "bg-blue-500",
      onClick: () => router.push("/bookings"),
    },
    {
      title: "Locked Tickets",
      value: stats?.lockedTickets || 0,
      description: "Temporarily reserved",
      icon: <Lock className="h-4 w-4 text-white" />,
      color: "bg-yellow-500",
      onClick: () => router.push("/bookings"),
    },
    {
      title: "Total Inventory",
      value: stats?.totalInventory || 0,
      description: "Available tickets",
      icon: <Ticket className="h-4 w-4 text-white" />,
      color: "bg-purple-500",
      onClick: () => router.push("/countries"),
    },
  ]

  const adminTiles = hasPermission(user, "view_profit")
    ? [
        {
          title: "Estimated Profit",
          value: `৳${stats?.estimatedProfit?.toLocaleString() || "0"}`,
          description: "Based on current sales",
          icon: <TrendingUp className="h-4 w-4 text-white" />,
          color: "bg-teal-500",
          onClick: () => router.push("/reports"),
        },
      ]
    : []

  const tilesToShow = [...commonTiles, ...adminTiles]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading velvet-text">Dashboard</h1>
          <p className="text-muted-foreground mt-1 font-body">
            Welcome back, {user?.name}! Here's your business overview.
          </p>
        </div>
        <Button onClick={loadDashboardStats} variant="outline" size="sm" className="font-body bg-transparent">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="text-sm text-muted-foreground font-body">Last updated: {lastUpdated.toLocaleTimeString()}</div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tilesToShow.map((tile, index) => (
          <DashboardTile key={index} {...tile} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="font-heading">Quick Actions</CardTitle>
            <CardDescription className="font-body">Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full velvet-button font-body" onClick={() => router.push("/countries")}>
              View Tickets
            </Button>
            {hasPermission(user, "create_batches") && (
              <Button
                className="w-full font-body bg-transparent"
                variant="outline"
                onClick={() => router.push("/admin/buying")}
              >
                Buy New Tickets
              </Button>
            )}
            <Button
              className="w-full font-body bg-transparent"
              variant="outline"
              onClick={() => router.push("/bookings")}
            >
              Manage Bookings
            </Button>
          </CardContent>
        </Card>

        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="font-heading">Recent Activity</CardTitle>
            <CardDescription className="font-body">Latest system updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium font-body">New booking created</p>
                  <p className="text-xs text-muted-foreground font-body">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium font-body">Ticket batch added</p>
                  <p className="text-xs text-muted-foreground font-body">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium font-body">Payment received</p>
                  <p className="text-xs text-muted-foreground font-body">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
