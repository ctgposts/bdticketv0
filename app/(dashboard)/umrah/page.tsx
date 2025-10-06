"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { motion } from "framer-motion"
import { Plus, Package, Users, Calendar, DollarSign, Plane, Hotel, CheckCircle, Clock, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

interface UmrahPackage {
  id: string
  package_name: string
  package_type: string
  duration_days: number
  makkah_hotel: string
  madinah_hotel: string
  makkah_nights: number
  madinah_nights: number
  departure_date: string
  return_date: string
  total_seats: number
  available_seats: number
  package_price: number
  status: string
  airline?: {
    name: string
    code: string
  }
}

export default function UmrahPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [packages, setPackages] = useState<UmrahPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<UmrahPackage | null>(null)
  const [showBookingDialog, setShowBookingDialog] = useState(false)

  useEffect(() => {
    loadPackages()
  }, [])

  const loadPackages = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/umrah/packages")
      if (!response.ok) throw new Error("Failed to load packages")
      const data = await response.json()
      setPackages(data)
    } catch (error) {
      console.error("[v0] Error loading packages:", error)
      toast({
        title: "Error",
        description: "Failed to load Umrah packages",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getPackageTypeBadge = (type: string) => {
    const colors = {
      economy: "bg-blue-100 text-blue-800",
      standard: "bg-green-100 text-green-800",
      premium: "bg-purple-100 text-purple-800",
      vip: "bg-amber-100 text-amber-800",
    }
    return <Badge className={colors[type as keyof typeof colors] || "bg-gray-100"}>{type.toUpperCase()}</Badge>
  }

  const getStatusBadge = (status: string, availableSeats: number) => {
    if (availableSeats === 0) {
      return <Badge variant="destructive">SOLD OUT</Badge>
    }
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">ACTIVE</Badge>
      case "inactive":
        return <Badge variant="secondary">INACTIVE</Badge>
      case "cancelled":
        return <Badge variant="destructive">CANCELLED</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Umrah Management</h1>
          <p className="text-muted-foreground font-body mt-1">Manage Umrah packages and group bookings</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="velvet-button gap-2">
          <Plus className="h-4 w-4" />
          New Package
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="luxury-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-body">Total Packages</p>
                <p className="text-2xl font-heading font-bold">{packages.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="luxury-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-body">Active Packages</p>
                <p className="text-2xl font-heading font-bold">
                  {packages.filter((p) => p.status === "active").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="luxury-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-body">Available Seats</p>
                <p className="text-2xl font-heading font-bold">
                  {packages.reduce((sum, p) => sum + p.available_seats, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="luxury-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-body">Total Value</p>
                <p className="text-2xl font-heading font-bold">
                  ৳{packages.reduce((sum, p) => sum + p.package_price * p.total_seats, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-amber-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="luxury-card h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="font-heading text-xl">{pkg.package_name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getPackageTypeBadge(pkg.package_type)}
                      {getStatusBadge(pkg.status, pkg.available_seats)}
                    </div>
                  </div>
                  <Package className="h-8 w-8 text-primary opacity-30" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-body">
                      {new Date(pkg.departure_date).toLocaleDateString()} -{" "}
                      {new Date(pkg.return_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-body">{pkg.duration_days} Days</span>
                  </div>
                  {pkg.airline && (
                    <div className="flex items-center gap-2 text-sm">
                      <Plane className="h-4 w-4 text-muted-foreground" />
                      <span className="font-body">{pkg.airline.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Hotel className="h-4 w-4" />
                      Makkah
                    </span>
                    <span className="font-semibold">{pkg.makkah_nights}N</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Hotel className="h-4 w-4" />
                      Madinah
                    </span>
                    <span className="font-semibold">{pkg.madinah_nights}N</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Available Seats</span>
                    <Badge variant="secondary" className="font-body">
                      {pkg.available_seats} / {pkg.total_seats}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Package Price</span>
                    <span className="text-xl font-heading font-bold text-primary">
                      ৳{pkg.package_price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 velvet-button"
                    disabled={pkg.available_seats === 0 || pkg.status !== "active"}
                    onClick={() => {
                      setSelectedPackage(pkg)
                      setShowBookingDialog(true)
                    }}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Book
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {packages.length === 0 && (
        <Card className="luxury-card">
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-heading font-semibold">No Umrah Packages</p>
            <p className="text-sm text-muted-foreground font-body mt-2">
              Create your first Umrah package to get started
            </p>
            <Button onClick={() => setShowCreateDialog(true)} className="mt-4 velvet-button">
              <Plus className="h-4 w-4 mr-2" />
              Create Package
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
