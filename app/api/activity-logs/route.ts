import { NextResponse, NextRequest } from "next/server"

const DEMO_ACTIVITY_LOGS = [
  {
    id: "log-1",
    user_id: "default-user-1",
    action: "booking_created",
    description: "New booking created for Ahmed Hassan",
    booking_id: "bk-1",
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: "log-2",
    user_id: "default-user-1",
    action: "ticket_purchased",
    description: "Bulk ticket purchase of 20 tickets",
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "log-3",
    user_id: "default-user-1",
    action: "booking_confirmed",
    description: "Booking BK12345678 confirmed",
    booking_id: "bk-1",
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "log-4",
    user_id: "default-user-1",
    action: "payment_received",
    description: "Payment received for booking BK87654321",
    booking_id: "bk-2",
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "log-5",
    user_id: "default-user-1",
    action: "report_generated",
    description: "Sales report generated for the month",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const userId = searchParams.get("user_id")
    const action = searchParams.get("action")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let filtered = DEMO_ACTIVITY_LOGS

    if (userId) {
      filtered = filtered.filter((log) => log.user_id === userId)
    }

    if (action) {
      filtered = filtered.filter((log) => log.action === action)
    }

    const result = filtered.slice(0, limit).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error fetching activity logs:", error)
    return NextResponse.json({ error: "Failed to fetch activity logs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newLog = {
      id: `log-${Date.now()}`,
      ...body,
      created_at: new Date().toISOString(),
    }

    DEMO_ACTIVITY_LOGS.push(newLog)

    return NextResponse.json(newLog)
  } catch (error) {
    console.error("[v0] Error creating activity log:", error)
    return NextResponse.json({ error: "Failed to create activity log" }, { status: 500 })
  }
}
