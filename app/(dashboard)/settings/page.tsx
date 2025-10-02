"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Settings, Users, Bell, Shield, Plus, Trash2, Edit } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  createdAt: string
}

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Admin User",
      email: "admin@bdticket.com",
      role: "admin",
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      name: "Agent One",
      email: "agent1@bdticket.com",
      role: "agent",
      status: "active",
      createdAt: "2024-02-15",
    },
    {
      id: "3",
      name: "Agent Two",
      email: "agent2@bdticket.com",
      role: "agent",
      status: "active",
      createdAt: "2024-03-20",
    },
  ])

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    bookingAlerts: true,
    paymentAlerts: true,
    lowStockAlerts: true,
    currency: "BDT",
    timezone: "Asia/Dhaka",
    language: "en",
  })

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    })
  }

  const handleAddUser = () => {
    toast({
      title: "Add User",
      description: "User creation dialog would open here.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold velvet-text">Settings</h1>
          <p className="text-muted-foreground font-body mt-1">Manage system configuration and users</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="font-body gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="users" className="font-body gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="notifications" className="font-body gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="font-body gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="font-heading">General Settings</CardTitle>
              <CardDescription className="font-body">Configure basic system preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency" className="font-body">
                    Currency
                  </Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(val) => setSettings({ ...settings, currency: val })}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BDT">BDT (৳)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone" className="font-body">
                    Timezone
                  </Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(val) => setSettings({ ...settings, timezone: val })}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Dhaka">Asia/Dhaka (GMT+6)</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai (GMT+4)</SelectItem>
                      <SelectItem value="Asia/Riyadh">Asia/Riyadh (GMT+3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language" className="font-body">
                    Language
                  </Label>
                  <Select
                    value={settings.language}
                    onValueChange={(val) => setSettings({ ...settings, language: val })}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="bn">বাংলা</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} className="font-body velvet-button">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="font-heading">Company Information</CardTitle>
              <CardDescription className="font-body">Update your business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name" className="font-body">
                  Company Name
                </Label>
                <Input id="company-name" defaultValue="BD Ticket Agency" className="font-body" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email" className="font-body">
                  Email
                </Label>
                <Input id="company-email" type="email" defaultValue="info@bdticket.com" className="font-body" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-phone" className="font-body">
                  Phone
                </Label>
                <Input id="company-phone" defaultValue="+880 1234-567890" className="font-body" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-address" className="font-body">
                  Address
                </Label>
                <Input id="company-address" defaultValue="Dhaka, Bangladesh" className="font-body" />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} className="font-body velvet-button">
                  Update Information
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="luxury-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-heading">User Management</CardTitle>
                  <CardDescription className="font-body">Manage system users and permissions</CardDescription>
                </div>
                <Button onClick={handleAddUser} className="font-body velvet-button gap-2">
                  <Plus className="h-4 w-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold font-heading">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold font-heading">{u.name}</p>
                        <p className="text-sm text-muted-foreground font-body">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={u.role === "admin" ? "default" : "secondary"} className="font-body">
                        {u.role}
                      </Badge>
                      <Badge
                        variant={u.status === "active" ? "default" : "secondary"}
                        className="font-body bg-green-600"
                      >
                        {u.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="font-body bg-transparent">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="font-body bg-transparent text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="font-heading">Notification Preferences</CardTitle>
              <CardDescription className="font-body">Configure how you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-body font-semibold">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground font-body">Receive updates via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(val) => setSettings({ ...settings, emailNotifications: val })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-body font-semibold">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground font-body">Receive updates via SMS</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(val) => setSettings({ ...settings, smsNotifications: val })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-body font-semibold">Booking Alerts</Label>
                  <p className="text-sm text-muted-foreground font-body">Get notified of new bookings</p>
                </div>
                <Switch
                  checked={settings.bookingAlerts}
                  onCheckedChange={(val) => setSettings({ ...settings, bookingAlerts: val })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-body font-semibold">Payment Alerts</Label>
                  <p className="text-sm text-muted-foreground font-body">Get notified of payments</p>
                </div>
                <Switch
                  checked={settings.paymentAlerts}
                  onCheckedChange={(val) => setSettings({ ...settings, paymentAlerts: val })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-body font-semibold">Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground font-body">Alert when tickets are running low</p>
                </div>
                <Switch
                  checked={settings.lowStockAlerts}
                  onCheckedChange={(val) => setSettings({ ...settings, lowStockAlerts: val })}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} className="font-body velvet-button">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="font-heading">Security Settings</CardTitle>
              <CardDescription className="font-body">Manage password and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="font-body">
                    Current Password
                  </Label>
                  <Input id="current-password" type="password" className="font-body" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="font-body">
                    New Password
                  </Label>
                  <Input id="new-password" type="password" className="font-body" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="font-body">
                    Confirm New Password
                  </Label>
                  <Input id="confirm-password" type="password" className="font-body" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} className="font-body velvet-button">
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="luxury-card border-red-200">
            <CardHeader>
              <CardTitle className="font-heading text-red-600">Danger Zone</CardTitle>
              <CardDescription className="font-body">Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <p className="font-semibold font-heading">Clear All Data</p>
                  <p className="text-sm text-muted-foreground font-body">Remove all bookings and tickets</p>
                </div>
                <Button variant="destructive" className="font-body">
                  Clear Data
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <p className="font-semibold font-heading">Reset System</p>
                  <p className="text-sm text-muted-foreground font-body">Reset to factory defaults</p>
                </div>
                <Button variant="destructive" className="font-body">
                  Reset System
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
