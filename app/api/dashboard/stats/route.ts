import { NextResponse } from "next/server"
import type { DashboardStats } from "@/types"

const DEMO_STATS: DashboardStats = {
  todaysSales: {
    amount: 155900,
    count: 3,
  },
  totalBookings: 27,
  lockedTickets: 5,
  totalInventory: 49,
  estimatedProfit: 39850,
}

export async function GET() {
  try {
    return NextResponse.json(DEMO_STATS)
  } catch (error) {
    console.error("[v0] Error fetching dashboard stats:", error)
    return NextResponse.json(
      {
        todaysSales: { amount: 0, count: 0 },
        totalBookings: 0,
        lockedTickets: 0,
        totalInventory: 0,
        estimatedProfit: 0,
      },
      { status: 500 }
    )
  }
}
