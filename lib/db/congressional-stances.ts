import { createServiceClient } from "@/lib/supabase/server"

export interface CongressionalStanceRecord {
  id?: string
  member_name: string
  chamber: "Senate" | "House"
  party: string
  state: string
  district?: string
  stance: "ally" | "neutral" | "normalizer"
  confidence: number
  analysis_notes?: string
  evidence: Array<{
    title: string
    snippet: string
    source: string
    url?: string
  }>
  last_updated?: string
}

export async function getAllCongressionalStances(): Promise<CongressionalStanceRecord[]> {
  const supabase = await createServiceClient()

  const { data, error } = await supabase
    .from("eov_congressional_stances")
    .select("*")
    .order("member_name", { ascending: true })

  if (error) {
    console.error("[DB] Error fetching congressional stances:", error)
    throw error
  }

  return (data || []).map((row) => ({
    ...row,
    evidence: row.evidence || [],
  }))
}

export async function getCongressionalStancesByState(state: string): Promise<CongressionalStanceRecord[]> {
  const supabase = await createServiceClient()

  const { data, error } = await supabase
    .from("eov_congressional_stances")
    .select("*")
    .eq("state", state)
    .order("member_name", { ascending: true })

  if (error) {
    console.error(`[DB] Error fetching stances for state ${state}:`, error)
    throw error
  }

  return (data || []).map((row) => ({
    ...row,
    evidence: row.evidence || [],
  }))
}

export async function upsertCongressionalStances(stances: CongressionalStanceRecord[]): Promise<void> {
  if (stances.length === 0) return

  const supabase = await createServiceClient()

  const records = stances.map((stance) => ({
    member_name: stance.member_name,
    chamber: stance.chamber,
    party: stance.party,
    state: stance.state,
    district: stance.district,
    stance: stance.stance,
    confidence: stance.confidence,
    analysis_notes: stance.analysis_notes,
    evidence: stance.evidence || [],
    last_updated: new Date().toISOString(),
  }))

  const { error } = await supabase.from("eov_congressional_stances").upsert(records, {
    onConflict: "member_name,chamber",
    ignoreDuplicates: false,
  })

  if (error) {
    console.error("[DB] Error upserting congressional stances:", error)
    throw error
  }

  console.log(`[DB] Upserted ${records.length} congressional stances`)
}

export async function getLastStanceRefresh(): Promise<string | null> {
  const supabase = await createServiceClient()

  const { data, error } = await supabase
    .from("eov_feed_metadata")
    .select("last_fetched_at")
    .eq("feed_type", "congressional-stances")
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("[DB] Error fetching last stance refresh:", error)
  }

  return data?.last_fetched_at || null
}

export async function updateStanceRefreshTime(): Promise<void> {
  const supabase = await createServiceClient()

  const { error } = await supabase
    .from("eov_feed_metadata")
    .update({
      last_fetched_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("feed_type", "congressional-stances")

  if (error) {
    console.error("[DB] Error updating stance refresh time:", error)
  }
}

export async function getStanceCounts(): Promise<{
  senate: Record<string, number>
  house: Record<string, number>
}> {
  const supabase = await createServiceClient()

  const { data, error } = await supabase.from("eov_congressional_stances").select("chamber, stance")

  if (error) {
    console.error("[DB] Error fetching stance counts:", error)
    return { senate: {}, house: {} }
  }

  const counts = {
    senate: {} as Record<string, number>,
    house: {} as Record<string, number>,
  }

  for (const row of data || []) {
    const chamber = row.chamber === "Senate" ? "senate" : "house"
    const stance = row.stance || "neutral"
    counts[chamber][stance] = (counts[chamber][stance] || 0) + 1
  }

  return counts
}

export async function deleteAllCongressionalStances(): Promise<void> {
  const supabase = await createServiceClient()

  const { error } = await supabase
    .from("eov_congressional_stances")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000") // Delete all rows (neq with impossible value)

  if (error) {
    console.error("[DB] Error deleting congressional stances:", error)
    throw error
  }

  // Also reset the refresh timestamp
  const { error: metaError } = await supabase
    .from("eov_feed_metadata")
    .update({
      last_fetched_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("feed_type", "congressional-stances")

  if (metaError) {
    console.error("[DB] Error resetting stance refresh time:", metaError)
  }

  console.log("[DB] Deleted all congressional stances")
}

// Override functions
export interface StanceOverride {
  id?: string
  member_name: string
  chamber: string
  override_stance: string
  user_notes: string
  created_at?: string
  updated_at?: string
}

export async function getStanceOverride(memberName: string, chamber: string): Promise<StanceOverride | null> {
  const supabase = await createServiceClient()

  const { data, error } = await supabase
    .from("eov_congressional_stance_overrides")
    .select("*")
    .eq("member_name", memberName)
    .eq("chamber", chamber)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("[DB] Error fetching stance override:", error)
  }

  return data || null
}

export async function getAllStanceOverrides(): Promise<StanceOverride[]> {
  const supabase = await createServiceClient()

  const { data, error } = await supabase
    .from("eov_congressional_stance_overrides")
    .select("*")
    .order("member_name", { ascending: true })

  if (error) {
    console.error("[DB] Error fetching all stance overrides:", error)
    return []
  }

  return data || []
}

export async function upsertStanceOverride(override: StanceOverride): Promise<void> {
  const supabase = await createServiceClient()

  const record = {
    member_name: override.member_name,
    chamber: override.chamber,
    override_stance: override.override_stance,
    user_notes: override.user_notes,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from("eov_congressional_stance_overrides")
    .upsert(record, {
      onConflict: "member_name,chamber",
      ignoreDuplicates: false,
    })

  if (error) {
    console.error("[DB] Error upserting stance override:", error)
    throw error
  }

  console.log(`[DB] Upserted stance override for ${override.member_name}`)
}

export async function deleteStanceOverride(memberName: string, chamber: string): Promise<void> {
  const supabase = await createServiceClient()

  const { error } = await supabase
    .from("eov_congressional_stance_overrides")
    .delete()
    .eq("member_name", memberName)
    .eq("chamber", chamber)

  if (error) {
    console.error("[DB] Error deleting stance override:", error)
    throw error
  }

  console.log(`[DB] Deleted stance override for ${memberName}`)
}
