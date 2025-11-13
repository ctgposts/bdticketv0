import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const destination = searchParams.get("destination")

    const supabase = await createClient()

    let query = supabase
      .from("tickets")
      .select(
        `
        id,
        flight_number,
        origin,
        destination,
        departure_date,
        departure_time,
        arrival_time,
        buying_price,
        selling_price,
        available_seats,
        total_seats,
        status,
        batch_number,
        airline_id,
        destination_country_id,
        origin_country_id,
        airlines(id, name, code, logo_url),
        destination_country:destination_country_id(id, name, code, flag),
        origin_country:origin_country_id(id, name, code, flag)
      `
      )
      .order("departure_date", { ascending: true })

    // Apply filters
    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (destination) {
      query = query.eq("destination_country_id", destination)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Apply search filter on client side for complex queries
    let filteredData = data || []

    if (search) {
      const searchLower = search.toLowerCase()
      filteredData = filteredData.filter((ticket: any) =>
        ticket.flight_number.toLowerCase().includes(searchLower) ||
        ticket.destination.toLowerCase().includes(searchLower) ||
        ticket.origin.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json(filteredData)
  } catch (error) {
    console.error("[v0] Error fetching tickets:", error)
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from("tickets")
      .insert([
        {
          flight_number: body.flight_number,
          airline_id: body.airline_id,
          origin: body.origin,
          destination: body.destination,
          destination_country_id: body.destination_country_id,
          origin_country_id: body.origin_country_id,
          departure_date: body.departure_date,
          departure_time: body.departure_time,
          arrival_time: body.arrival_time,
          buying_price: body.buying_price,
          selling_price: body.selling_price,
          total_seats: body.total_seats || 10,
          available_seats: body.available_seats || body.total_seats || 10,
          status: body.status || "available",
          batch_number: body.batch_number,
          created_by: user?.id,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating ticket:", error)
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}
