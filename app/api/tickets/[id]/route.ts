import { NextResponse, NextRequest } from "next/server"

const DEMO_TICKETS = [
  {
    id: "ticket-1",
    flight_number: "FG-101",
    airline_name: "FlyGlobal Airways",
    status: "available",
    available_seats: 12,
    total_seats: 20,
    buying_price: 36500,
    selling_price: 45000,
    departure_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ticket-2",
    flight_number: "EK-205",
    airline_name: "Emirates",
    status: "locked",
    available_seats: 5,
    total_seats: 15,
    buying_price: 41600,
    selling_price: 52000,
    departure_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ticket-3",
    flight_number: "QR-332",
    airline_name: "Qatar Airways",
    status: "available",
    available_seats: 8,
    total_seats: 25,
    buying_price: 46800,
    selling_price: 58500,
    departure_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const ticket = DEMO_TICKETS.find((t) => t.id === id)

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("[v0] Error fetching ticket:", error)
    return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const ticketIndex = DEMO_TICKETS.findIndex((t) => t.id === id)
    if (ticketIndex === -1) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    const updatedTicket = {
      ...DEMO_TICKETS[ticketIndex],
      ...body,
      id,
    }

    DEMO_TICKETS[ticketIndex] = updatedTicket

    return NextResponse.json(updatedTicket)
  } catch (error) {
    console.error("[v0] Error updating ticket:", error)
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const ticketIndex = DEMO_TICKETS.findIndex((t) => t.id === id)

    if (ticketIndex === -1) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    DEMO_TICKETS.splice(ticketIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting ticket:", error)
    return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 })
  }
}
