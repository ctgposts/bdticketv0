import { NextResponse } from "next/server"
import type { User } from "@/types"

export async function POST(request: Request) {
  const defaultUser: User = {
    id: "default-user-1",
    username: "admin",
    name: "Administrator",
    email: "admin@example.com",
    role: "admin",
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json({ user: defaultUser })
}
