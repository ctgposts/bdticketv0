import { type NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServiceClient()
    const body = await request.json()

    const {
      airline_id,
      country_id,
      flight_number,
      origin,
      destination,
      departure_date,
      departure_time,
      arrival_time,
      buying_price,
      selling_price,
      quantity,
      batch_number,
      notes,
    } = body

    // Create multiple tickets
    const tickets = Array.from({ length: quantity }, (_, i) => ({
      airline_id,
      country_id,
      flight_number,
      origin,
      destination,
      departure_date,
      departure_time,
      arrival_time,
      buying_price,
      selling_price,
      total_seats: 1,
      available_seats: 1,
      batch_number: batch_number || `BATCH-${Date.now()}`,
      status: "available",
      notes,
    }))

    const { data, error } = await supabase.from("tickets").insert(tickets).select()

    if (error) throw error

    return NextResponse.json({
      success: true,
      count: data.length,
      tickets: data,
    })
  } catch (error) {
    console.error("[v0] Error creating bulk tickets:", error)
    return NextResponse.json({ error: "Failed to create bulk tickets" }, { status: 500 })
  }
}
