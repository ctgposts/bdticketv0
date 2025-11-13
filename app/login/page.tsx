"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogIn, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState("admin@example.com")
  const [password, setPassword] = useState("admin123")
  const [fullName, setFullName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isDemo, setIsDemo] = useState(true)

  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      // For demo purposes, using default credentials
      router.push("/dashboard")
    } catch (err) {
      setError("Demo login failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRealLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!email || !password) {
      setError("Please fill in all fields")
      setIsSubmitting(false)
      return
    }

    const result = await login(email, password)

    if (!result.success) {
      setError(result.error || "Login failed")
    }
    // Success handled by auth context redirect
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md luxury-card">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <LogIn className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-heading">Welcome Back</CardTitle>
          <CardDescription className="font-body">
            {isDemo
              ? "BD TicketPro - Travel Agency Management"
              : "Sign in with your Supabase account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isDemo ? (
            <form onSubmit={handleDemoLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm font-body text-blue-900 space-y-2">
                <p className="font-medium">Demo Mode</p>
                <p>
                  Click "Enter Demo" to access the application with demo credentials. This allows you to explore
                  the full functionality without a Supabase account.
                </p>
                <p className="text-xs text-blue-700">
                  Note: To use real Supabase authentication, toggle to "Real Login" and provide your credentials.
                </p>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full font-body velvet-button">
                {isSubmitting ? "Entering..." : "Enter Demo"}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setIsDemo(false)
                  setError(null)
                  setEmail("")
                  setPassword("")
                }}
                className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Or switch to real login with Supabase
              </button>
            </form>
          ) : (
            <form onSubmit={handleRealLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium font-heading">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="font-body"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium font-heading">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="font-body"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs font-body text-amber-900">
                <p className="font-medium">Supabase Required</p>
                <p>
                  You need Supabase credentials set up in your environment variables to use real authentication.
                </p>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full font-body velvet-button">
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setIsDemo(true)
                  setError(null)
                }}
                className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Back to demo mode
              </button>
            </form>
          )}

          <div className="mt-4 text-center text-xs text-muted-foreground font-body">
            <p>
              {isDemo
                ? "This is a demo application - no authentication required."
                : "Use your Supabase account credentials."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
