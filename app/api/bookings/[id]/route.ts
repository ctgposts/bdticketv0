import { NextResponse, NextRequest } from "next/server"

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
  },
]

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const bookingIndex = DEMO_BOOKINGS.findIndex((b) => b.id === id)
    if (bookingIndex === -1) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const updatedBooking = {
      ...DEMO_BOOKINGS[bookingIndex],
      ...body,
      id,
    }

    DEMO_BOOKINGS[bookingIndex] = updatedBooking

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error("[v0] Error updating booking:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const booking = DEMO_BOOKINGS.find((b) => b.id === id)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[v0] Error fetching booking:", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const bookingIndex = DEMO_BOOKINGS.findIndex((b) => b.id === id)

    if (bookingIndex === -1) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    DEMO_BOOKINGS.splice(bookingIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting booking:", error)
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 })
  }
}
