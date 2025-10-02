import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock ticket data
    const tickets = [
      {
        id: "1",
        sl: 1,
        airline: "Saudi Airlines",
        flight_number: "SV801",
        departure_date: "2024-12-25",
        departure_time: "10:30 AM",
        arrival_time: "2:45 PM",
        selling_price: 45000,
        buying_price: 42000,
        available_seats: 5,
        total_seats: 10,
        status: "available",
        country: { code: "KSA", name: "Saudi Arabia", flag: "🇸🇦" },
        origin: "Dhaka",
        destination: "Riyadh",
      },
      {
        id: "2",
        sl: 2,
        airline: "Emirates",
        flight_number: "EK582",
        departure_date: "2024-12-26",
        departure_time: "11:00 AM",
        arrival_time: "3:30 PM",
        selling_price: 48000,
        buying_price: 45000,
        available_seats: 8,
        total_seats: 15,
        status: "available",
        country: { code: "UAE", name: "United Arab Emirates", flag: "🇦🇪" },
        origin: "Dhaka",
        destination: "Dubai",
      },
      {
        id: "3",
        sl: 3,
        airline: "Qatar Airways",
        flight_number: "QR636",
        departure_date: "2024-12-27",
        departure_time: "9:00 AM",
        arrival_time: "12:30 PM",
        selling_price: 46000,
        buying_price: 43500,
        available_seats: 12,
        total_seats: 20,
        status: "available",
        country: { code: "QAT", name: "Qatar", flag: "🇶🇦" },
        origin: "Dhaka",
        destination: "Doha",
      },
      {
        id: "4",
        sl: 4,
        airline: "Biman Bangladesh",
        flight_number: "BG345",
        departure_date: "2024-12-28",
        departure_time: "2:00 PM",
        arrival_time: "6:15 PM",
        selling_price: 42000,
        buying_price: 39000,
        available_seats: 3,
        total_seats: 8,
        status: "available",
        country: { code: "KSA", name: "Saudi Arabia", flag: "🇸🇦" },
        origin: "Dhaka",
        destination: "Jeddah",
      },
      {
        id: "5",
        sl: 5,
        airline: "Fly Dubai",
        flight_number: "FZ571",
        departure_date: "2024-12-29",
        departure_time: "8:30 AM",
        arrival_time: "12:00 PM",
        selling_price: 44000,
        buying_price: 41000,
        available_seats: 0,
        total_seats: 10,
        status: "sold",
        country: { code: "UAE", name: "United Arab Emirates", flag: "🇦🇪" },
        origin: "Dhaka",
        destination: "Dubai",
      },
      {
        id: "6",
        sl: 6,
        airline: "Saudi Airlines",
        flight_number: "SV803",
        departure_date: "2024-12-30",
        departure_time: "11:45 PM",
        arrival_time: "4:00 AM",
        selling_price: 47000,
        buying_price: 44000,
        available_seats: 6,
        total_seats: 12,
        status: "available",
        country: { code: "KSA", name: "Saudi Arabia", flag: "🇸🇦" },
        origin: "Dhaka",
        destination: "Riyadh",
      },
      {
        id: "7",
        sl: 7,
        airline: "Air Arabia",
        flight_number: "G9523",
        departure_date: "2024-12-31",
        departure_time: "3:30 PM",
        arrival_time: "7:00 PM",
        selling_price: 43000,
        buying_price: 40000,
        available_seats: 4,
        total_seats: 10,
        status: "locked",
        country: { code: "UAE", name: "United Arab Emirates", flag: "🇦🇪" },
        origin: "Dhaka",
        destination: "Sharjah",
      },
    ]

    return NextResponse.json({ tickets })
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Mock creating a new ticket batch
    const newTicket = {
      id: Date.now().toString(),
      ...body,
      status: "available",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ ticket: newTicket }, { status: 201 })
  } catch (error) {
    console.error("Error creating ticket:", error)
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}
