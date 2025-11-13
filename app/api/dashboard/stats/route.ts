import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

    // Get today's bookings
    const { data: todaysBookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("amount")
      .gte("created_at", todayStart)
      .eq("status", "confirmed")

    if (bookingsError) {
      console.error("[v0] Bookings error:", bookingsError)
    }

    // Get total bookings
    const { count: totalBookings, error: countError } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })

    // Get available tickets
    const { count: availableTickets, error: ticketsError } = await supabase
      .from("tickets")
      .select("id", { count: "exact", head: true })
      .eq("status", "available")

    // Get locked tickets
    const { count: lockedTickets, error: lockedError } = await supabase
      .from("tickets")
      .select("id", { count: "exact", head: true })
      .eq("status", "locked")

    // Get total inventory
    const { data: totalInventory, error: inventoryError } = await supabase
      .from("tickets")
      .select("available_seats")

    if (inventoryError) {
      console.error("[v0] Inventory error:", inventoryError)
    }

    // Calculate stats
    const todaysSalesAmount = (todaysBookings || []).reduce((sum: number, booking: any) => sum + (booking.amount || 0), 0)
    const todaysSalesCount = todaysBookings?.length || 0
    const totalSeatsAvailable = (totalInventory || []).reduce((sum: number, ticket: any) => sum + (ticket.available_seats || 0), 0)

    // Estimate profit (selling price - buying price for available tickets)
    const { data: ticketsWithPrices, error: pricesError } = await supabase
      .from("tickets")
      .select("buying_price, selling_price, available_seats")
      .eq("status", "available")

    let estimatedProfit = 0
    if (!pricesError && ticketsWithPrices) {
      estimatedProfit = ticketsWithPrices.reduce((sum: number, ticket: any) => {
        const profitPerSeat = (ticket.selling_price - ticket.buying_price) * (ticket.available_seats || 0)
        return sum + profitPerSeat
      }, 0)
    }

    return NextResponse.json({
      todaysSales: {
        amount: todaysSalesAmount,
        count: todaysSalesCount,
      },
      totalBookings: totalBookings || 0,
      availableTickets: availableTickets || 0,
      lockedTickets: lockedTickets || 0,
      totalInventory: totalSeatsAvailable,
      estimatedProfit: Math.round(estimatedProfit),
    })
  } catch (error) {
    console.error("[v0] Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 })
  }
}
