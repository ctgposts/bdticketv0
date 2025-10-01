"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { TicketIcon, Eye, Lock, CheckCircle, Search, ShoppingCart, RefreshCw, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { BookingDialog } from "@/components/booking-dialog"
import { useToast } from "@/hooks/use-toast"
import { hasPermission } from "@/lib/auth"

interface Ticket {
  id: string
  sl?: number
  airline?: string
  flight_number?: string
  departure_date?: string
  departure_time?: string
  arrival_time?: string
  selling_price: number
  buying_price?: number
  available_seats: number
  total_seats: number
  status: "available" | "booked" | "locked" | "sold"
  country?: {
    code: string
    name: string
    flag: string
  }
  origin?: string
  destination?: string
}

interface TicketRowProps {
  ticket: Ticket
  index: number
  showBuyingPrice: boolean
  onView: (ticket: Ticket) => void
  onBook: (ticket: Ticket) => void
}

function TicketRow({ ticket, index, showBuyingPrice, onView, onBook }: TicketRowProps) {
  const getStatusBadge = (status: string, availableSeats: number) => {
    if (availableSeats === 0) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          No Seats
        </Badge>
      )
    }
    switch (status) {
      case "available":
        return (
          <Badge variant="default" className="gap-1 bg-green-600">
            <CheckCircle className="h-3 w-3" />
            Available
          </Badge>
        )
      case "booked":
        return <Badge variant="secondary">Booked</Badge>
      case "locked":
        return (
          <Badge variant="secondary" className="gap-1">
            <Lock className="h-3 w-3" />
            Locked
          </Badge>
        )
      case "sold":
        return <Badge variant="outline">Sold</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const isDisabled = ticket.status === "sold" || ticket.available_seats === 0
  const canBook = ticket.status === "available" && ticket.available_seats > 0

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.02 }}
      className={`border-b hover:bg-accent/50 transition-colors ${isDisabled ? "opacity-60" : ""}`}
    >
      <td className="p-3 text-center font-body">{index + 1}</td>
      <td className="p-3 font-body font-semibold">{ticket.airline || "N/A"}</td>
      <td className="p-3 font-body">{ticket.flight_number || "N/A"}</td>
      <td className="p-3 font-body">
        {ticket.origin || "Dhaka"} → {ticket.destination || ticket.country?.name || "N/A"}
      </td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          {ticket.country?.flag && <span className="text-xl">{ticket.country.flag}</span>}
          <span className="font-body">{ticket.country?.name || "N/A"}</span>
        </div>
      </td>
      <td className="p-3 font-body">
        {ticket.departure_date ? new Date(ticket.departure_date).toLocaleDateString() : "N/A"}
      </td>
      <td className="p-3 font-body">
        {ticket.departure_date
          ? new Date(ticket.departure_date).toLocaleDateString("en-US", { weekday: "long" })
          : "N/A"}
      </td>
      <td className="p-3 font-body">
        <div className="space-y-1">
          <div>{ticket.departure_time || "N/A"}</div>
          {ticket.arrival_time && <div className="text-xs text-muted-foreground">Arr: {ticket.arrival_time}</div>}
        </div>
      </td>
      <td className="p-3 font-body font-semibold text-primary">৳{ticket.selling_price.toLocaleString()}</td>
      {showBuyingPrice && (
        <td className="p-3 font-body text-muted-foreground">৳{ticket.buying_price?.toLocaleString() || "N/A"}</td>
      )}
      <td className="p-3 text-center">
        <Badge variant="secondary" className="font-body">
          {ticket.available_seats} / {ticket.total_seats}
        </Badge>
      </td>
      <td className="p-3">{getStatusBadge(ticket.status, ticket.available_seats)}</td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onView(ticket)} className="font-body text-xs">
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          {canBook && (
            <Button size="sm" onClick={() => onBook(ticket)} className="font-body text-xs velvet-button">
              <ShoppingCart className="h-3 w-3 mr-1" />
              Book
            </Button>
          )}
          {isDisabled && (
            <Badge variant="destructive" className="text-xs">
              {ticket.available_seats === 0 ? "NO SEATS" : "SOLD OUT"}
            </Badge>
          )}
        </div>
      </td>
    </motion.tr>
  )
}

