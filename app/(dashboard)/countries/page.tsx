"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plane, MapPin, RefreshCw, AlertCircle, Clock, Wifi, WifiOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Country {
  code: string
  name: string
  flag: string
  totalTickets: number
  availableTickets: number
}

interface CountryCardProps {
  country: Country
  index: number
}

function CountryCard({ country, index }: CountryCardProps) {
  const availabilityPercentage = country.totalTickets > 0 ? (country.availableTickets / country.totalTickets) * 100 : 0

  const getAvailabilityStatus = () => {
    if (availabilityPercentage > 50) return "high"
    if (availabilityPercentage > 20) return "medium"
    return "low"
  }

  const availabilityStatus = getAvailabilityStatus()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Link href={`/tickets?country=${country.code}`}>
        <Card className="luxury-card hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{country.flag}</div>
                <div>
                  <CardTitle className="font-heading text-xl group-hover:text-primary transition-colors">
                    {country.name}
                  </CardTitle>
                  <CardDescription className="font-body">{country.code}</CardDescription>
                </div>
              </div>
              <Badge
                variant={
                  availabilityStatus === "high"
                    ? "default"
                    : availabilityStatus === "medium"
                      ? "secondary"
                      : "destructive"
                }
              >
                {availabilityPercentage.toFixed(0)}% available
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-body">Available</p>
                <p className="text-2xl font-heading font-bold text-primary">
                  {country.availableTickets.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground font-body">
                  Total: {country.totalTickets.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Plane className="h-4 w-4" />
                <span className="font-body">Multiple Airlines</span>
              </div>
              <span className="font-body font-semibold">
                {availabilityStatus === "high"
                  ? "High Availability"
                  : availabilityStatus === "medium"
                    ? "Limited Stock"
                    : "Low Stock"}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const mountedRef = useRef(true)

  const loadCountries = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true)
      } else {
        setIsBackgroundLoading(true)
      }
      setError(null)

      const response = await fetch("/api/countries/stats")
      if (!response.ok) throw new Error("Failed to load countries")

      const data = await response.json()

      if (mountedRef.current) {
        const validCountries = (data.countries || []).map((country: any) => ({
          ...country,
          totalTickets: Number(country.totalTickets) || 0,
          availableTickets: Number(country.availableTickets) || 0,
        }))
        setCountries(validCountries)
        setLastUpdated(new Date())
        setError(null)
      }
    } catch (err) {
      console.error("[v0] Failed to load countries:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to load countries"
      setError(errorMessage)

      // Demo data for testing
      const demoCountries: Country[] = [
        { code: "KSA", name: "Saudi Arabia", flag: "🇸🇦", totalTickets: 55, availableTickets: 48 },
        { code: "UAE", name: "United Arab Emirates", flag: "🇦🇪", totalTickets: 55, availableTickets: 52 },
        { code: "QAT", name: "Qatar", flag: "🇶🇦", totalTickets: 25, availableTickets: 22 },
        { code: "KWT", name: "Kuwait", flag: "🇰🇼", totalTickets: 20, availableTickets: 18 },
        { code: "OMN", name: "Oman", flag: "🇴🇲", totalTickets: 15, availableTickets: 12 },
        { code: "BHR", name: "Bahrain", flag: "🇧🇭", totalTickets: 10, availableTickets: 8 },
      ]
      setCountries(demoCountries)
    } finally {
      if (showLoader) {
        setLoading(false)
      } else {
        setIsBackgroundLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    loadCountries()

    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        loadCountries(false)
      }, 30000)
    }

    return () => {
      mountedRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoRefresh, loadCountries])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Countries</h1>
            <p className="text-muted-foreground font-body mt-1">Loading countries...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="luxury-card">
              <CardHeader>
                <div className="h-20 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Countries</h1>
          <p className="text-muted-foreground font-body mt-1">Browse available tickets by destination country</p>
        </div>
        <div className="flex items-center gap-3">
          {!isOnline && (
            <Badge variant="destructive" className="gap-2">
              <WifiOff className="h-3 w-3" />
              Offline
            </Badge>
          )}
          {isOnline && (
            <Badge variant="secondary" className="gap-2">
              <Wifi className="h-3 w-3" />
              Online
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadCountries()}
            disabled={isBackgroundLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isBackgroundLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {lastUpdated && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
          <Clock className="h-4 w-4" />
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countries.map((country, index) => (
          <CountryCard key={country.code} country={country} index={index} />
        ))}
      </div>

      {countries.length === 0 && !loading && (
        <Card className="luxury-card">
          <CardContent className="pt-12 pb-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-heading font-semibold">No Countries Available</p>
            <p className="text-sm text-muted-foreground font-body mt-2">
              No destination countries found. Please add ticket batches to see countries here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
