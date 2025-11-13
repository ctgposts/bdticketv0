"use client"

import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

// Check if Supabase is configured by checking environment variables
function isSupabaseConfigured(): boolean {
  return !!(
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export function createClient() {
  // Return null if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return null as any
  }

  if (client) return client

  try {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  } catch (error) {
    console.warn("Failed to create Supabase client:", error)
    return null as any
  }

  return client
}

export function isSupabaseAvailable(): boolean {
  return isSupabaseConfigured()
}
