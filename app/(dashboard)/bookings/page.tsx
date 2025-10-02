"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Package, Search, RefreshCw, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { hasPermission } from "@/lib/auth"

interface Booking {
  id: string
  booking_reference: string
  ticket_id: string
  passenger_name: string
  passenger_passport: string
  passenger_phone: string
  passenger_email: string
  agent_name: string
  agent_phone: string
  agent_email: string
  total_amount: number
  payment_type: "full" | "partial"
  partial_amount?: number
  payment_method: string
  status: "pending" | "confirmed" | "cancelled"
  profit: number
  created_at: string
  ticket?: {
    flight_number: string
    airline_name: string
    departure_date: string
    origin_country: { name: string; code: string }
    destination_country: { name: string; code: string }
    airline?: { name: string; code: string }
  }
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
}

const statusIcons = {
  pending: <Clock className="h-3 w-3" />,
  confirmed: <CheckCircle className="h-3 w-3" />,
  cancelled: <XCircle className="h-3 w-3" />,
}

export default function BookingsPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState(searchParams?.get("status") || "all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  const loadBookings = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (statusFilter !== "all") params.append("status", statusFilter)

      const response = await fetch(`/api/bookings?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to load bookings")

      const data = await response.json()
      setBookings(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("[v0] Failed to load bookings:", err)
      setError(err instanceof Error ? err.message : "Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadBookings()
    }
  }, [user, statusFilter])

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update booking status")

      toast({
        title: "Status Updated",
        description: `Booking status changed to ${newStatus}`,
      })
      loadBookings()
    } catch (error) {
      console.error("[v0] Status update error:", error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    if (searchTerm === "") return true

    return (
      booking.passenger_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.agent_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.booking_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.ticket?.flight_number?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-muted animate-pulse rounded" />
        <div className="h-96 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Bookings</h1>
          <p className="text-muted-foreground font-body mt-1">Manage customer bookings and reservations</p>
        </div>
        <Button onClick={loadBookings} variant="outline" className="gap-2 bg-transparent">
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
                <p className="font-semibold text-yellow-900 font-heading">Error Loading Bookings</p>
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
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by passenger, agent, reference, or flight..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredBookings.map((booking, index) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="luxury-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                      <Badge className={`gap-1 ${statusColors[booking.status]}`}>
                        {statusIcons[booking.status]}
                        {booking.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="font-mono">
                        {booking.booking_reference}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(booking.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-body mb-1">Flight Details</p>
                        <div className="space-y-1">
                          <p className="font-heading font-semibold">{booking.ticket?.airline_name || "N/A"}</p>
                          <p className="text-sm font-body">{booking.ticket?.flight_number || "N/A"}</p>
                          <p className="text-sm text-muted-foreground font-body">
                            {booking.ticket?.origin_country?.name || "N/A"} →{" "}
                            {booking.ticket?.destination_country?.name || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground font-body mb-1">Passenger</p>
                        <div className="space-y-1">
                          <p className="font-body font-semibold">{booking.passenger_name}</p>
                          <p className="text-sm text-muted-foreground font-body">{booking.passenger_passport}</p>
                          <p className="text-sm text-muted-foreground font-body">{booking.passenger_phone}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground font-body mb-1">Payment</p>
                        <div className="space-y-1">
                          <p className="font-heading font-bold text-primary text-lg">
                            ৳{booking.total_amount.toLocaleString()}
                          </p>
                          <Badge variant="outline" className="font-body">
                            {booking.payment_type === "full"
                              ? "Full Payment"
                              : `Partial: ৳${booking.partial_amount?.toLocaleString()}`}
                          </Badge>
                          <p className="text-sm text-muted-foreground font-body capitalize">{booking.payment_method}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(booking)
                        setShowDetailsDialog(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {booking.status === "pending" && user && hasPermission(user, "confirm_sales") && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                        className="velvet-button"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirm
                      </Button>
                    )}
                    {booking.status === "pending" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredBookings.length === 0 && !loading && (
        <Card className="luxury-card">
          <CardContent className="pt-12 pb-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-heading font-semibold">No Bookings Found</p>
            <p className="text-sm text-muted-foreground font-body mt-2">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "No bookings have been created yet"}
            </p>
          </CardContent>
        </Card>
      )}

      {selectedBooking && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-heading">Booking Details</DialogTitle>
              <DialogDescription>Complete information about this booking</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold font-heading mb-2">Flight Information</p>
                  <div className="space-y-1 text-sm font-body">
                    <p>Airline: {selectedBooking.ticket?.airline_name || "N/A"}</p>
                    <p>Flight: {selectedBooking.ticket?.flight_number || "N/A"}</p>
                    <p>
                      Date:{" "}
                      {selectedBooking.ticket?.departure_date
                        ? new Date(selectedBooking.ticket.departure_date).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      Route: {selectedBooking.ticket?.origin_country?.name || "N/A"} →{" "}
                      {selectedBooking.ticket?.destination_country?.name || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold font-heading mb-2">Agent Information</p>
                  <div className="space-y-1 text-sm font-body">
                    <p>Name: {selectedBooking.agent_name}</p>
                    <p>Phone: {selectedBooking.agent_phone || "N/A"}</p>
                    <p>Email: {selectedBooking.agent_email || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold font-heading mb-2">Passenger Information</p>
                  <div className="space-y-1 text-sm font-body">
                    <p>Name: {selectedBooking.passenger_name}</p>
                    <p>Passport: {selectedBooking.passenger_passport}</p>
                    <p>Phone: {selectedBooking.passenger_phone}</p>
                    <p>Email: {selectedBooking.passenger_email || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold font-heading mb-2">Payment Information</p>
                  <div className="space-y-1 text-sm font-body">
                    <p>Total: ৳{selectedBooking.total_amount.toLocaleString()}</p>
                    <p>Type: {selectedBooking.payment_type === "full" ? "Full Payment" : "Partial Payment"}</p>
                    {selectedBooking.payment_type === "partial" && (
                      <p>Advance: ৳{selectedBooking.partial_amount?.toLocaleString()}</p>
                    )}
                    <p>Method: {selectedBooking.payment_method}</p>
                    {user && hasPermission(user, "view_profit") && (
                      <p className="text-green-600 font-semibold">Profit: ৳{selectedBooking.profit.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
