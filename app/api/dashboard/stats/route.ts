import { NextResponse } from "next/server"
import type { DashboardStats } from "@/types"

export async function GET() {
  // Mock dashboard statistics
  const stats: DashboardStats = {
    todaysSales: {
      amount: 125000,
      count: 15,
    },
    totalBookings: 42,
    lockedTickets: 8,
    totalInventory: 350,
    estimatedProfit: 45000,
  }

  return NextResponse.json(stats)
}
