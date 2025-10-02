"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Users, Calendar, DollarSign, Package, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UmrahPackage {
  id: string
  name: string
  duration: string
  price: number
  groupSize: number
  availableSlots: number
  departureDate: string
  status: "available" | "full" | "upcoming"
  includes: string[]
}

export default function UmrahPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [packages, setPackages] = useState<UmrahPackage[]>([
    {
      id: "1",
      name: "Premium Umrah Package",
      duration: "14 Days",
      price: 185000,
      groupSize: 40,
      availableSlots: 12,
      departureDate: "2025-01-15",
      status: "available",
      includes: ["5-Star Hotels", "Visa Processing", "Transportation", "Guided Tours"],
    },
    {
      id: "2",
      name: "Economy Umrah Package",
      duration: "10 Days",
      price: 125000,
      groupSize: 50,
      availableSlots: 8,
      departureDate: "2025-01-20",
      status: "available",
      includes: ["3-Star Hotels", "Visa Processing", "Transportation"],
    },
    {
      id: "3",
      name: "Ramadan Special Package",
      duration: "21 Days",
      price: 250000,
      groupSize: 30,
      availableSlots: 0,
      departureDate: "2025-03-01",
      status: "full",
      includes: ["5-Star Hotels", "Visa Processing", "Transportation", "Guided Tours", "Special Meals"],
    },
    {
      id: "4",
      name: "Family Umrah Package",
      duration: "12 Days",
      price: 165000,
      groupSize: 35,
      availableSlots: 15,
      departureDate: "2025-02-10",
      status: "available",
      includes: ["4-Star Hotels", "Visa Processing", "Transportation", "Family Rooms"],
    },
  ])

  const [groupBookings, setGroupBookings] = useState([
    {
      id: "1",
      packageName: "Premium Umrah Package",
      groupLeader: "Ahmed Hassan",
      participants: 8,
      totalAmount: 1480000,
      paidAmount: 740000,
      status: "confirmed",
      departureDate: "2025-01-15",
    },
    {
      id: "2",
      packageName: "Economy Umrah Package",
      groupLeader: "Fatima Khan",
      participants: 12,
      totalAmount: 1500000,
      paidAmount: 500000,
      status: "pending",
      departureDate: "2025-01-20",
    },
  ])

  const filteredPackages = packages.filter(
    (pkg) =>
      searchTerm === "" ||
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.duration.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreatePackage = () => {
    toast({
      title: "Create Package",
      description: "Package creation dialog would open here.",
    })
  }

  const handleBookPackage = (pkg: UmrahPackage) => {
    toast({
      title: "Book Package",
      description: `Booking form for ${pkg.name} would open here.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold velvet-text">Umrah Management</h1>
          <p className="text-muted-foreground font-body mt-1">Manage Umrah packages and group bookings</p>
        </div>
        <Button onClick={handleCreatePackage} className="font-body velvet-button gap-2">
          <Plus className="h-4 w-4" />
          Create Package
        </Button>
      </div>

      <Tabs defaultValue="packages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="packages" className="font-body">
            Packages
          </TabsTrigger>
          <TabsTrigger value="bookings" className="font-body">
            Group Bookings
          </TabsTrigger>
          <TabsTrigger value="statistics" className="font-body">
            Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-4">
          <Card className="luxury-card">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 font-body"
                  />
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {filteredPackages.map((pkg) => (
              <Card key={pkg.id} className="luxury-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-heading">{pkg.name}</CardTitle>
                      <CardDescription className="font-body mt-1">{pkg.duration}</CardDescription>
                    </div>
                    <Badge
                      variant={pkg.status === "available" ? "default" : "secondary"}
                      className={pkg.status === "available" ? "bg-green-600 font-body" : "font-body"}
                    >
                      {pkg.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-body flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Price per Person
                      </span>
                      <span className="font-semibold font-heading">৳{pkg.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-body flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Group Size
                      </span>
                      <span className="font-body">{pkg.groupSize} people</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-body flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Available Slots
                      </span>
                      <span className="font-body font-semibold text-green-600">{pkg.availableSlots} left</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-body flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Departure
                      </span>
                      <span className="font-body">{new Date(pkg.departureDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold mb-2 font-heading">Package Includes:</p>
                    <div className="flex flex-wrap gap-2">
                      {pkg.includes.map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="font-body">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleBookPackage(pkg)}
                    disabled={pkg.status === "full"}
                    className="w-full font-body velvet-button"
                  >
                    {pkg.status === "full" ? "Fully Booked" : "Book Now"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="font-heading">Group Bookings</CardTitle>
              <CardDescription className="font-body">Manage group reservations and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupBookings.map((booking) => (
                  <div key={booking.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold font-heading">{booking.packageName}</p>
                        <p className="text-sm text-muted-foreground font-body">Led by {booking.groupLeader}</p>
                      </div>
                      <Badge
                        variant={booking.status === "confirmed" ? "default" : "secondary"}
                        className={booking.status === "confirmed" ? "bg-green-600 font-body" : "font-body"}
                      >
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground font-body">Participants</p>
                        <p className="font-semibold font-heading">{booking.participants} people</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-body">Total Amount</p>
                        <p className="font-semibold font-heading">৳{booking.totalAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-body">Paid</p>
                        <p className="font-semibold text-green-600 font-heading">
                          ৳{booking.paidAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-body">Due</p>
                        <p className="font-semibold text-red-600 font-heading">
                          ৳{(booking.totalAmount - booking.paidAmount).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground font-body">
                        Departure: {new Date(booking.departureDate).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="font-body bg-transparent">
                          View Details
                        </Button>
                        <Button size="sm" className="font-body velvet-button">
                          Record Payment
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="luxury-card">
              <CardHeader>
                <CardTitle className="text-sm font-heading">Total Packages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-heading">{packages.length}</div>
                <p className="text-sm text-muted-foreground font-body mt-1">Active packages</p>
              </CardContent>
            </Card>

            <Card className="luxury-card">
              <CardHeader>
                <CardTitle className="text-sm font-heading">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-heading">{groupBookings.length}</div>
                <p className="text-sm text-muted-foreground font-body mt-1">Group reservations</p>
              </CardContent>
            </Card>

            <Card className="luxury-card">
              <CardHeader>
                <CardTitle className="text-sm font-heading">Total Pilgrims</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-heading">
                  {groupBookings.reduce((sum, b) => sum + b.participants, 0)}
                </div>
                <p className="text-sm text-muted-foreground font-body mt-1">Registered pilgrims</p>
              </CardContent>
            </Card>
          </div>

          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="font-heading">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <span className="font-body">Total Revenue</span>
                  <span className="text-xl font-bold font-heading">
                    ৳{groupBookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <span className="font-body">Collected</span>
                  <span className="text-xl font-bold text-green-600 font-heading">
                    ৳{groupBookings.reduce((sum, b) => sum + b.paidAmount, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <span className="font-body">Outstanding</span>
                  <span className="text-xl font-bold text-red-600 font-heading">
                    ৳{groupBookings.reduce((sum, b) => sum + (b.totalAmount - b.paidAmount), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
