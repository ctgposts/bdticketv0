import { NextResponse } from "next/server"

const DEMO_TICKETS = [
  {
    id: "ticket-1",
    flight_number: "BA-1001",
    airline_name: "Bangladesh Biman Airways",
    origin: "Dhaka (DAC)",
    destination: "Dubai (DXB)",
    departure_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    departure_time: "14:30",
    arrival_time: "17:45",
    selling_price: 95000,
    buying_price: 85000,
    available_seats: 8,
    total_seats: 10,
    status: "available",
    destination_country: { name: "United Arab Emirates", code: "UAE", flag: "🇦🇪" },
    origin_country: { name: "Bangladesh", code: "BD", flag: "🇧🇩" },
    airline: { name: "Bangladesh Biman Airways", code: "BG", logo_url: "https://via.placeholder.com/50" },
  },
  {
    id: "ticket-2",
    flight_number: "EK-2002",
    airline_name: "Emirates",
    origin: "Dhaka (DAC)",
    destination: "Jeddah (JED)",
    departure_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    departure_time: "23:15",
    arrival_time: "03:30",
    selling_price: 105000,
    buying_price: 92000,
    available_seats: 5,
    total_seats: 10,
    status: "available",
    destination_country: { name: "Saudi Arabia", code: "KSA", flag: "🇸🇦" },
    origin_country: { name: "Bangladesh", code: "BD", flag: "🇧🇩" },
    airline: { name: "Emirates", code: "EK", logo_url: "https://via.placeholder.com/50" },
  },
  {
    id: "ticket-3",
    flight_number: "QR-3003",
    airline_name: "Qatar Airways",
    origin: "Dhaka (DAC)",
    destination: "Doha (DOH)",
    departure_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    departure_time: "10:00",
    arrival_time: "12:45",
    selling_price: 85000,
    buying_price: 75000,
    available_seats: 12,
    total_seats: 15,
    status: "available",
    destination_country: { name: "Qatar", code: "QAT", flag: "🇶🇦" },
    origin_country: { name: "Bangladesh", code: "BD", flag: "🇧🇩" },
    airline: { name: "Qatar Airways", code: "QR", logo_url: "https://via.placeholder.com/50" },
  },
  {
    id: "ticket-4",
    flight_number: "TK-4004",
    airline_name: "Turkish Airlines",
    origin: "Dhaka (DAC)",
    destination: "Istanbul (IST)",
    departure_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    departure_time: "08:00",
    arrival_time: "13:30",
    selling_price: 125000,
    buying_price: 110000,
    available_seats: 0,
    total_seats: 10,
    status: "sold",
    destination_country: { name: "Turkey", code: "TUR", flag: "🇹🇷" },
    origin_country: { name: "Bangladesh", code: "BD", flag: "🇧🇩" },
    airline: { name: "Turkish Airlines", code: "TK", logo_url: "https://via.placeholder.com/50" },
  },
  {
    id: "ticket-5",
    flight_number: "SV-5005",
    airline_name: "Saudi Airlines",
    origin: "Dhaka (DAC)",
    destination: "Riyadh (RIY)",
    departure_date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    departure_time: "16:45",
    arrival_time: "19:30",
    selling_price: 110000,
    buying_price: 98000,
    available_seats: 3,
    total_seats: 10,
    status: "locked",
    destination_country: { name: "Saudi Arabia", code: "KSA", flag: "🇸🇦" },
    origin_country: { name: "Bangladesh", code: "BD", flag: "🇧🇩" },
    airline: { name: "Saudi Airlines", code: "SV", logo_url: "https://via.placeholder.com/50" },
  },
  {
    id: "ticket-6",
    flight_number: "AK-6006",
    airline_name: "Air Asia",
    origin: "Dhaka (DAC)",
    destination: "Kuala Lumpur (KUL)",
    departure_date: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    departure_time: "22:00",
    arrival_time: "04:15",
    selling_price: 72000,
    buying_price: 62000,
    available_seats: 18,
    total_seats: 20,
    status: "available",
    destination_country: { name: "Malaysia", code: "MYS", flag: "🇲🇾" },
    origin_country: { name: "Bangladesh", code: "BD", flag: "🇧🇩" },
    airline: { name: "Air Asia", code: "AK", logo_url: "https://via.placeholder.com/50" },
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const destination = searchParams.get("destination")

    let filteredTickets = DEMO_TICKETS

    if (search) {
      const searchLower = search.toLowerCase()
      filteredTickets = filteredTickets.filter(
        (ticket) =>
          ticket.flight_number.toLowerCase().includes(searchLower) ||
          ticket.destination.toLowerCase().includes(searchLower) ||
          ticket.origin.toLowerCase().includes(searchLower),
      )
    }

    if (status && status !== "all") {
      filteredTickets = filteredTickets.filter((ticket) => ticket.status === status)
    }

    if (destination) {
      filteredTickets = filteredTickets.filter((ticket) => ticket.destination_country.code === destination)
    }

    // Sort by departure date
    filteredTickets.sort(
      (a, b) => new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime(),
    )

    return NextResponse.json(filteredTickets)
  } catch (error) {
    console.error("[v0] Error fetching tickets:", error)
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const newTicket = {
      id: `ticket-${Date.now()}`,
      ...body,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(newTicket)
  } catch (error) {
    console.error("[v0] Error creating ticket:", error)
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}
