"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { hasPermission } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Settings,
  Bell,
  Shield,
  Users,
  Database,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Trash2,
  Plus,
  ToggleRight,
  ToggleLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SystemSettings {
  companyName: string
  companyEmail: string
  timezone: string
  currency: string
  language: string
}

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  bookingConfirmation: boolean
  paymentReminder: boolean
  ticketExpiry: boolean
}

interface BusinessSettings {
  profitMarginPercentage: number
  lockDuration: number
  autoConfirmBookings: boolean
  requirePaymentConfirmation: boolean
  taxPercentage: number
}

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "staff"
  status: "active" | "inactive"
  createdAt: string
}

interface Integration {
  enabled: boolean
  status: "active" | "not_configured" | "error"
  provider?: string
}

interface AllSettings {
  system: SystemSettings
  notifications: NotificationSettings
  business: BusinessSettings
  users: User[]
  integrations: { [key: string]: Integration }
  backup: {
    lastBackup: string
    autoBackup: boolean
    backupFrequency: string
  }
}

function SettingCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card className="luxury-card">
      <CardHeader>
        <CardTitle className="font-heading">{title}</CardTitle>
        <CardDescription className="font-body">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  )
}

function ToggleSetting({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description: string
  value: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
      <div className="flex-1">
        <p className="font-body font-medium">{label}</p>
        <p className="text-sm text-muted-foreground font-body">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className="flex-shrink-0 p-1 rounded-full hover:bg-accent transition-colors"
      >
        {value ? (
          <ToggleRight className="h-6 w-6 text-green-600" />
        ) : (
          <ToggleLeft className="h-6 w-6 text-gray-400" />
        )}
      </button>
    </div>
  )
}

