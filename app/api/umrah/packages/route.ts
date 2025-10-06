import { type NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const searchParams = request.nextUrl.searchParams

    const status = searchParams.get("status")
    const packageType = searchParams.get("type")

    let query = supabase
      .from("umrah_packages")
      .select(`
        *,
        airline:airlines(name, code, logo_url)
      `)
      .order("departure_date", { ascending: true })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (packageType && packageType !== "all") {
      query = query.eq("package_type", packageType)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Error fetching umrah packages:", error)
    return NextResponse.json({ error: "Failed to fetch umrah packages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const body = await request.json()

    const { data, error } = await supabase.from("umrah_packages").insert([body]).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error creating umrah package:", error)
    return NextResponse.json({ error: "Failed to create umrah package" }, { status: 500 })
  }
}
