import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        id,
        ticket_id,
        customer_name,
        customer_phone,
        customer_email,
        customer_passport,
        status,
        amount,
        booking_date,
        created_at,
        updated_at,
        tickets(
          id,
          flight_number,
          origin,
          destination,
          departure_date,
          departure_time,
          arrival_time,
          airlines(name, code),
          destination_country:destination_country_id(name, code, flag)
        )
      `
      )
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Start a transaction-like operation
    // First, create the booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert([
        {
          ticket_id: body.ticket_id,
          customer_name: body.customer_name,
          customer_phone: body.customer_phone,
          customer_email: body.customer_email,
          customer_passport: body.customer_passport || null,
          status: "pending",
          amount: body.amount,
          created_by: user?.id,
        },
      ])
      .select()
      .single()

    if (bookingError) {
      return NextResponse.json({ error: bookingError.message }, { status: 400 })
    }

    // Log activity
    await supabase.from("activity_logs").insert([
      {
        user_id: user?.id || null,
        action: "CREATE",
        resource_type: "booking",
        resource_id: booking.id,
        description: `Created booking for ${body.customer_name}`,
      },
    ])

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