function InputSetting({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: {
  label: string
  value: string | number
  onChange: (value: string | number) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium font-heading">{label}</label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
        placeholder={placeholder}
        className="font-body"
      />
    </div>
  )
}

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [settings, setSettings] = useState<AllSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("system")

  const loadSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/settings")
      if (!response.ok) throw new Error("Failed to load settings")
      const data: AllSettings = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("Failed to load settings:", error)
      toast?.({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async (section: string, data: any) => {
    try {
      setSaving(true)
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      })

      if (!response.ok) throw new Error("Failed to save settings")

      const result = await response.json()
      if (settings) {
        setSettings({
          ...settings,
          [section]: result[section] || settings[section],
        })
      }

      toast?.({
        title: "Success",
        description: "Settings saved successfully",
      })
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast?.({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: "system", label: "System", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "business", label: "Business", icon: Shield },
    { id: "users", label: "Users", icon: Users },
    { id: "integrations", label: "Integrations", icon: Database },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-heading velvet-text">Settings</h1>
        <p className="text-muted-foreground mt-1 font-body">System configuration and user management</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-body font-medium rounded-t-lg transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* System Settings */}
      {activeTab === "system" && (
        <div className="space-y-6">
          <SettingCard
            title="Company Information"
            description="Basic company details and configuration"
          >
            <InputSetting
              label="Company Name"
              value={settings.system.companyName}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  system: { ...settings.system, companyName: value as string },
                })
              }
              placeholder="Enter company name"
            />
            <InputSetting
              label="Company Email"
              value={settings.system.companyEmail}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  system: { ...settings.system, companyEmail: value as string },
                })
              }
              placeholder="company@example.com"
              type="email"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium font-heading">Timezone</label>
              <Select value={settings.system.timezone} onValueChange={(value) =>
                setSettings({
                  ...settings,
                  system: { ...settings.system, timezone: value },
                })
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Dhaka">Asia/Dhaka</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => saveSettings("system", settings.system)}
                disabled={saving}
                className="font-body velvet-button"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button onClick={loadSettings} variant="outline" className="font-body">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </SettingCard>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <SettingCard
            title="Notification Preferences"
            description="Control how and when you receive notifications"
          >
            <ToggleSetting
              label="Email Notifications"
              description="Receive notifications via email"
              value={settings.notifications.emailNotifications}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, emailNotifications: value },
                })
              }
            />
            <ToggleSetting
              label="SMS Notifications"
              description="Receive notifications via SMS"
              value={settings.notifications.smsNotifications}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, smsNotifications: value },
                })
              }
            />
            <ToggleSetting
              label="Booking Confirmation"
              description="Notify when booking is confirmed"
              value={settings.notifications.bookingConfirmation}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, bookingConfirmation: value },
                })
              }
            />
            <ToggleSetting
              label="Payment Reminder"
              description="Remind about pending payments"
              value={settings.notifications.paymentReminder}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, paymentReminder: value },
                })
              }
            />
            <ToggleSetting
              label="Ticket Expiry Alert"
              description="Alert when tickets are about to expire"
              value={settings.notifications.ticketExpiry}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, ticketExpiry: value },
                })
              }
            />
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => saveSettings("notifications", settings.notifications)}
                disabled={saving}
                className="font-body velvet-button"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </SettingCard>
        </div>
      )}

      {/* Business Settings */}
      {activeTab === "business" && (
        <div className="space-y-6">
          <SettingCard
            title="Business Configuration"
            description="Financial and operational settings"
          >
            <InputSetting
              label="Profit Margin (%)"
              value={settings.business.profitMarginPercentage}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  business: { ...settings.business, profitMarginPercentage: value as number },
                })
              }
              type="number"
              placeholder="18.5"
            />
            <InputSetting
              label="Lock Duration (minutes)"
              value={settings.business.lockDuration}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  business: { ...settings.business, lockDuration: value as number },
                })
              }
              type="number"
              placeholder="30"
            />
            <InputSetting
              label="Tax Percentage (%)"
              value={settings.business.taxPercentage}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  business: { ...settings.business, taxPercentage: value as number },
                })
              }
              type="number"
              placeholder="15"
            />
            <ToggleSetting
              label="Auto Confirm Bookings"
              description="Automatically confirm bookings when payment is received"
              value={settings.business.autoConfirmBookings}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  business: { ...settings.business, autoConfirmBookings: value },
                })
              }
            />
            <ToggleSetting
              label="Require Payment Confirmation"
              description="Require explicit confirmation before processing payment"
              value={settings.business.requirePaymentConfirmation}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  business: { ...settings.business, requirePaymentConfirmation: value },
                })
              }
            />
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => saveSettings("business", settings.business)}
                disabled={saving}
                className="font-body velvet-button"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </SettingCard>
        </div>
      )}

      {/* User Management */}
      {activeTab === "users" && hasPermission(user, "manage_users") && (
        <div className="space-y-6">
          <SettingCard
            title="User Management"
            description="Manage system users and their permissions"
          >
            <div className="space-y-4">
              {settings.users.map((sysUser) => (
                <div key={sysUser.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1">
                    <p className="font-heading font-medium">{sysUser.name}</p>
                    <p className="text-sm text-muted-foreground font-body">{sysUser.email}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge className="font-body">{sysUser.role}</Badge>
                      <Badge variant={sysUser.status === "active" ? "default" : "secondary"} className="font-body">
                        {sysUser.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="font-body">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="font-body">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <Button className="font-body velvet-button w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New User
              </Button>
            </div>
          </SettingCard>
        </div>
      )}

      {/* Integrations */}
      {activeTab === "integrations" && (
        <div className="space-y-6">
          <SettingCard
            title="Third-party Integrations"
            description="Manage connected services and integrations"
          >
            {Object.entries(settings.integrations).map(([key, integration]) => (
              <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
                <div className="flex-1">
                  <p className="font-heading font-medium capitalize">{key}</p>
                  <p className="text-sm text-muted-foreground font-body">
                    {integration.provider ? `Provider: ${integration.provider}` : "No provider"}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge
                      variant={integration.enabled ? "default" : "secondary"}
                      className={integration.enabled ? "bg-green-600" : ""}
                    >
                      {integration.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Badge
                      variant={
                        integration.status === "active"
                          ? "default"
                          : integration.status === "error"
                            ? "destructive"
                            : "secondary"
                      }
                      className={integration.status === "active" ? "bg-green-600" : ""}
                    >
                      {integration.status === "active" ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" /> Active
                        </>
                      ) : integration.status === "error" ? (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" /> Error
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" /> Not Configured
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="font-body">
                  Configure
                </Button>
              </div>
            ))}
          </SettingCard>

          <SettingCard
            title="Data & Backup"
            description="Backup and data management options"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-accent/50">
                <p className="text-sm font-body font-medium">Last Backup</p>
                <p className="text-sm text-muted-foreground font-body">
                  {new Date(settings.backup.lastBackup).toLocaleString()}
                </p>
              </div>
              <ToggleSetting
                label="Automatic Backup"
                description="Enable automatic daily backups"
                value={settings.backup.autoBackup}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    backup: { ...settings.backup, autoBackup: value },
                  })
                }
              />
              <div className="flex gap-2 pt-4">
                <Button className="font-body velvet-button">Create Backup Now</Button>
                <Button variant="outline" className="font-body">
                  Download Backup
                </Button>
              </div>
            </div>
          </SettingCard>
        </div>
      )}
    </div>
  )
}
