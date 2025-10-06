import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search")
    const status = searchParams.get("status")

    let query = supabase
      .from("bookings")
      .select(`
        *,
        ticket:tickets(
          *,
          country:countries!tickets_country_id_fkey(name, code, flag),
          airline:airlines(name, code, logo_url)
        )
      `)
      .order("created_at", { ascending: false })

    if (search) {
      query = query.or(
        `booking_reference.ilike.%${search}%,passenger_name.ilike.%${search}%,agent_name.ilike.%${search}%`,
      )
    }

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching bookings:", error)
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Generate booking reference
    const bookingReference = `BK${Date.now().toString().slice(-8)}`

    const { data, error } = await supabase
      .from("bookings")
      .insert([{ ...body, booking_reference: bookingReference }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
