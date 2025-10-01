import type { Country, Ticket, Booking } from "@/types"

// Mock data for development
export const mockCountries: Country[] = [
  {
    id: "1",
    name: "Saudi Arabia",
    code: "SA",
    flag: "🇸🇦",
    ticketCount: 150,
  },
  {
    id: "2",
    name: "United Arab Emirates",
    code: "AE",
    flag: "🇦🇪",
    ticketCount: 85,
  },
  {
    id: "3",
    name: "Malaysia",
    code: "MY",
    flag: "🇲🇾",
    ticketCount: 120,
  },
  {
    id: "4",
    name: "Thailand",
    code: "TH",
    flag: "🇹🇭",
    ticketCount: 95,
  },
  {
    id: "5",
    name: "Singapore",
    code: "SG",
    flag: "🇸🇬",
    ticketCount: 60,
  },
]

export const mockTickets: Ticket[] = [
  {
    id: "T001",
    countryId: "1",
    batchNumber: "BATCH-2024-001",
    buyingPrice: 45000,
    sellingPrice: 52000,
    status: "available",
  },
  {
    id: "T002",
    countryId: "1",
    batchNumber: "BATCH-2024-001",
    buyingPrice: 45000,
    sellingPrice: 52000,
    status: "locked",
    lockedUntil: new Date(Date.now() + 3600000).toISOString(),
  },
  {
    id: "T003",
    countryId: "2",
    batchNumber: "BATCH-2024-002",
    buyingPrice: 38000,
    sellingPrice: 44000,
    status: "available",
  },
  {
    id: "T004",
    countryId: "3",
    batchNumber: "BATCH-2024-003",
    buyingPrice: 28000,
    sellingPrice: 33000,
    status: "sold",
  },
]

export const mockBookings: Booking[] = [
  {
    id: "B001",
    ticketId: "T002",
    customerName: "Ahmed Rahman",
    customerPhone: "+880 1712-345678",
    customerEmail: "ahmed@example.com",
    status: "pending",
    amount: 52000,
    createdAt: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: "B002",
    ticketId: "T004",
    customerName: "Fatima Khan",
    customerPhone: "+880 1812-345678",
    customerEmail: "fatima@example.com",
    status: "confirmed",
    amount: 33000,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
]

// Helper functions to calculate stats
export function calculateDashboardStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todaysBookings = mockBookings.filter((booking) => {
    const bookingDate = new Date(booking.createdAt)
    bookingDate.setHours(0, 0, 0, 0)
    return bookingDate.getTime() === today.getTime() && booking.status === "confirmed"
  })

  const todaysSales = {
    amount: todaysBookings.reduce((sum, booking) => sum + booking.amount, 0),
    count: todaysBookings.length,
  }

  const totalBookings = mockBookings.filter((b) => b.status === "pending").length

  const lockedTickets = mockTickets.filter((t) => t.status === "locked").length

  const totalInventory = mockTickets.filter((t) => t.status === "available").length

  const estimatedProfit = mockTickets
    .filter((t) => t.status === "sold")
    .reduce((sum, ticket) => sum + (ticket.sellingPrice - ticket.buyingPrice), 0)

  return {
    todaysSales,
    totalBookings,
    lockedTickets,
    totalInventory,
    estimatedProfit,
  }
}
