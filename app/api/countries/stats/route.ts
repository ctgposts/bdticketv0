import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get all countries with ticket counts
    const { data: countries, error: countriesError } = await supabase.from("countries").select("*")

    if (countriesError) throw countriesError

    // Get ticket counts for each country
    const countriesWithStats = await Promise.all(
      countries.map(async (country) => {
        const { count: totalTickets } = await supabase
          .from("tickets")
          .select("*", { count: "exact", head: true })
          .eq("country_id", country.id)

        const { count: availableTickets } = await supabase
          .from("tickets")
          .select("*", { count: "exact", head: true })
          .eq("country_id", country.id)
          .eq("status", "available")

        return {
          code: country.code,
          name: country.name,
          flag: country.flag,
          totalTickets: totalTickets || 0,
          availableTickets: availableTickets || 0,
        }
      }),
    )

    return NextResponse.json({ countries: countriesWithStats })
  } catch (error) {
    console.error("[v0] Error fetching country stats:", error)
    return NextResponse.json({ error: "Failed to fetch country stats" }, { status: 500 })
  }
}