export default function TicketsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState(searchParams?.get("country") || "all")
  const [airlineFilter, setAirlineFilter] = useState("all")
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)

  const showBuyingPrice = user ? hasPermission(user, "view_buying_price") : false

  const loadTickets = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/tickets")
      if (!response.ok) throw new Error("Failed to load tickets")
      const data = await response.json()
      setTickets(data.tickets || [])
    } catch (err) {
      console.error("Failed to load tickets:", err)
      setError(err instanceof Error ? err.message : "Failed to load tickets")
      // Demo data
      const demoTickets: Ticket[] = [
        {
          id: "1",
          sl: 1,
          airline: "Saudi Airlines",
          flight_number: "SV801",
          departure_date: "2024-12-25",
          departure_time: "10:30 AM",
          arrival_time: "2:45 PM",
          selling_price: 45000,
          buying_price: 42000,
          available_seats: 5,
          total_seats: 10,
          status: "available",
          country: { code: "KSA", name: "Saudi Arabia", flag: "🇸🇦" },
          origin: "Dhaka",
          destination: "Riyadh",
        },
        {
          id: "2",
          sl: 2,
          airline: "Emirates",
          flight_number: "EK582",
          departure_date: "2024-12-26",
          departure_time: "11:00 AM",
          arrival_time: "3:30 PM",
          selling_price: 48000,
          buying_price: 45000,
          available_seats: 8,
          total_seats: 15,
          status: "available",
          country: { code: "UAE", name: "United Arab Emirates", flag: "🇦🇪" },
          origin: "Dhaka",
          destination: "Dubai",
        },
      ]
      setTickets(demoTickets)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [])

  const handleBookTicket = async (bookingData: any) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) throw new Error("Failed to create booking")

      toast({
        title: "Booking Created",
        description: "The booking has been created successfully.",
      })
      setShowBookingDialog(false)
      loadTickets()
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive",
      })
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      searchTerm === "" ||
      ticket.airline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.flight_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.country?.name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesCountry = countryFilter === "all" || ticket.country?.code === countryFilter
    const matchesAirline = airlineFilter === "all" || ticket.airline === airlineFilter

    return matchesSearch && matchesStatus && matchesCountry && matchesAirline
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Tickets</h1>
          <p className="text-muted-foreground font-body mt-1">Browse and book available flight tickets</p>
        </div>
        <Button onClick={loadTickets} variant="outline" className="gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-900 font-heading">Using Demo Data</p>
                <p className="text-sm text-yellow-700 font-body">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="luxury-card">
        <CardHeader>
          <CardTitle className="font-heading">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-body"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="locked">Locked</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="KSA">Saudi Arabia</SelectItem>
                <SelectItem value="UAE">UAE</SelectItem>
                <SelectItem value="QAT">Qatar</SelectItem>
              </SelectContent>
            </Select>
            <Select value={airlineFilter} onValueChange={setAirlineFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Airline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Airlines</SelectItem>
                <SelectItem value="Saudi Airlines">Saudi Airlines</SelectItem>
                <SelectItem value="Emirates">Emirates</SelectItem>
                <SelectItem value="Qatar Airways">Qatar Airways</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="luxury-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3 text-left font-heading text-sm">SL</th>
                  <th className="p-3 text-left font-heading text-sm">Airline</th>
                  <th className="p-3 text-left font-heading text-sm">Flight</th>
                  <th className="p-3 text-left font-heading text-sm">Route</th>
                  <th className="p-3 text-left font-heading text-sm">Country</th>
                  <th className="p-3 text-left font-heading text-sm">Date</th>
                  <th className="p-3 text-left font-heading text-sm">Day</th>
                  <th className="p-3 text-left font-heading text-sm">Time</th>
                  <th className="p-3 text-left font-heading text-sm">Price</th>
                  {showBuyingPrice && <th className="p-3 text-left font-heading text-sm">Buying</th>}
                  <th className="p-3 text-left font-heading text-sm">Seats</th>
                  <th className="p-3 text-left font-heading text-sm">Status</th>
                  <th className="p-3 text-left font-heading text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket, index) => (
                  <TicketRow
                    key={ticket.id}
                    ticket={ticket}
                    index={index}
                    showBuyingPrice={showBuyingPrice}
                    onView={(t) => {
                      setSelectedTicket(t)
                      setShowViewDialog(true)
                    }}
                    onBook={(t) => {
                      setSelectedTicket(t)
                      setShowBookingDialog(true)
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
          {filteredTickets.length === 0 && (
            <div className="text-center py-12">
              <TicketIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-heading font-semibold">No Tickets Found</p>
              <p className="text-sm text-muted-foreground font-body mt-2">
                Try adjusting your filters or search criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTicket && (
        <BookingDialog
          isOpen={showBookingDialog}
          onClose={() => setShowBookingDialog(false)}
          ticket={selectedTicket}
          onSubmit={handleBookTicket}
        />
      )}
    </div>
  )
}
