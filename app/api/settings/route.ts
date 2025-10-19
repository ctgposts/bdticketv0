import { NextResponse, NextRequest } from "next/server"

const DEMO_SETTINGS = {
  system: {
    companyName: "TravelHub Tickets",
    companyEmail: "info@travelhub.com",
    timezone: "Asia/Dhaka",
    currency: "BDT",
    language: "en",
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    bookingConfirmation: true,
    paymentReminder: true,
    ticketExpiry: true,
  },
  business: {
    profitMarginPercentage: 18.5,
    lockDuration: 30,
    autoConfirmBookings: true,
    requirePaymentConfirmation: true,
    taxPercentage: 15,
  },
  users: [
    {
      id: "user-1",
      name: "Admin User",
      email: "admin@travelhub.com",
      role: "admin",
      status: "active",
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "user-2",
      name: "Manager User",
      email: "manager@travelhub.com",
      role: "manager",
      status: "active",
      createdAt: "2024-02-20T14:45:00Z",
    },
    {
      id: "user-3",
      name: "Staff User",
      email: "staff@travelhub.com",
      role: "staff",
      status: "active",
      createdAt: "2024-03-10T09:15:00Z",
    },
  ],
  integrations: {
    supabase: {
      enabled: false,
      status: "not_configured",
    },
    sms: {
      enabled: true,
      provider: "twilio",
      status: "active",
    },
    email: {
      enabled: true,
      provider: "sendgrid",
      status: "active",
    },
    payment: {
      enabled: true,
      provider: "stripe",
      status: "active",
    },
  },
  backup: {
    lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    autoBackup: true,
    backupFrequency: "daily",
  },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get("section")

    if (section && section in DEMO_SETTINGS) {
      const sectionKey = section as keyof typeof DEMO_SETTINGS
      return NextResponse.json({ [section]: DEMO_SETTINGS[sectionKey] })
    }

    return NextResponse.json(DEMO_SETTINGS)
  } catch (error) {
    console.error("[v0] Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { section, data } = body

    if (section && section in DEMO_SETTINGS) {
      const sectionKey = section as keyof typeof DEMO_SETTINGS
      Object.assign(DEMO_SETTINGS[sectionKey], data)
      return NextResponse.json({
        success: true,
        message: "Settings updated successfully",
        [section]: DEMO_SETTINGS[sectionKey],
      })
    }

    return NextResponse.json({ error: "Invalid section" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
