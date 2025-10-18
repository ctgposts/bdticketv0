"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, LoginRequest } from "@/types"

interface AuthContextType {
  user: User | null
  login: (credentials: LoginRequest) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEFAULT_USER: User = {
  id: "default-user-1",
  username: "admin",
  name: "Administrator",
  email: "admin@example.com",
  role: "admin",
  createdAt: new Date().toISOString(),
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(DEFAULT_USER)
    setLoading(false)
  }, [])

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    setUser(DEFAULT_USER)
    return true
  }

  const logout = () => {
    setUser(DEFAULT_USER)
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
