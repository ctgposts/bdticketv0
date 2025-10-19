import { NextResponse, NextRequest } from "next/server"

const DEMO_SALES_BOOKINGS = [
  {
    id: "booking-1",
    flight_number: "FG-101",
    airline_name: "FlyGlobal Airways",
    total_amount: 45000,
    passenger_name: "Ahmed Hassan",
    passenger_phone: "+880-1712-345678",
    status: "confirmed",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    profit: 8500,
  },
  {
    id: "booking-2",
    flight_number: "EK-205",
    airline_name: "Emirates",
    total_amount: 52000,
    passenger_name: "Fatima Khan",
    passenger_phone: "+880-1811-234567",
    status: "confirmed",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    profit: 9840,
  },
  {
    id: "booking-3",
    flight_number: "QR-332",
    airline_name: "Qatar Airways",
    total_amount: 58500,
    passenger_name: "Mohammad Ali",
    passenger_phone: "+880-1612-345678",
    status: "confirmed",
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    profit: 11700,
  },
  {
    id: "booking-4",
    flight_number: "BA-784",
    airline_name: "British Airways",
    total_amount: 48900,
    passenger_name: "Zainab Hossain",
    passenger_phone: "+880-1912-345678",
    status: "confirmed",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    profit: 9258,
  },
  {
    id: "booking-5",
    flight_number: "AF-118",
    airline_name: "Air France",
    total_amount: 55000,
    passenger_name: "Ibrahim Rahman",
    passenger_phone: "+880-1712-987654",
    status: "confirmed",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    profit: 10450,
  },
  {
    id: "booking-6",
    flight_number: "KL-857",
    airline_name: "KLM Royal Dutch",
    total_amount: 51200,
    passenger_name: "Noor Ahmed",
    passenger_phone: "+880-1512-345678",
    status: "confirmed",
    created_at: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    profit: 9728,
  },
]

const DEMO_INVENTORY = [
  {
    id: "ticket-1",
    flight_number: "FG-101",
    airline_name: "FlyGlobal Airways",
    status: "available",
    available_seats: 12,
    total_seats: 20,
    buying_price: 36500,
    selling_price: 45000,
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
  },
  {
    id: "ticket-4",
    flight_number: "BA-784",
    airline_name: "British Airways",
    status: "sold",
    available_seats: 0,
    total_seats: 18,
    buying_price: 39120,
    selling_price: 48900,
  },
  {
    id: "ticket-5",
    flight_number: "AF-118",
    airline_name: "Air France",
    status: "available",
    available_seats: 10,
    total_seats: 22,
    buying_price: 44000,
    selling_price: 55000,
  },
  {
    id: "ticket-6",
    flight_number: "KL-857",
    airline_name: "KLM Royal Dutch",
    status: "available",
    available_seats: 14,
    total_seats: 20,
    buying_price: 40960,
    selling_price: 51200,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "sales"

    if (type === "sales") {
      const summary = {
        totalBookings: DEMO_SALES_BOOKINGS.length,
        totalRevenue: DEMO_SALES_BOOKINGS.reduce((sum, b) => sum + b.total_amount, 0),
        totalProfit: DEMO_SALES_BOOKINGS.reduce((sum, b) => sum + b.profit, 0),
        averageTicketPrice:
          DEMO_SALES_BOOKINGS.reduce((sum, b) => sum + b.total_amount, 0) / DEMO_SALES_BOOKINGS.length,
      }

      return NextResponse.json({ data: DEMO_SALES_BOOKINGS, summary })
    } else if (type === "inventory") {
      const summary = {
        available: DEMO_INVENTORY.filter((t) => t.status === "available").length,
        locked: DEMO_INVENTORY.filter((t) => t.status === "locked").length,
        sold: DEMO_INVENTORY.filter((t) => t.status === "sold").length,
        total: DEMO_INVENTORY.length,
      }

      return NextResponse.json({ data: DEMO_INVENTORY, summary })
    } else if (type === "profit") {
      const summary = {
        totalProfit: DEMO_SALES_BOOKINGS.reduce((sum, b) => sum + b.profit, 0),
        totalCost: DEMO_INVENTORY.reduce((sum, t) => sum + t.buying_price, 0),
        totalRevenue: DEMO_SALES_BOOKINGS.reduce((sum, b) => sum + b.total_amount, 0),
        profitMargin: 0,
      }

      summary.profitMargin = (summary.totalProfit / summary.totalRevenue) * 100

      const profitData = DEMO_SALES_BOOKINGS.map((booking) => ({
        ...booking,
        profitMargin: ((booking.profit / booking.total_amount) * 100).toFixed(2),
      }))

      return NextResponse.json({ data: profitData, summary })
    }

    return NextResponse.json({ error: "Invalid report type" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Error generating report:", error)
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 })
  }
}
