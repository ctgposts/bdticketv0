import { type NextRequest, NextResponse } from "next/server"

const DEMO_UMRAH_BOOKINGS = [
  {
    id: "ub-1",
    package_id: "pkg-1",
    group_leader_name: "Sheikh Ahmed",
    group_leader_phone: "+880171234567",
    group_leader_email: "sheikh@example.com",
    number_of_pilgrims: 25,
    total_amount: 6250000,
    booking_reference: "UMH-2024-001",
    status: "confirmed",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ub-2",
    package_id: "pkg-2",
    group_leader_name: "Maulvi Hassan",
    group_leader_phone: "+880172234567",
    group_leader_email: "maulvi@example.com",
    number_of_pilgrims: 35,
    total_amount: 8750000,
    booking_reference: "UMH-2024-002",
    status: "pending",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ub-3",
    package_id: "pkg-3",
    group_leader_name: "Dr. Karim",
    group_leader_phone: "+880173234567",
    group_leader_email: "dr.karim@example.com",
    number_of_pilgrims: 40,
    total_amount: 10000000,
    booking_reference: "UMH-2024-003",
    status: "confirmed",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const status = searchParams.get("status")
    const packageId = searchParams.get("package_id")

    let filtered = DEMO_UMRAH_BOOKINGS

    if (status && status !== "all") {
      filtered = filtered.filter((b) => b.status === status)
    }

    if (packageId) {
      filtered = filtered.filter((b) => b.package_id === packageId)
    }

    const sorted = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json(sorted)
  } catch (error) {
    console.error("[v0] Error fetching umrah bookings:", error)
    return NextResponse.json({ error: "Failed to fetch umrah bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newBooking = {
      id: `ub-${Date.now()}`,
      booking_reference: `UMH-${Date.now().toString().slice(-6)}`,
      ...body,
      created_at: new Date().toISOString(),
    }

    DEMO_UMRAH_BOOKINGS.push(newBooking)

    return NextResponse.json(newBooking)
  } catch (error) {
    console.error("[v0] Error creating umrah booking:", error)
    return NextResponse.json({ error: "Failed to create umrah booking" }, { status: 500 })
  }
}
