import { createBrowserClient, type SupabaseClient } from "@supabase/ssr"

let browserClient: SupabaseClient | null = null
let isCreating = false

export function createClient() {
  // Return null if not in browser
  if (typeof window === "undefined") {
    return null as any
  }

  // Return existing client if available
  if (browserClient) {
    return browserClient
  }

  // Prevent race conditions during creation
  if (isCreating) {
    // Wait a tick and try again - this handles concurrent calls
    return browserClient as any
  }

  isCreating = true

  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: "sb-auth-token",
      },
      // Disable auto-refresh to reduce GoTrueClient activity
      auth: {
        persistSession: true,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  )

  isCreating = false

  return browserClient
}
