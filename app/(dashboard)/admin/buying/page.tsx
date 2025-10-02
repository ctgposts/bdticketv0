"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Plus, Calendar, DollarSign, Package } from "lucide-react"

export default function AdminBuyingPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    airline: "",
    flightNumber: "",
    origin: "Dhaka",
    destination: "",
    country: "",
    departureDate: "",
    departureTime: "",
    arrivalTime: "",
    buyingPrice: "",
    sellingPrice: "",
    totalSeats: "",
    status: "available",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          buying_price: Number.parseFloat(formData.buyingPrice),
          selling_price: Number.parseFloat(formData.sellingPrice),
          total_seats: Number.parseInt(formData.totalSeats),
          available_seats: Number.parseInt(formData.totalSeats),
        }),
      })

      if (!response.ok) throw new Error("Failed to create ticket batch")

      toast({
        title: "Ticket Batch Created",
        description: "New tickets have been added to inventory successfully.",
      })

      // Reset form
      setFormData({
        airline: "",
        flightNumber: "",
        origin: "Dhaka",
        destination: "",
        country: "",
        departureDate: "",
        departureTime: "",
        arrivalTime: "",
        buyingPrice: "",
        sellingPrice: "",
        totalSeats: "",
        status: "available",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create ticket batch",
        variant: "destructive",
      })
    }
  }

  const calculateProfit = () => {
    const buying = Number.parseFloat(formData.buyingPrice) || 0
    const selling = Number.parseFloat(formData.sellingPrice) || 0
    const seats = Number.parseInt(formData.totalSeats) || 0
    return (selling - buying) * seats
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold velvet-text">Buy Tickets</h1>
        <p className="text-muted-foreground font-body mt-1">Purchase new ticket inventory from suppliers</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                New Ticket Batch
              </CardTitle>
              <CardDescription className="font-body">Add new flight tickets to your inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="airline" className="font-body">
                      Airline *
                    </Label>
                    <Select
                      value={formData.airline}
                      onValueChange={(val) => setFormData({ ...formData, airline: val })}
                    >
                      <SelectTrigger id="airline">
                        <SelectValue placeholder="Select airline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Saudi Airlines">Saudi Airlines</SelectItem>
                        <SelectItem value="Emirates">Emirates</SelectItem>
                        <SelectItem value="Qatar Airways">Qatar Airways</SelectItem>
                        <SelectItem value="Biman Bangladesh">Biman Bangladesh</SelectItem>
                        <SelectItem value="Fly Dubai">Fly Dubai</SelectItem>
                        <SelectItem value="Air Arabia">Air Arabia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flightNumber" className="font-body">
                      Flight Number *
                    </Label>
                    <Input
                      id="flightNumber"
                      placeholder="e.g., SV801"
                      value={formData.flightNumber}
                      onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                      required
                      className="font-body"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="origin" className="font-body">
                      Origin
                    </Label>
                    <Input
                      id="origin"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      className="font-body"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination" className="font-body">
                      Destination *
                    </Label>
                    <Input
                      id="destination"
                      placeholder="e.g., Riyadh"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      required
                      className="font-body"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="font-body">
                      Country *
                    </Label>
                    <Select
                      value={formData.country}
                      onValueChange={(val) => setFormData({ ...formData, country: val })}
                    >
                      <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KSA">🇸🇦 Saudi Arabia</SelectItem>
                        <SelectItem value="UAE">🇦🇪 United Arab Emirates</SelectItem>
                        <SelectItem value="QAT">🇶🇦 Qatar</SelectItem>
                        <SelectItem value="KWT">🇰🇼 Kuwait</SelectItem>
                        <SelectItem value="OMN">🇴🇲 Oman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="departureDate" className="font-body">
                      Departure Date *
                    </Label>
                    <Input
                      id="departureDate"
                      type="date"
                      value={formData.departureDate}
                      onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                      required
                      className="font-body"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="departureTime" className="font-body">
                      Departure Time *
                    </Label>
                    <Input
                      id="departureTime"
                      type="time"
                      value={formData.departureTime}
                      onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                      required
                      className="font-body"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arrivalTime" className="font-body">
                      Arrival Time
                    </Label>
                    <Input
                      id="arrivalTime"
                      type="time"
                      value={formData.arrivalTime}
                      onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                      className="font-body"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buyingPrice" className="font-body">
                      Buying Price (৳) *
                    </Label>
                    <Input
                      id="buyingPrice"
                      type="number"
                      placeholder="42000"
                      value={formData.buyingPrice}
                      onChange={(e) => setFormData({ ...formData, buyingPrice: e.target.value })}
                      required
                      className="font-body"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sellingPrice" className="font-body">
                      Selling Price (৳) *
                    </Label>
                    <Input
                      id="sellingPrice"
                      type="number"
                      placeholder="45000"
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                      required
                      className="font-body"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalSeats" className="font-body">
                      Total Seats *
                    </Label>
                    <Input
                      id="totalSeats"
                      type="number"
                      placeholder="10"
                      value={formData.totalSeats}
                      onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                      required
                      className="font-body"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="font-body">
                      Status
                    </Label>
                    <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="locked">Locked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" className="font-body bg-transparent">
                    Cancel
                  </Button>
                  <Button type="submit" className="font-body velvet-button gap-2">
                    <Plus className="h-4 w-4" />
                    Add Ticket Batch
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="font-heading">Batch Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-body">Buying Price</span>
                <span className="font-semibold font-heading">৳{formData.buyingPrice || "0"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-body">Selling Price</span>
                <span className="font-semibold font-heading">৳{formData.sellingPrice || "0"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-body">Total Seats</span>
                <span className="font-semibold font-heading">{formData.totalSeats || "0"}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-body">Profit per Ticket</span>
                  <span className="font-semibold font-heading">
                    ৳
                    {(
                      (Number.parseFloat(formData.sellingPrice) || 0) - (Number.parseFloat(formData.buyingPrice) || 0)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold font-body">Total Profit</span>
                  <span className="text-lg font-bold text-green-600 font-heading">
                    ৳{calculateProfit().toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="font-heading">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <DollarSign className="h-5 w-5 text-green-600 flex-shrink-0" />
                <p className="text-sm font-body">Set competitive selling prices to maximize sales</p>
              </div>
              <div className="flex gap-2">
                <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm font-body">Peak season tickets sell faster at higher prices</p>
              </div>
              <div className="flex gap-2">
                <Package className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <p className="text-sm font-body">Buy in bulk to negotiate better rates</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
