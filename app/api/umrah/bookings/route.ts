import { type NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const searchParams = request.nextUrl.searchParams

    const status = searchParams.get("status")
    const packageId = searchParams.get("package_id")

    let query = supabase
      .from("umrah_bookings")
      .select(`
        *,
        package:umrah_packages(package_name, package_type, departure_date),
        pilgrims:umrah_pilgrims(count)
      `)
      .order("created_at", { ascending: false })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (packageId) {
      query = query.eq("package_id", packageId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Error fetching umrah bookings:", error)
    return NextResponse.json({ error: "Failed to fetch umrah bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const body = await request.json()

    const { pilgrims, ...bookingData } = body

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("umrah_bookings")
      .insert([bookingData])
      .select()
      .single()

    if (bookingError) throw bookingError

    // Create pilgrims if provided
    if (pilgrims && pilgrims.length > 0) {
      const pilgrimsData = pilgrims.map((p: any) => ({
        ...p,
        booking_id: booking.id,
      }))

      const { error: pilgrimsError } = await supabase.from("umrah_pilgrims").insert(pilgrimsData)

      if (pilgrimsError) throw pilgrimsError
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[v0] Error creating umrah booking:", error)
    return NextResponse.json({ error: "Failed to create umrah booking" }, { status: 500 })
  }
}
