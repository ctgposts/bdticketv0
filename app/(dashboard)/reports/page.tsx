"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { DollarSign, TrendingUp, Package, AlertCircle, Download, RefreshCw, Filter } from "lucide-react"
import { ChartContainer } from "@/components/ui/chart-container"
import { cn } from "@/lib/utils"

interface SalesReport {
  id: string
  flight_number: string
  airline_name: string
  total_amount: number
  passenger_name: string
  passenger_phone: string
  status: string
  created_at: string
  profit: number
}

interface InventoryReport {
  id: string
  flight_number: string
  airline_name: string
  status: "available" | "locked" | "sold"
  available_seats: number
  total_seats: number
  buying_price: number
  selling_price: number
}

interface ReportSummary {
  totalBookings?: number
  totalRevenue?: number
  totalProfit?: number
  averageTicketPrice?: number
  available?: number
  locked?: number
  sold?: number
  total?: number
  profitMargin?: number
  totalCost?: number
}

interface ReportData {
  data: Array<SalesReport | InventoryReport>
  summary: ReportSummary
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}: {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <Card className="luxury-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium font-heading">{title}</CardTitle>
        <div className={cn("p-2 rounded-full text-white", color)}>{Icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-heading">{value}</div>
        <p className="text-xs text-muted-foreground mt-1 font-body">{description}</p>
      </CardContent>
    </Card>
  )
}

