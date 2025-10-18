import { type NextRequest, NextResponse } from "next/server"

const DEMO_PACKAGES = [
  {
    id: "pkg-1",
    package_name: "Standard Umrah 2024",
    package_type: "standard",
    duration_days: 7,
    makkah_hotel: "Al Noor Hotel",
    madinah_hotel: "Al Hana Hotel",
    makkah_nights: 4,
    madinah_nights: 3,
    departure_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    return_date: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString(),
    total_seats: 30,
    available_seats: 8,
    package_price: 85000,
    status: "active",
    airline: {
      name: "Bangladesh Biman Airways",
      code: "BG",
      logo_url: "https://via.placeholder.com/50",
    },
  },
  {
    id: "pkg-2",
    package_name: "Premium Umrah 2024",
    package_type: "premium",
    duration_days: 10,
    makkah_hotel: "Pullman Zamzam Makkah",
    madinah_hotel: "Pullman Madinah",
    makkah_nights: 6,
    madinah_nights: 4,
    departure_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    return_date: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000).toISOString(),
    total_seats: 20,
    available_seats: 5,
    package_price: 125000,
    status: "active",
    airline: {
      name: "Emirates",
      code: "EK",
      logo_url: "https://via.placeholder.com/50",
    },
  },
  {
    id: "pkg-3",
    package_name: "VIP Umrah 2024",
    package_type: "vip",
    duration_days: 12,
    makkah_hotel: "Swissotel Al Maqam Makkah",
    madinah_hotel: "InterContinental Madinah",
    makkah_nights: 7,
    madinah_nights: 5,
    departure_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    return_date: new Date(Date.now() + 72 * 24 * 60 * 60 * 1000).toISOString(),
    total_seats: 15,
    available_seats: 3,
    package_price: 180000,
    status: "active",
    airline: {
      name: "Qatar Airways",
      code: "QR",
      logo_url: "https://via.placeholder.com/50",
    },
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const packageType = searchParams.get("type")

    let filteredPackages = DEMO_PACKAGES

    if (status && status !== "all") {
      filteredPackages = filteredPackages.filter((pkg) => pkg.status === status)
    }

    if (packageType && packageType !== "all") {
      filteredPackages = filteredPackages.filter((pkg) => pkg.package_type === packageType)
    }

    return NextResponse.json(filteredPackages)
  } catch (error) {
    console.error("[v0] Error fetching umrah packages:", error)
    return NextResponse.json({ error: "Failed to fetch umrah packages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newPackage = {
      id: `pkg-${Date.now()}`,
      ...body,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(newPackage)
  } catch (error) {
    console.error("[v0] Error creating umrah package:", error)
    return NextResponse.json({ error: "Failed to create umrah package" }, { status: 500 })
  }
}
