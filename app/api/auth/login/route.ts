import { NextResponse } from "next/server"
import type { LoginRequest, User } from "@/types"

// Demo users for testing
const DEMO_USERS: User[] = [
  {
    id: "1",
    username: "admin",
    name: "Admin User",
    email: "admin@bdticket.com",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    username: "manager",
    name: "Manager User",
    email: "manager@bdticket.com",
    role: "manager",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    username: "staff",
    name: "Staff User",
    email: "staff@bdticket.com",
    role: "staff",
    createdAt: new Date().toISOString(),
  },
]

export async function POST(request: Request) {
  try {
    const credentials: LoginRequest = await request.json()

    // Simple demo authentication (password is same as username)
    const user = DEMO_USERS.find(
      (u) => u.username === credentials.username && credentials.password === credentials.username,
    )

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
