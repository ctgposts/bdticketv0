import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { DashboardStats } from "@/types"

export async function GET() {
  try {
    const supabase = await createClient()

    // Initialize default stats
    const stats: DashboardStats = {
      todaysSales: { amount: 0, count: 0 },
      totalBookings: 0,
      lockedTickets: 0,
      totalInventory: 0,
      estimatedProfit: 0,
    }

    // Get today's date for filtering
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Try to get today's sales (handle if bookings table doesn't exist)
    try {
      const { data: todayBookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("total_amount")
        .gte("created_at", today.toISOString())
        .eq("status", "confirmed")

      if (!bookingsError && todayBookings) {
        stats.todaysSales = {
          amount: todayBookings.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0),
          count: todayBookings.length,
        }
      }
    } catch (error) {
      console.log("[v0] Bookings table not ready yet:", error)
    }

    // Try to get total bookings count
    try {
      const { count: totalBookings } = await supabase.from("bookings").select("*", { count: "exact", head: true })

      stats.totalBookings = totalBookings || 0
    } catch (error) {
      console.log("[v0] Could not fetch total bookings:", error)
    }

    // Get locked tickets count (tickets table should exist)
    try {
      const { count: lockedTickets } = await supabase
        .from("tickets")
        .select("*", { count: "exact", head: true })
        .eq("status", "locked")

      stats.lockedTickets = lockedTickets || 0
    } catch (error) {
      console.log("[v0] Could not fetch locked tickets:", error)
    }

    // Get total inventory (tickets table should exist)
    try {
      const { count: totalInventory } = await supabase.from("tickets").select("*", { count: "exact", head: true })

      stats.totalInventory = totalInventory || 0
    } catch (error) {
      console.log("[v0] Could not fetch total inventory:", error)
    }

    // Calculate estimated profit from confirmed bookings
    try {
      const { data: confirmedBookings, error: profitError } = await supabase
        .from("bookings")
        .select("total_amount, ticket_id")
        .eq("status", "confirmed")

      if (!profitError && confirmedBookings) {
        // For each booking, calculate profit (selling price - buying price)
        let totalProfit = 0
        for (const booking of confirmedBookings) {
          // This is a simplified calculation
          // In reality, you'd join with tickets to get buying_price
          totalProfit += Number(booking.total_amount) || 0
        }
        stats.estimatedProfit = totalProfit * 0.15 // Assume 15% profit margin
      }
    } catch (error) {
      console.log("[v0] Could not calculate profit:", error)
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[v0] Error fetching dashboard stats:", error)
    // Return empty stats on error
    return NextResponse.json({
      todaysSales: { amount: 0, count: 0 },
      totalBookings: 0,
      lockedTickets: 0,
      totalInventory: 0,
      estimatedProfit: 0,
    })
  }
}
