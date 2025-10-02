"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, DollarSign, Download, RefreshCw, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SalesData {
  date: string
  sales: number
  bookings: number
  revenue: number
}

interface TopAgent {
  name: string
  sales: number
  revenue: number
  commission: number
}

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("7days")
  const [loading, setLoading] = useState(false)
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [topAgents, setTopAgents] = useState<TopAgent[]>([])

  useEffect(() => {
    loadReportData()
  }, [timeRange])

  const loadReportData = async () => {
    setLoading(true)
    // Mock data
    setTimeout(() => {
      setSalesData([
        { date: "2024-12-20", sales: 15, bookings: 8, revenue: 675000 },
        { date: "2024-12-21", sales: 22, bookings: 12, revenue: 990000 },
        { date: "2024-12-22", sales: 18, bookings: 10, revenue: 810000 },
        { date: "2024-12-23", sales: 25, bookings: 15, revenue: 1125000 },
        { date: "2024-12-24", sales: 30, bookings: 18, revenue: 1350000 },
        { date: "2024-12-25", sales: 28, bookings: 16, revenue: 1260000 },
        { date: "2024-12-26", sales: 20, bookings: 11, revenue: 900000 },
      ])

      setTopAgents([
        { name: "Ahmed Khan", sales: 45, revenue: 2025000, commission: 101250 },
        { name: "Fatima Rahman", sales: 38, revenue: 1710000, commission: 85500 },
        { name: "Mohammad Ali", sales: 32, revenue: 1440000, commission: 72000 },
        { name: "Ayesha Begum", sales: 28, revenue: 1260000, commission: 63000 },
        { name: "Ibrahim Hassan", sales: 25, revenue: 1125000, commission: 56250 },
      ])
      setLoading(false)
    }, 500)
  }

  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0)
  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0)
  const totalBookings = salesData.reduce((sum, day) => sum + day.bookings, 0)
  const avgDailyRevenue = salesData.length > 0 ? totalRevenue / salesData.length : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold velvet-text">Reports & Analytics</h1>
          <p className="text-muted-foreground font-body mt-1">Business insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadReportData} className="font-body bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" className="font-body velvet-button">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px] font-body">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="luxury-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-heading">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">৳{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground font-body mt-1">
              Avg: ৳{Math.round(avgDailyRevenue).toLocaleString()}/day
            </p>
          </CardContent>
        </Card>

        <Card className="luxury-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-heading">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{totalSales}</div>
            <p className="text-xs text-muted-foreground font-body mt-1">Tickets sold</p>
          </CardContent>
        </Card>

        <Card className="luxury-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-heading">Active Bookings</CardTitle>
            <FileText className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">{totalBookings}</div>
            <p className="text-xs text-muted-foreground font-body mt-1">Pending confirmations</p>
          </CardContent>
        </Card>

        <Card className="luxury-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-heading">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-heading">
              {totalBookings > 0 ? Math.round((totalSales / totalBookings) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground font-body mt-1">Bookings to sales</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="font-body">
            Overview
          </TabsTrigger>
          <TabsTrigger value="agents" className="font-body">
            Top Agents
          </TabsTrigger>
          <TabsTrigger value="destinations" className="font-body">
            Destinations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="font-heading">Daily Sales Trend</CardTitle>
              <CardDescription className="font-body">Sales and revenue over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesData.map((day, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-body text-muted-foreground">
                      {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded"
                          style={{ width: `${(day.sales / 30) * 100}%` }}
                        />
                        <span className="text-sm font-body font-semibold">{day.sales} sales</span>
                      </div>
                      <div className="text-xs text-muted-foreground font-body">
                        ৳{day.revenue.toLocaleString()} revenue
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="font-heading">Top Performing Agents</CardTitle>
              <CardDescription className="font-body">Ranked by total sales and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topAgents.map((agent, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold font-heading">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold font-heading">{agent.name}</p>
                        <p className="text-sm text-muted-foreground font-body">{agent.sales} tickets sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold font-heading">৳{agent.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground font-body">
                        Commission: ৳{agent.commission.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="destinations" className="space-y-4">
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="font-heading">Popular Destinations</CardTitle>
              <CardDescription className="font-body">Most booked travel destinations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { country: "Saudi Arabia", flag: "🇸🇦", bookings: 85, revenue: 3825000 },
                  { country: "United Arab Emirates", flag: "🇦🇪", bookings: 72, revenue: 3456000 },
                  { country: "Qatar", flag: "🇶🇦", bookings: 45, revenue: 2070000 },
                  { country: "Kuwait", flag: "🇰🇼", bookings: 32, revenue: 1440000 },
                  { country: "Oman", flag: "🇴🇲", bookings: 24, revenue: 1080000 },
                ].map((dest, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{dest.flag}</span>
                      <div>
                        <p className="font-semibold font-heading">{dest.country}</p>
                        <p className="text-sm text-muted-foreground font-body">{dest.bookings} bookings</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold font-heading">৳{dest.revenue.toLocaleString()}</p>
                      <Badge variant="secondary" className="font-body">
                        {Math.round((dest.bookings / 258) * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
