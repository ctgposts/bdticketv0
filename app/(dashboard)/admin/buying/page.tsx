"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Plus, Package, DollarSign, TrendingUp, AlertCircle, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface Country {
  id: string
  name: string
  code: string
  flag: string
}

interface Airline {
  id: string
  name: string
  code: string
}

export default function AdminBuyingPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [countries, setCountries] = useState<Country[]>([])
  const [airlines, setAirlines] = useState<Airline[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    airline_id: "",
    country_id: "",
    flight_number: "",
    origin: "",
    destination: "",
    departure_date: "",
    departure_time: "",
    arrival_time: "",
    buying_price: "",
    selling_price: "",
    quantity: "1",
    batch_number: "",
    notes: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [countriesRes, airlinesRes] = await Promise.all([fetch("/api/countries"), fetch("/api/airlines")])

      if (countriesRes.ok) {
        const countriesData = await countriesRes.json()
        setCountries(countriesData)
      }

      if (airlinesRes.ok) {
        const airlinesData = await airlinesRes.json()
        setAirlines(airlinesData)
      }
    } catch (error) {
      console.error("[v0] Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load countries and airlines",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/tickets/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          buying_price: Number.parseFloat(formData.buying_price),
          selling_price: Number.parseFloat(formData.selling_price),
          quantity: Number.parseInt(formData.quantity),
          created_by: user?.id,
        }),
      })

      if (!response.ok) throw new Error("Failed to create tickets")

      const result = await response.json()

      toast({
        title: "Success",
        description: `Successfully created ${result.count} tickets`,
      })

      // Reset form
      setFormData({
        airline_id: "",
        country_id: "",
        flight_number: "",
        origin: "",
        destination: "",
        departure_date: "",
        departure_time: "",
        arrival_time: "",
        buying_price: "",
        selling_price: "",
        quantity: "1",
        batch_number: "",
        notes: "",
      })
    } catch (error) {
      console.error("[v0] Error creating tickets:", error)
      toast({
        title: "Error",
        description: "Failed to create tickets",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const buyingPrice = Number.parseFloat(formData.buying_price) || 0
  const sellingPrice = Number.parseFloat(formData.selling_price) || 0
  const quantity = Number.parseInt(formData.quantity) || 0
  const profit = sellingPrice - buyingPrice
  const profitMargin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0
  const totalCost = buyingPrice * quantity
  const totalRevenue = sellingPrice * quantity
  const totalProfit = profit * quantity

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
      <div>
        <h1 className="text-3xl font-heading font-bold">Buy Tickets</h1>
        <p className="text-muted-foreground font-body mt-1">Purchase tickets in bulk from airlines and suppliers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="luxury-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-body">Total Cost</p>
                <p className="text-2xl font-heading font-bold">৳{totalCost.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="luxury-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-body">Expected Revenue</p>
                <p className="text-2xl font-heading font-bold">৳{totalRevenue.toLocaleString()}</p>
              </div>
              <Package className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="luxury-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-body">Expected Profit</p>
                <p
                  className={`text-2xl font-heading font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  ৳{totalProfit.toLocaleString()}
                </p>
                {profitMargin > 0 && <p className="text-xs text-muted-foreground">{profitMargin.toFixed(1)}% margin</p>}
              </div>
              <TrendingUp className={`h-8 w-8 opacity-50 ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Purchase Form */}
      <Card className="luxury-card">
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Bulk Ticket Purchase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Flight Information */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg">Flight Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="airline">Airline *</Label>
                  <Select
                    value={formData.airline_id}
                    onValueChange={(value) => updateFormData("airline_id", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select airline" />
                    </SelectTrigger>
                    <SelectContent>
                      {airlines.map((airline) => (
                        <SelectItem key={airline.id} value={airline.id}>
                          {airline.name} ({airline.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flight_number">Flight Number *</Label>
                  <Input
                    id="flight_number"
                    value={formData.flight_number}
                    onChange={(e) => updateFormData("flight_number", e.target.value)}
                    placeholder="e.g., BG123"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="origin">Origin *</Label>
                  <Input
                    id="origin"
                    value={formData.origin}
                    onChange={(e) => updateFormData("origin", e.target.value)}
                    placeholder="e.g., Dhaka (DAC)"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destination *</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => updateFormData("destination", e.target.value)}
                    placeholder="e.g., Dubai (DXB)"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Destination Country *</Label>
                  <Select
                    value={formData.country_id}
                    onValueChange={(value) => updateFormData("country_id", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.flag} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departure_date">Departure Date *</Label>
                  <Input
                    id="departure_date"
                    type="date"
                    value={formData.departure_date}
                    onChange={(e) => updateFormData("departure_date", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departure_time">Departure Time *</Label>
                  <Input
                    id="departure_time"
                    type="time"
                    value={formData.departure_time}
                    onChange={(e) => updateFormData("departure_time", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arrival_time">Arrival Time</Label>
                  <Input
                    id="arrival_time"
                    type="time"
                    value={formData.arrival_time}
                    onChange={(e) => updateFormData("arrival_time", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg">Pricing & Quantity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buying_price">Buying Price (৳) *</Label>
                  <Input
                    id="buying_price"
                    type="number"
                    step="0.01"
                    value={formData.buying_price}
                    onChange={(e) => updateFormData("buying_price", e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="selling_price">Selling Price (৳) *</Label>
                  <Input
                    id="selling_price"
                    type="number"
                    step="0.01"
                    value={formData.selling_price}
                    onChange={(e) => updateFormData("selling_price", e.target.value)}
                    placeholder="0.00"
                    required
                    className={sellingPrice < buyingPrice && sellingPrice > 0 ? "border-red-500" : ""}
                  />
                  {sellingPrice > 0 && buyingPrice > 0 && (
                    <p className={`text-xs ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      Profit: ৳{profit.toFixed(2)} ({profitMargin.toFixed(1)}%)
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => updateFormData("quantity", e.target.value)}
                    required
                  />
                </div>
              </div>

              {sellingPrice < buyingPrice && sellingPrice > 0 && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-sm text-red-600 font-semibold">
                    Warning: Selling price is below buying price. This will result in a loss!
                  </p>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batch_number">Batch Number</Label>
                  <Input
                    id="batch_number"
                    value={formData.batch_number}
                    onChange={(e) => updateFormData("batch_number", e.target.value)}
                    placeholder="Auto-generated if empty"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => updateFormData("notes", e.target.value)}
                    placeholder="Any additional notes about this purchase..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => window.location.reload()}>
                Reset
              </Button>
              <Button type="submit" disabled={submitting} className="velvet-button gap-2">
                <Save className="h-4 w-4" />
                {submitting ? "Creating..." : `Create ${quantity} Ticket${quantity > 1 ? "s" : ""}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
