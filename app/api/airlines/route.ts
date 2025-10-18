import { NextResponse } from "next/server"

const DEMO_AIRLINES = [
  {
    id: "airline-1",
    name: "Bangladesh Biman Airways",
    code: "BG",
    logo_url: "https://via.placeholder.com/50",
  },
  {
    id: "airline-2",
    name: "Emirates",
    code: "EK",
    logo_url: "https://via.placeholder.com/50",
  },
  {
    id: "airline-3",
    name: "Qatar Airways",
    code: "QR",
    logo_url: "https://via.placeholder.com/50",
  },
  {
    id: "airline-4",
    name: "Turkish Airlines",
    code: "TK",
    logo_url: "https://via.placeholder.com/50",
  },
  {
    id: "airline-5",
    name: "Saudi Airlines",
    code: "SV",
    logo_url: "https://via.placeholder.com/50",
  },
  {
    id: "airline-6",
    name: "Air Asia",
    code: "AK",
    logo_url: "https://via.placeholder.com/50",
  },
  {
    id: "airline-7",
    name: "Malaysia Airlines",
    code: "MH",
    logo_url: "https://via.placeholder.com/50",
  },
  {
    id: "airline-8",
    name: "Singapore Airlines",
    code: "SQ",
    logo_url: "https://via.placeholder.com/50",
  },
  {
    id: "airline-9",
    name: "Thai Airways",
    code: "TG",
    logo_url: "https://via.placeholder.com/50",
  },
  {
    id: "airline-10",
    name: "Flydubai",
    code: "FZ",
    logo_url: "https://via.placeholder.com/50",
  },
]

export async function GET() {
  try {
    return NextResponse.json(DEMO_AIRLINES)
  } catch (error) {
    console.error("[v0] Error fetching airlines:", error)
    return NextResponse.json({ error: "Failed to fetch airlines" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const newAirline = {
      id: `airline-${Date.now()}`,
      ...body,
      logo_url: body.logo_url || "https://via.placeholder.com/50",
    }

    return NextResponse.json(newAirline)
  } catch (error) {
    console.error("[v0] Error creating airline:", error)
    return NextResponse.json({ error: "Failed to create airline" }, { status: 500 })
  }
}
