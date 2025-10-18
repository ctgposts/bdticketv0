import { NextResponse } from "next/server"

const DEMO_BOOKINGS = [
  {
    id: "bk-1",
    booking_reference: "BK12345678",
    ticket_id: "tk-1",
    passenger_name: "Ahmed Hassan",
    passenger_passport: "BD1234567890",
    passenger_phone: "+880172345678",
    passenger_email: "ahmed@example.com",
    agent_name: "Admin",
    agent_phone: "+880171234567",
    agent_email: "admin@example.com",
    total_amount: 95000,
    payment_type: "full",
    payment_method: "Bank Transfer",
    status: "confirmed",
    profit: 10000,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    ticket: {
      id: "tk-1",
      flight_number: "BA-1001",
      airline_name: "Bangladesh Biman Airways",
      departure_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      origin_country: { name: "Bangladesh", code: "BD" },
      destination_country: { name: "Saudi Arabia", code: "KSA" },
      airline: { name: "Bangladesh Biman Airways", code: "BG" },
    },
  },
  {
    id: "bk-2",
    booking_reference: "BK87654321",
    ticket_id: "tk-2",
    passenger_name: "Fatima Khan",
    passenger_passport: "BD9876543210",
    passenger_phone: "+880198765432",
    passenger_email: "fatima@example.com",
    agent_name: "Admin",
    agent_phone: "+880171234567",
    agent_email: "admin@example.com",
    total_amount: 85000,
    payment_type: "partial",
    partial_amount: 42500,
    payment_method: "Mobile Banking",
    status: "pending",
    profit: 8000,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    ticket: {
      id: "tk-2",
      flight_number: "EK-2002",
      airline_name: "Emirates",
      departure_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      origin_country: { name: "Bangladesh", code: "BD" },
      destination_country: { name: "United Arab Emirates", code: "UAE" },
      airline: { name: "Emirates", code: "EK" },
    },
  },
  {
    id: "bk-3",
    booking_reference: "BK55555555",
    ticket_id: "tk-3",
    passenger_name: "Mohammad Ali",
    passenger_passport: "BD5555555555",
    passenger_phone: "+880156789012",
    passenger_email: "ali@example.com",
    agent_name: "Admin",
    agent_phone: "+880171234567",
    agent_email: "admin@example.com",
    total_amount: 125000,
    payment_type: "full",
    payment_method: "Credit Card",
    status: "confirmed",
    profit: 15000,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    ticket: {
      id: "tk-3",
      flight_number: "QR-3003",
      airline_name: "Qatar Airways",
      departure_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      origin_country: { name: "Bangladesh", code: "BD" },
      destination_country: { name: "Qatar", code: "QAT" },
      airline: { name: "Qatar Airways", code: "QR" },
    },
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    let filteredBookings = DEMO_BOOKINGS

    if (search) {
      const searchLower = search.toLowerCase()
      filteredBookings = filteredBookings.filter(
        (booking) =>
          booking.booking_reference.toLowerCase().includes(searchLower) ||
          booking.passenger_name.toLowerCase().includes(searchLower) ||
          booking.agent_name.toLowerCase().includes(searchLower),
      )
    }

    if (status && status !== "all") {
      filteredBookings = filteredBookings.filter((booking) => booking.status === status)
    }

    // Sort by creation date descending
    filteredBookings.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )

    return NextResponse.json(filteredBookings)
  } catch (error) {
    console.error("[v0] Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const bookingReference = `BK${Date.now().toString().slice(-8)}`

    const newBooking = {
      id: `bk-${Date.now()}`,
      booking_reference: bookingReference,
      ...body,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(newBooking)
  } catch (error) {
    console.error("[v0] Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