export default function ReportsPage() {
  const { user } = useAuth()
  const [reportType, setReportType] = useState("sales")
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])

  const loadReport = async (type: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reports?type=${type}`)
      if (!response.ok) throw new Error("Failed to load report")
      const data: ReportData = await response.json()
      setReportData(data)

      // Process data for charts
      if (type === "sales") {
        const salesByDay = processChartData(data.data as SalesReport[])
        setChartData(salesByDay)
      } else if (type === "inventory") {
        const statusCounts = {
          available: data.summary.available || 0,
          locked: data.summary.locked || 0,
          sold: data.summary.sold || 0,
        }
        setChartData(
          Object.entries(statusCounts).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
          }))
        )
      } else if (type === "profit") {
        const profitByFlight = (data.data as SalesReport[]).map((booking) => ({
          name: booking.flight_number,
          profit: booking.profit,
          revenue: booking.total_amount,
        }))
        setChartData(profitByFlight)
      }
    } catch (error) {
      console.error("Failed to load report:", error)
    } finally {
      setLoading(false)
    }
  }

  const processChartData = (data: SalesReport[]) => {
    const groupedByDate: { [key: string]: SalesReport[] } = {}
    data.forEach((item) => {
      const date = new Date(item.created_at).toLocaleDateString()
      if (!groupedByDate[date]) groupedByDate[date] = []
      groupedByDate[date].push(item)
    })

    return Object.entries(groupedByDate)
      .map(([date, bookings]) => ({
        date,
        sales: bookings.length,
        revenue: bookings.reduce((sum, b) => sum + b.total_amount, 0),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  useEffect(() => {
    loadReport(reportType)
  }, [reportType])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report...</p>
        </div>
      </div>
    )
  }

  const renderSalesReport = () => (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={reportData?.summary.totalBookings || 0}
          description="Confirmed bookings"
          icon={<Package className="h-4 w-4" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Revenue"
          value={`৳${(reportData?.summary.totalRevenue || 0).toLocaleString()}`}
          description="From all bookings"
          icon={<DollarSign className="h-4 w-4" />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Profit"
          value={`৳${(reportData?.summary.totalProfit || 0).toLocaleString()}`}
          description="Net profit earned"
          icon={<TrendingUp className="h-4 w-4" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Average Price"
          value={`৳${Math.round(reportData?.summary.averageTicketPrice || 0).toLocaleString()}`}
          description="Per ticket"
          icon={<DollarSign className="h-4 w-4" />}
          color="bg-yellow-500"
        />
      </div>

      <Card className="luxury-card">
        <CardHeader>
          <CardTitle className="font-heading">Sales Trend</CardTitle>
          <CardDescription className="font-body">Daily sales and revenue over time</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#3b82f6" name="Bookings" />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue (৳)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground">No data available</p>
          )}
        </CardContent>
      </Card>

      <Card className="luxury-card">
        <CardHeader>
          <CardTitle className="font-heading">Recent Bookings</CardTitle>
          <CardDescription className="font-body">Latest confirmed bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-3 font-heading">Flight</th>
                  <th className="text-left p-3 font-heading">Passenger</th>
                  <th className="text-left p-3 font-heading">Amount</th>
                  <th className="text-left p-3 font-heading">Profit</th>
                  <th className="text-left p-3 font-heading">Date</th>
                </tr>
              </thead>
              <tbody>
                {(reportData?.data as SalesReport[])?.slice(0, 8).map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-accent/50">
                    <td className="p-3 font-body font-medium">{booking.flight_number}</td>
                    <td className="p-3 font-body">{booking.passenger_name}</td>
                    <td className="p-3 font-body">৳{booking.total_amount.toLocaleString()}</td>
                    <td className="p-3 font-body text-green-600">৳{booking.profit.toLocaleString()}</td>
                    <td className="p-3 font-body text-muted-foreground">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  )

  const renderInventoryReport = () => (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Inventory"
          value={reportData?.summary.total || 0}
          description="Total tickets in system"
          icon={<Package className="h-4 w-4" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Available"
          value={reportData?.summary.available || 0}
          description="Ready for booking"
          icon={<TrendingUp className="h-4 w-4" />}
          color="bg-green-500"
        />
        <StatCard
          title="Locked"
          value={reportData?.summary.locked || 0}
          description="Reserved temporarily"
          icon={<AlertCircle className="h-4 w-4" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Sold"
          value={reportData?.summary.sold || 0}
          description="Completed bookings"
          icon={<DollarSign className="h-4 w-4" />}
          color="bg-purple-500"
        />
      </div>

      <Card className="luxury-card">
        <CardHeader>
          <CardTitle className="font-heading">Inventory Status</CardTitle>
          <CardDescription className="font-body">Distribution of ticket statuses</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground">No data available</p>
          )}
        </CardContent>
      </Card>

      <Card className="luxury-card">
        <CardHeader>
          <CardTitle className="font-heading">Ticket Details</CardTitle>
          <CardDescription className="font-body">Current inventory breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-3 font-heading">Flight</th>
                  <th className="text-left p-3 font-heading">Airline</th>
                  <th className="text-left p-3 font-heading">Status</th>
                  <th className="text-left p-3 font-heading">Available</th>
                  <th className="text-left p-3 font-heading">Price (Sell/Buy)</th>
                </tr>
              </thead>
              <tbody>
                {(reportData?.data as InventoryReport[])?.map((ticket) => (
                  <tr key={ticket.id} className="border-b hover:bg-accent/50">
                    <td className="p-3 font-body font-medium">{ticket.flight_number}</td>
                    <td className="p-3 font-body">{ticket.airline_name}</td>
                    <td className="p-3">
                      <Badge
                        variant={ticket.status === "available" ? "default" : ticket.status === "locked" ? "secondary" : "outline"}
                        className={ticket.status === "available" ? "bg-green-600" : ""}
                      >
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-3 font-body">
                      {ticket.available_seats}/{ticket.total_seats}
                    </td>
                    <td className="p-3 font-body">৳{ticket.selling_price}/৳{ticket.buying_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  )

  const renderProfitReport = () => (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`৳${(reportData?.summary.totalRevenue || 0).toLocaleString()}`}
          description="All bookings"
          icon={<DollarSign className="h-4 w-4" />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Cost"
          value={`৳${(reportData?.summary.totalCost || 0).toLocaleString()}`}
          description="Purchase price"
          icon={<Package className="h-4 w-4" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Profit"
          value={`৳${(reportData?.summary.totalProfit || 0).toLocaleString()}`}
          description="Net earnings"
          icon={<TrendingUp className="h-4 w-4" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Profit Margin"
          value={`${Math.round(reportData?.summary.profitMargin || 0)}%`}
          description="Percentage gain"
          icon={<TrendingUp className="h-4 w-4" />}
          color="bg-yellow-500"
        />
      </div>

      <Card className="luxury-card">
        <CardHeader>
          <CardTitle className="font-heading">Profit by Flight</CardTitle>
          <CardDescription className="font-body">Profitability per flight route</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="profit" fill="#10b981" name="Profit (৳)" />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (৳)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground">No data available</p>
          )}
        </CardContent>
      </Card>

      <Card className="luxury-card">
        <CardHeader>
          <CardTitle className="font-heading">Profit Analysis</CardTitle>
          <CardDescription className="font-body">Detailed profit breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-3 font-heading">Flight</th>
                  <th className="text-left p-3 font-heading">Airline</th>
                  <th className="text-left p-3 font-heading">Revenue</th>
                  <th className="text-left p-3 font-heading">Profit</th>
                  <th className="text-left p-3 font-heading">Margin</th>
                </tr>
              </thead>
              <tbody>
                {(reportData?.data as SalesReport[])?.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-accent/50">
                    <td className="p-3 font-body font-medium">{booking.flight_number}</td>
                    <td className="p-3 font-body">{booking.airline_name}</td>
                    <td className="p-3 font-body">৳{booking.total_amount.toLocaleString()}</td>
                    <td className="p-3 font-body text-green-600">৳{booking.profit.toLocaleString()}</td>
                    <td className="p-3 font-body">
                      {((booking.profit / booking.total_amount) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading velvet-text">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1 font-body">Business analytics and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => loadReport(reportType)} variant="outline" size="sm" className="font-body">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="font-body">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-body text-muted-foreground">Select Report Type:</span>
        </div>
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sales">Sales Report</SelectItem>
            <SelectItem value="inventory">Inventory Report</SelectItem>
            <SelectItem value="profit">Profit Analysis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {reportType === "sales" && renderSalesReport()}
        {reportType === "inventory" && renderInventoryReport()}
        {reportType === "profit" && renderProfitReport()}
      </div>
    </div>
  )
}
