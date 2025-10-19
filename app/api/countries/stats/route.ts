import { NextResponse } from "next/server"

const DEMO_COUNTRIES = [
  {
    code: "KSA",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    totalTickets: 55,
    availableTickets: 48,
  },
  {
    code: "UAE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    totalTickets: 55,
    availableTickets: 52,
  },
  {
    code: "QAT",
    name: "Qatar",
    flag: "🇶🇦",
    totalTickets: 25,
    availableTickets: 22,
  },
  {
    code: "KWT",
    name: "Kuwait",
    flag: "🇰🇼",
    totalTickets: 20,
    availableTickets: 18,
  },
  {
    code: "OMN",
    name: "Oman",
    flag: "🇴🇲",
    totalTickets: 15,
    availableTickets: 12,
  },
  {
    code: "BHR",
    name: "Bahrain",
    flag: "🇧🇭",
    totalTickets: 10,
    availableTickets: 8,
  },
  {
    code: "MYS",
    name: "Malaysia",
    flag: "🇲🇾",
    totalTickets: 18,
    availableTickets: 15,
  },
  {
    code: "SGP",
    name: "Singapore",
    flag: "🇸🇬",
    totalTickets: 12,
    availableTickets: 10,
  },
  {
    code: "THA",
    name: "Thailand",
    flag: "🇹🇭",
    totalTickets: 14,
    availableTickets: 11,
  },
  {
    code: "TUR",
    name: "Turkey",
    flag: "🇹🇷",
    totalTickets: 22,
    availableTickets: 18,
  },
]

export async function GET() {
  try {
    return NextResponse.json({ countries: DEMO_COUNTRIES })
  } catch (error) {
    console.error("[v0] Error fetching country stats:", error)
    return NextResponse.json({ error: "Failed to fetch country stats" }, { status: 500 })
  }
}
