import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get countries with ticket statistics
    const { data: countries, error: countriesError } = await supabase
      .from("countries")
      .select("id, name, code, flag")
      .order("name")

    if (countriesError) {
      console.error("[v0] Supabase error:", countriesError)
      return NextResponse.json({ error: countriesError.message }, { status: 500 })
    }

    // Get ticket counts per country
    const { data: ticketStats, error: ticketsError } = await supabase
      .from("tickets")
      .select("destination_country_id, status")

    if (ticketsError) {
      console.error("[v0] Supabase error:", ticketsError)
      return NextResponse.json({ error: ticketsError.message }, { status: 500 })
    }

    // Calculate statistics for each country
    const statsMap = new Map<string, { total: number; available: number }>()

    ticketStats?.forEach((ticket: any) => {
      const countryId = ticket.destination_country_id
      if (!statsMap.has(countryId)) {
        statsMap.set(countryId, { total: 0, available: 0 })
      }

      const stats = statsMap.get(countryId)!
      stats.total += 1
      if (ticket.status === "available") {
        stats.available += 1
      }
    })

    // Enrich countries with stats
    const enrichedCountries = countries.map((country: any) => {
      const stats = statsMap.get(country.id) || { total: 0, available: 0 }
      return {
        ...country,
        totalTickets: stats.total,
        availableTickets: stats.available,
      }
    })

    return NextResponse.json({ countries: enrichedCountries })
  } catch (error) {
    console.error("[v0] Error fetching countries stats:", error)
    return NextResponse.json({ error: "Failed to fetch countries statistics" }, { status: 500 })
  }
}
