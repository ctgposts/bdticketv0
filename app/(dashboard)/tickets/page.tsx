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
  flight_number: string
  airline_name: string
  departure_date: string
  departure_time: string
  arrival_time: string
  selling_price: number
  buying_price: number
  available_seats: number
  total_seats: number
  status: "available" | "locked" | "sold"
  origin_country: {
    name: string
    code: string
    flag: string
  }
  destination_country: {
    name: string
    code: string
    flag: string
  }
  airline?: {
    name: string
    code: string
    logo?: string
  }
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
      <td className="p-3 font-body font-semibold">{ticket.airline_name}</td>
      <td className="p-3 font-body">{ticket.flight_number}</td>
      <td className="p-3 font-body">
        {ticket.origin_country.name} → {ticket.destination_country.name}
      </td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{ticket.destination_country.flag}</span>
          <span className="font-body">{ticket.destination_country.name}</span>
        </div>
      </td>
      <td className="p-3 font-body">{new Date(ticket.departure_date).toLocaleDateString()}</td>
      <td className="p-3 font-body">
        {new Date(ticket.departure_date).toLocaleDateString("en-US", { weekday: "long" })}
      </td>
      <td className="p-3 font-body">
        <div className="space-y-1">
          <div>{ticket.departure_time}</div>
          {ticket.arrival_time && <div className="text-xs text-muted-foreground">Arr: {ticket.arrival_time}</div>}
        </div>
      </td>
      <td className="p-3 font-body font-semibold text-primary">৳{ticket.selling_price.toLocaleString()}</td>
      {showBuyingPrice && (
        <td className="p-3 font-body text-muted-foreground">৳{ticket.buying_price.toLocaleString()}</td>
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
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [countries, setCountries] = useState<Array<{ code: string; name: string }>>([])
  const [airlines, setAirlines] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showBookingDialog, setShowBookingDialog] = useState(false)

  const showBuyingPrice = user ? hasPermission(user, "view_buying_price") : false

  const loadTickets = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (countryFilter !== "all") params.append("destination", countryFilter)

      const response = await fetch(`/api/tickets?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to load tickets")

      const data = await response.json()
      setTickets(data)

      // Extract unique countries and airlines
      const uniqueCountries = Array.from(
        new Set(
          data.map((t: Ticket) =>
            JSON.stringify({ code: t.destination_country.code, name: t.destination_country.name }),
          ),
        ),
      ).map((str) => JSON.parse(str as string))

      const uniqueAirlines = Array.from(new Set(data.map((t: Ticket) => t.airline_name)))

      setCountries(uniqueCountries)
      setAirlines(uniqueAirlines as string[])
    } catch (err) {
      console.error("[v0] Failed to load tickets:", err)
      setError(err instanceof Error ? err.message : "Failed to load tickets")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [statusFilter, countryFilter])

  const handleBookTicket = async (bookingData: any) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingData,
          ticket_id: selectedTicket?.id,
          agent_name: user?.name,
        }),
      })

      if (!response.ok) throw new Error("Failed to create booking")

      toast({
        title: "Booking Created",
        description: "The booking has been created successfully.",
      })
      setShowBookingDialog(false)
      loadTickets()
    } catch (error) {
      console.error("[v0] Booking error:", error)
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive",
      })
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    if (searchTerm === "") return true

    return (
      ticket.airline_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.flight_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.destination_country?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
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
                <p className="font-semibold text-yellow-900 font-heading">Error Loading Tickets</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
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
