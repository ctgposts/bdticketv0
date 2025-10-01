export type UserRole = "admin" | "manager" | "staff"

export interface User {
  id: string
  username: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface DashboardStats {
  todaysSales: {
    amount: number
    count: number
  }
  totalBookings: number
  lockedTickets: number
  totalInventory: number
  estimatedProfit: number
}

export interface Country {
  id: string
  name: string
  code: string
  flag: string
  ticketCount: number
}

export interface Ticket {
  id: string
  countryId: string
  batchNumber: string
  buyingPrice: number
  sellingPrice: number
  status: "available" | "locked" | "sold"
  lockedUntil?: string
}

export interface Booking {
  id: string
  ticketId: string
  customerName: string
  customerPhone: string
  customerEmail: string
  status: "pending" | "confirmed" | "cancelled"
  amount: number
  createdAt: string
}
