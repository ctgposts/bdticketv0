import { NextResponse } from "next/server"

// Mock bookings data
const mockBookings = [
  {
    id: "BK001",
    ticketInfo: {
      airline: "Saudi Airlines",
      flightNumber: "SV801",
      flightDate: "2024-12-25",
      route: "Dhaka → Riyadh",
    },
    agentInfo: {
      name: "Travel Agency XYZ",
      phone: "+880-1234-567890",
      email: "agency@example.com",
    },
    passengerInfo: {
      name: "Ahmed Rahman",
      passportNo: "AB1234567",
      phone: "+880-1987-654321",
      email: "ahmed@example.com",
      paxCount: 1,
    },
    sellingPrice: 45000,
    paymentType: "full" as const,
    paymentMethod: "cash",
    status: "confirmed" as const,
    createdAt: new Date("2024-01-15").toISOString(),
    createdBy: "staff",
  },
  {
    id: "BK002",
    ticketInfo: {
      airline: "Emirates",
      flightNumber: "EK582",
      flightDate: "2024-12-28",
      route: "Dhaka → Dubai",
    },
    agentInfo: {
      name: "Global Tours Ltd",
      phone: "+880-1555-123456",
      email: "global@example.com",
    },
    passengerInfo: {
      name: "Fatima Khan",
      passportNo: "CD9876543",
      phone: "+880-1777-888999",
      email: "fatima@example.com",
      paxCount: 2,
    },
    sellingPrice: 52000,
    paymentType: "partial" as const,
    partialAmount: 30000,
    paymentMethod: "bank_transfer",
    status: "pending" as const,
    createdAt: new Date("2024-01-16").toISOString(),
    createdBy: "staff",
  },
  {
    id: "BK003",
    ticketInfo: {
      airline: "Qatar Airways",
      flightNumber: "QR636",
      flightDate: "2024-12-30",
      route: "Dhaka → Doha",
    },
    agentInfo: {
      name: "Sky Travel Agency",
      phone: "+880-1666-777888",
      email: "sky@example.com",
    },
    passengerInfo: {
      name: "Mohammad Ali",
      passportNo: "EF5432109",
      phone: "+880-1888-999000",
      email: "mohammad@example.com",
      paxCount: 1,
    },
    sellingPrice: 48000,
    paymentType: "full" as const,
    paymentMethod: "cash",
    status: "confirmed" as const,
    createdAt: new Date("2024-01-17").toISOString(),
    createdBy: "staff",
  },
  {
    id: "BK004",
    ticketInfo: {
      airline: "Biman Bangladesh",
      flightNumber: "BG092",
      flightDate: "2025-01-05",
      route: "Dhaka → Jeddah",
    },
    agentInfo: {
      name: "Hajj & Umrah Services",
      phone: "+880-1444-555666",
      email: "hajj@example.com",
    },
    passengerInfo: {
      name: "Ayesha Begum",
      passportNo: "GH8765432",
      phone: "+880-1333-444555",
      email: "ayesha@example.com",
      paxCount: 1,
    },
    sellingPrice: 42000,
    paymentType: "partial" as const,
    partialAmount: 25000,
    paymentMethod: "mobile_banking",
    status: "locked" as const,
    createdAt: new Date("2024-01-18").toISOString(),
    createdBy: "staff",
  },
  {
    id: "BK005",
    ticketInfo: {
      airline: "Turkish Airlines",
      flightNumber: "TK713",
      flightDate: "2025-01-10",
      route: "Dhaka → Istanbul",
    },
    agentInfo: {
      name: "Euro Travel Partners",
      phone: "+880-1222-333444",
      email: "euro@example.com",
    },
    passengerInfo: {
      name: "Karim Hassan",
      passportNo: "IJ2345678",
      phone: "+880-1999-000111",
      email: "karim@example.com",
      paxCount: 3,
    },
    sellingPrice: 65000,
    paymentType: "full" as const,
    paymentMethod: "bank_transfer",
    status: "pending" as const,
    createdAt: new Date("2024-01-19").toISOString(),
    createdBy: "staff",
  },
]

// GET - List all bookings
export async function GET() {
  try {
    // In a real app, fetch from database
    return NextResponse.json({ bookings: mockBookings })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

// POST - Create new booking
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate new booking ID
    const newId = `BK${String(mockBookings.length + 1).padStart(3, "0")}`

    const newBooking = {
      id: newId,
      ...body,
      createdAt: new Date().toISOString(),
      status: "pending" as const,
    }

    // In a real app, save to database
    mockBookings.push(newBooking)

    return NextResponse.json({ success: true, booking: newBooking }, { status: 201 })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
