import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const supabase = await createClient()

    let query = supabase.from("bookings").select(`
      id,
      amount,
      status,
      created_at,
      tickets(
        id,
        selling_price,
        buying_price,
        flight_number,
        airlines(name),
        destination_country:destination_country_id(name, code)
      )
    `)

    if (startDate) {
      query = query.gte("created_at", startDate)
    }

    if (endDate) {
      query = query.lte("created_at", endDate)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate aggregated statistics
    const bookings = data || []
    const confirmedBookings = bookings.filter((b: any) => b.status === "confirmed")

    const totalRevenue = confirmedBookings.reduce((sum: number, booking: any) => sum + (booking.amount || 0), 0)

    const totalProfit = confirmedBookings.reduce((sum: number, booking: any) => {
      const ticket = booking.tickets
      if (ticket) {
        const profitPerTicket = ticket.selling_price - ticket.buying_price
        return sum + profitPerTicket
      }
      return sum
    }, 0)

    return NextResponse.json({
      bookings: data || [],
      summary: {
        totalBookings: bookings.length,
        confirmedBookings: confirmedBookings.length,
        totalRevenue: Math.round(totalRevenue),
        totalProfit: Math.round(totalProfit),
        averageBookingValue: bookings.length > 0 ? Math.round(totalRevenue / bookings.length) : 0,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}
