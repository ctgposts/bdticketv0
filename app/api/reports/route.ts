import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const type = searchParams.get("type") || "sales"
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    if (type === "sales") {
      // Sales report
      let query = supabase
        .from("bookings")
        .select(`
          *,
          ticket:tickets(
            flight_number,
            airline_name,
            origin_country:countries!tickets_origin_country_id_fkey(name),
            destination_country:countries!tickets_destination_country_id_fkey(name)
          )
        `)
        .eq("status", "confirmed")
        .order("created_at", { ascending: false })

      if (startDate) {
        query = query.gte("created_at", startDate)
      }
      if (endDate) {
        query = query.lte("created_at", endDate)
      }

      const { data, error } = await query

      if (error) throw error

      // Calculate summary
      const summary = {
        totalBookings: data?.length || 0,
        totalRevenue: data?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0,
        totalProfit: data?.reduce((sum, b) => sum + (b.profit || 0), 0) || 0,
        averageTicketPrice: data?.length ? data.reduce((sum, b) => sum + (b.total_amount || 0), 0) / data.length : 0,
      }

      return NextResponse.json({ data, summary })
    } else if (type === "inventory") {
      // Inventory report
      const { data, error } = await supabase
        .from("tickets")
        .select(`
          *,
          origin_country:countries!tickets_origin_country_id_fkey(name, code),
          destination_country:countries!tickets_destination_country_id_fkey(name, code),
          airline:airlines(name, code)
        `)
        .order("departure_date", { ascending: true })

      if (error) throw error

      // Calculate summary by status
      const summary = {
        available: data?.filter((t) => t.status === "available").length || 0,
        locked: data?.filter((t) => t.status === "locked").length || 0,
        sold: data?.filter((t) => t.status === "sold").length || 0,
        total: data?.length || 0,
      }

      return NextResponse.json({ data, summary })
    } else if (type === "profit") {
      // Profit analysis report
      let query = supabase
        .from("bookings")
        .select(`
          *,
          ticket:tickets(
            flight_number,
            buying_price,
            selling_price,
            airline_name
          )
        `)
        .eq("status", "confirmed")
        .order("created_at", { ascending: false })

      if (startDate) {
        query = query.gte("created_at", startDate)
      }
      if (endDate) {
        query = query.lte("created_at", endDate)
      }

      const { data, error } = await query

      if (error) throw error

      const summary = {
        totalProfit: data?.reduce((sum, b) => sum + (b.profit || 0), 0) || 0,
        totalCost: data?.reduce((sum, b) => sum + (b.ticket?.buying_price || 0), 0) || 0,
        totalRevenue: data?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0,
        profitMargin: 0,
      }

      if (summary.totalRevenue > 0) {
        summary.profitMargin = (summary.totalProfit / summary.totalRevenue) * 100
      }

      return NextResponse.json({ data, summary })
    }

    return NextResponse.json({ error: "Invalid report type" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Error generating report:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
