import { NextResponse, NextRequest } from "next/server"

const DEMO_PAYMENTS = [
  {
    id: "pay-1",
    booking_id: "bk-1",
    booking_reference: "BK12345678",
    passenger_name: "Ahmed Hassan",
    amount: 95000,
    payment_method: "Bank Transfer",
    payment_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    transaction_id: "TXN-2024-001",
  },
  {
    id: "pay-2",
    booking_id: "bk-2",
    booking_reference: "BK87654321",
    passenger_name: "Fatima Khan",
    amount: 42500,
    payment_method: "Mobile Banking",
    payment_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    transaction_id: "TXN-2024-002",
  },
  {
    id: "pay-3",
    booking_id: "bk-3",
    booking_reference: "BK55555555",
    passenger_name: "Mohammad Ali",
    amount: 125000,
    payment_method: "Credit Card",
    payment_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    transaction_id: "TXN-2024-003",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get("booking_id")

    let filtered = DEMO_PAYMENTS

    if (bookingId) {
      filtered = filtered.filter((payment) => payment.booking_id === bookingId)
    }

    const sorted = filtered.sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())

    return NextResponse.json(sorted)
  } catch (error) {
    console.error("[v0] Error fetching payments:", error)
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newPayment = {
      id: `pay-${Date.now()}`,
      ...body,
      payment_date: new Date().toISOString(),
      status: "completed",
    }

    DEMO_PAYMENTS.push(newPayment)

    return NextResponse.json(newPayment)
  } catch (error) {
    console.error("[v0] Error creating payment:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
