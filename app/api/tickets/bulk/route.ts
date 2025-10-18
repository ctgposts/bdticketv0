import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
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
      created_by,
    } = body

    // Validate required fields
    if (
      !airline_id ||
      !country_id ||
      !flight_number ||
      !origin ||
      !destination ||
      !departure_date ||
      !departure_time ||
      !buying_price ||
      !selling_price ||
      !quantity
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create multiple tickets
    const tickets = Array.from({ length: quantity }, (_, i) => ({
      id: `ticket-${Date.now()}-${i}`,
      airline_id,
      country_id,
      flight_number,
      origin,
      destination,
      departure_date,
      departure_time,
      arrival_time: arrival_time || null,
      buying_price: Number(buying_price),
      selling_price: Number(selling_price),
      total_seats: 1,
      available_seats: 1,
      batch_number: batch_number || `BATCH-${Date.now()}`,
      status: "available",
      notes: notes || "",
      created_by: created_by || "admin",
      created_at: new Date().toISOString(),
    }))

    return NextResponse.json({
      success: true,
      count: tickets.length,
      tickets: tickets,
    })
  } catch (error) {
    console.error("[v0] Error creating bulk tickets:", error)
    return NextResponse.json({ error: "Failed to create bulk tickets" }, { status: 500 })
  }
}
