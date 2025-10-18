import { NextResponse } from "next/server"

const DEMO_COUNTRIES = [
  {
    id: "country-1",
    name: "Saudi Arabia",
    code: "KSA",
    flag: "🇸🇦",
    ticketCount: 55,
  },
  {
    id: "country-2",
    name: "United Arab Emirates",
    code: "UAE",
    flag: "🇦🇪",
    ticketCount: 55,
  },
  {
    id: "country-3",
    name: "Qatar",
    code: "QAT",
    flag: "🇶🇦",
    ticketCount: 25,
  },
  {
    id: "country-4",
    name: "Kuwait",
    code: "KWT",
    flag: "🇰🇼",
    ticketCount: 20,
  },
  {
    id: "country-5",
    name: "Oman",
    code: "OMN",
    flag: "🇴🇲",
    ticketCount: 15,
  },
  {
    id: "country-6",
    name: "Bahrain",
    code: "BHR",
    flag: "🇧🇭",
    ticketCount: 10,
  },
  {
    id: "country-7",
    name: "Malaysia",
    code: "MYS",
    flag: "🇲🇾",
    ticketCount: 18,
  },
  {
    id: "country-8",
    name: "Singapore",
    code: "SGP",
    flag: "🇸🇬",
    ticketCount: 12,
  },
  {
    id: "country-9",
    name: "Thailand",
    code: "THA",
    flag: "🇹🇭",
    ticketCount: 14,
  },
  {
    id: "country-10",
    name: "Turkey",
    code: "TUR",
    flag: "🇹🇷",
    ticketCount: 22,
  },
]

export async function GET() {
  try {
    return NextResponse.json(DEMO_COUNTRIES)
  } catch (error) {
    console.error("[v0] Error fetching countries:", error)
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const newCountry = {
      id: `country-${Date.now()}`,
      ...body,
      ticketCount: 0,
    }

    return NextResponse.json(newCountry)
  } catch (error) {
    console.error("[v0] Error creating country:", error)
    return NextResponse.json({ error: "Failed to create country" }, { status: 500 })
  }
}
