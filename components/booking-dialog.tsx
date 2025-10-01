"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, CreditCard, Plane } from "lucide-react"

interface BookingDialogProps {
  isOpen: boolean
  onClose: () => void
  ticket?: any
  onSubmit: (bookingData: any) => Promise<void>
}

export function BookingDialog({ isOpen, onClose, ticket, onSubmit }: BookingDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    agentName: "",
    agentPhone: "",
    agentEmail: "",
    passengerName: "",
    passportNo: "",
    passengerPhone: "",
    passengerEmail: "",
    sellingPrice: ticket?.selling_price || 0,
    paymentType: "full",
    partialAmount: 0,
    paymentMethod: "cash",
    paymentDetails: "",
    comments: "",
    emergencyContact: "",
    specialRequests: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (ticket) {
      setFormData((prev) => ({
        ...prev,
        sellingPrice: ticket.selling_price || 0,
      }))
    }
  }, [ticket])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit({
        ticketId: ticket?.id,
        agentInfo: {
          name: formData.agentName,
          phone: formData.agentPhone,
          email: formData.agentEmail,
        },
        passengerInfo: {
          name: formData.passengerName,
          passportNo: formData.passportNo,
          phone: formData.passengerPhone,
          email: formData.passengerEmail,
          paxCount: 1,
        },
        sellingPrice: formData.sellingPrice,
        paymentType: formData.paymentType,
        partialAmount: formData.partialAmount,
        paymentMethod: formData.paymentMethod,
        paymentDetails: formData.paymentDetails,
        comments: `${formData.comments} | Emergency: ${formData.emergencyContact} | Special: ${formData.specialRequests}`,
      })
      onClose()
    } catch (error) {
      console.error("Booking submission failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const buyingPrice = ticket?.buying_price || 0
  const profit = formData.sellingPrice - buyingPrice
  const profitMargin = formData.sellingPrice > 0 ? (profit / formData.sellingPrice) * 100 : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Create New Booking</DialogTitle>
          <DialogDescription>Fill in the details to create a new booking for this flight ticket.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {ticket && (
            <div className="grid grid-cols-2 gap-4 p-4 luxury-card rounded-lg">
              <div className="flex items-center gap-2">
                <Plane className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Flight</p>
                  <p className="font-semibold">{ticket.flight_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-semibold">{new Date(ticket.flight_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Base Price</p>
                  <p className="font-semibold">৳{ticket.selling_price?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <h3 className="font-heading text-lg">Agent Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agentName">Agency/Agent Name *</Label>
                <Input
                  id="agentName"
                  value={formData.agentName}
                  onChange={(e) => updateFormData("agentName", e.target.value)}
                  placeholder="Enter agency or agent name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agentPhone">Phone Number</Label>
                <Input
                  id="agentPhone"
                  value={formData.agentPhone}
                  onChange={(e) => updateFormData("agentPhone", e.target.value)}
                  placeholder="+880-XXX-XXXXXX"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="agentEmail">Email Address</Label>
                <Input
                  id="agentEmail"
                  type="email"
                  value={formData.agentEmail}
                  onChange={(e) => updateFormData("agentEmail", e.target.value)}
                  placeholder="agent@example.com"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-heading text-lg">Passenger Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="passengerName">Passenger Name *</Label>
                <Input
                  id="passengerName"
                  value={formData.passengerName}
                  onChange={(e) => updateFormData("passengerName", e.target.value)}
                  placeholder="Full name as in passport"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passportNo">Passport Number *</Label>
                <Input
                  id="passportNo"
                  value={formData.passportNo}
                  onChange={(e) => updateFormData("passportNo", e.target.value)}
                  placeholder="Passport number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passengerPhone">Phone Number *</Label>
                <Input
                  id="passengerPhone"
                  value={formData.passengerPhone}
                  onChange={(e) => updateFormData("passengerPhone", e.target.value)}
                  placeholder="+880-XXX-XXXXXX"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passengerEmail">Email Address</Label>
                <Input
                  id="passengerEmail"
                  type="email"
                  value={formData.passengerEmail}
                  onChange={(e) => updateFormData("passengerEmail", e.target.value)}
                  placeholder="passenger@example.com"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => updateFormData("emergencyContact", e.target.value)}
                  placeholder="Emergency contact number"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-heading text-lg">Payment Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sellingPrice">Selling Price (৳) *</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  value={formData.sellingPrice}
                  onChange={(e) => updateFormData("sellingPrice", Number.parseFloat(e.target.value))}
                  required
                  className={
                    buyingPrice && formData.sellingPrice < buyingPrice ? "border-red-500 focus:border-red-500" : ""
                  }
                />
                {buyingPrice > 0 && (
                  <div className="text-xs space-y-1">
                    <p className="text-muted-foreground">
                      Buying Price: <span className="font-semibold">৳{buyingPrice.toLocaleString()}</span>
                    </p>
                    <p className={profit >= 0 ? "text-green-600" : "text-red-600"}>
                      Profit: <span className="font-semibold">৳{profit.toLocaleString()}</span>
                    </p>
                    {formData.sellingPrice > 0 && (
                      <p className={profitMargin >= 0 ? "text-green-600" : "text-red-600"}>
                        Profit Margin: <span className="font-semibold">{profitMargin.toFixed(1)}%</span>
                      </p>
                    )}
                    {formData.sellingPrice < buyingPrice && (
                      <p className="text-red-600 font-semibold">
                        ⚠️ Warning: Selling price is below buying price (Loss!)
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentType">Payment Type *</Label>
                <Select value={formData.paymentType} onValueChange={(value) => updateFormData("paymentType", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Payment</SelectItem>
                    <SelectItem value="partial">Partial Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.paymentType === "partial" && (
                <div className="space-y-2">
                  <Label htmlFor="partialAmount">Advance Amount (৳) *</Label>
                  <Input
                    id="partialAmount"
                    type="number"
                    value={formData.partialAmount}
                    onChange={(e) => updateFormData("partialAmount", Number.parseFloat(e.target.value))}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => updateFormData("paymentMethod", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="bkash">bKash</SelectItem>
                    <SelectItem value="nagad">Nagad</SelectItem>
                    <SelectItem value="rocket">Rocket</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-heading text-lg">Additional Information</h3>
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={(e) => updateFormData("comments", e.target.value)}
                placeholder="Any additional notes or comments"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) => updateFormData("specialRequests", e.target.value)}
                placeholder="Meal preferences, seat requests, etc."
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="velvet-button">
              {isSubmitting ? "Creating Booking..." : "Create Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
