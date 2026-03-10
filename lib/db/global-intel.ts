import { createServiceClient } from "@/lib/supabase/server"

export interface GlobalIntelRecord {
  id?: string
  leader_name: string
  leader_title: string
  country: string
  statement: string
  stance?: string
  context?: string
  source?: string
  source_url?: string
  statement_date?: string
}

export async function getGlobalIntel(
  options: {
    lookbackHours?: number
    limit?: number
    country?: string
  } = {},
): Promise<GlobalIntelRecord[]> {
  const supabase = await createServiceClient()
  const { lookbackHours = 168, limit = 100, country } = options // Default 7 days

  let query = supabase.from("global_intel").select("*").order("statement_date", { ascending: false }).limit(limit)

  // Filter by time window
  const cutoffTime = new Date(Date.now() - lookbackHours * 60 * 60 * 1000).toISOString()
  query = query.gte("statement_date", cutoffTime)

  if (country) {
    query = query.eq("country", country)
  }

  const { data, error } = await query

  if (error) {
    console.error("[DB] Error fetching global intel:", error)
    throw error
  }

  return data || []
}

export async function upsertGlobalIntel(intel: GlobalIntelRecord[]): Promise<void> {
  if (intel.length === 0) return

  const supabase = await createServiceClient()

  const records = intel.map((item) => ({
    leader_name: item.leader_name,
    leader_title: item.leader_title,
    country: item.country,
    statement: item.statement,
    stance: item.stance,
    context: item.context,
    source: item.source,
    source_url: item.source_url,
    statement_date: item.statement_date || new Date().toISOString(),
    fetched_at: new Date().toISOString(),
  }))

  const { error } = await supabase.from("global_intel").upsert(records, {
    onConflict: "leader_name,statement",
    ignoreDuplicates: false,
  })

  if (error) {
    console.error("[DB] Error upserting global intel:", error)
    throw error
  }

  console.log(`[DB] Upserted ${records.length} global intel records`)
}
