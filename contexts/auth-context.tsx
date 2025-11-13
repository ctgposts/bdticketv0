"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User, UserRole } from "@/types"
import type { AuthSession } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  session: AuthSession | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Default demo user for development
const DEFAULT_USER: User = {
  id: "demo-user",
  username: "admin",
  name: "Administrator",
  email: "admin@example.com",
  role: "admin",
  createdAt: new Date().toISOString(),
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)
  const supabaseClient = createClient()

  // Initialize auth state from session
  useEffect(() => {
    const initAuth = async () => {
      try {
        // If Supabase is not configured, use demo user
        if (!isSupabaseAvailable() || !supabaseClient) {
          setUser(DEFAULT_USER)
          setLoading(false)
          return
        }

        const {
          data: { session: currentSession },
          error: sessionError,
        } = await supabaseClient.auth.getSession()

        if (sessionError) {
          // If Supabase has an error, fall back to demo user
          setUser(DEFAULT_USER)
          setLoading(false)
          return
        }

        if (currentSession?.user) {
          setSession(currentSession)

          // Map Supabase user to local User interface
          const mappedUser: User = {
            id: currentSession.user.id,
            username:
              currentSession.user.user_metadata?.username ||
              currentSession.user.email?.split("@")[0] ||
              "user",
            name:
              currentSession.user.user_metadata?.full_name ||
              currentSession.user.email ||
              "User",
            email: currentSession.user.email || "",
            role: (currentSession.user.user_metadata?.role as UserRole) || "staff",
            createdAt:
              currentSession.user.created_at || new Date().toISOString(),
          }
          setUser(mappedUser)
        } else {
          // No session, use demo user for development
          setUser(DEFAULT_USER)
          setSession(null)
        }
      } catch (error) {
        // If any error occurs, fall back to demo user
        setUser(DEFAULT_USER)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Only subscribe to auth changes if Supabase is available
    if (!isSupabaseAvailable() || !supabaseClient) {
      return
    }

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)

      if (currentSession?.user) {
        const mappedUser: User = {
          id: currentSession.user.id,
          username:
            currentSession.user.user_metadata?.username ||
            currentSession.user.email?.split("@")[0] ||
            "user",
          name:
            currentSession.user.user_metadata?.full_name ||
            currentSession.user.email ||
            "User",
          email: currentSession.user.email || "",
          role: (currentSession.user.user_metadata?.role as UserRole) || "staff",
          createdAt: currentSession.user.created_at || new Date().toISOString(),
        }
        setUser(mappedUser)
      } else {
        setUser(DEFAULT_USER)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabaseClient])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!isSupabaseAvailable() || !supabaseClient) {
        return {
          success: false,
          error: "Supabase is not configured. Use demo mode instead.",
        }
      }

      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return {
          success: false,
          error: error.message || "Login failed",
        }
      }

      router.push("/dashboard")
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred during login"
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  const signup = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName,
            username: email.split("@")[0],
            role: "staff",
          },
        },
      })

      if (error) {
        return {
          success: false,
          error: error.message || "Signup failed",
        }
      }

      return {
        success: true,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred during signup"
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(DEFAULT_USER) // Reset to demo user
      setSession(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        login,
        signup,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
