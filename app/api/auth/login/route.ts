import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { LoginRequest, User } from "@/types"

export async function POST(request: Request) {
  try {
    const credentials: LoginRequest = await request.json()
    const supabase = await createClient()

    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", credentials.username)
      .eq("password", credentials.password)
      .eq("is_active", true)
      .single()

    if (error || !users) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user: User = {
      id: users.id,
      username: users.username,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.created_at,
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
