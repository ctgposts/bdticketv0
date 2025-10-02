import { NextResponse } from "next/server"

export async function GET() {
  // Mock countries data matching the expected format
  const countries = [
    { code: "KSA", name: "Saudi Arabia", flag: "🇸🇦", totalTickets: 55, availableTickets: 48 },
    { code: "UAE", name: "United Arab Emirates", flag: "🇦🇪", totalTickets: 55, availableTickets: 52 },
    { code: "QAT", name: "Qatar", flag: "🇶🇦", totalTickets: 25, availableTickets: 22 },
    { code: "KWT", name: "Kuwait", flag: "🇰🇼", totalTickets: 20, availableTickets: 18 },
    { code: "OMN", name: "Oman", flag: "🇴🇲", totalTickets: 15, availableTickets: 12 },
    { code: "BHR", name: "Bahrain", flag: "🇧🇭", totalTickets: 10, availableTickets: 8 },
  ]

  return NextResponse.json({ countries })
}
