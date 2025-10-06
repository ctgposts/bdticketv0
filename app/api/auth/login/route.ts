import { NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"
import type { LoginRequest, User } from "@/types"

export async function POST(request: Request) {
  try {
    const credentials: LoginRequest = await request.json()
    const supabase = await createServiceClient()

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", credentials.username)
      .eq("is_active", true)
      .single()

    if (error || !user) {
      console.error("[v0] User lookup error:", error)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // For demo purposes, we're using a simple hash comparison
    const passwordMatch = await verifyPassword(credentials.password, user.password_hash)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const userData: User = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
    }

    return NextResponse.json({ user: userData })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // For demo purposes, we're using a simple comparison
  // In production, use bcrypt or similar
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex === hash
}
