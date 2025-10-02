import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const origin = searchParams.get("origin")
    const destination = searchParams.get("destination")

    let query = supabase
      .from("tickets")
      .select(`
        *,
        origin_country:countries!tickets_origin_country_id_fkey(name, code, flag),
        destination_country:countries!tickets_destination_country_id_fkey(name, code, flag),
        airline:airlines(name, code, logo)
      `)
      .order("departure_date", { ascending: true })

    if (search) {
      query = query.or(`flight_number.ilike.%${search}%,airline_name.ilike.%${search}%`)
    }

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (origin) {
      query = query.eq("origin_country_id", origin)
    }

    if (destination) {
      query = query.eq("destination_country_id", destination)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching tickets:", error)
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase.from("tickets").insert([body]).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error creating ticket:", error)
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}
