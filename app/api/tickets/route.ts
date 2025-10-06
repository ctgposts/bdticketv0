import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const destination = searchParams.get("destination")

    let query = supabase
      .from("tickets")
      .select("*, airline:airlines(name, code, logo_url), country:countries!tickets_country_id_fkey(name, code, flag)")
      .order("departure_date", { ascending: true })

    if (search) {
      query = query.or(`flight_number.ilike.%${search}%,destination.ilike.%${search}%,origin.ilike.%${search}%`)
    }

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (destination) {
      query = query.eq("country_id", destination)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching tickets:", error)
      throw error
    }

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
