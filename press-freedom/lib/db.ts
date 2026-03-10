import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { VideoMeta } from "../types"

let supabase: SupabaseClient | null = null
let dbAvailable = false

function getSupabase(): SupabaseClient | null {
  if (supabase) return supabase

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    return null
  }
  supabase = createClient(url, key)
  dbAvailable = true
  return supabase
}

export function isDbAvailable(): boolean {
  if (dbAvailable) return true
  getSupabase()
  return dbAvailable
}

export type VideoStatus = "pending" | "downloaded" | "transcribed" | "error"

/**
 * Get all video IDs that have already been processed (any status) for a source.
 * Returns empty map if DB is not configured.
 */
export async function getProcessedVideoIds(sourceId: string): Promise<Map<string, VideoStatus>> {
  const db = getSupabase()
  if (!db) return new Map()

  const { data, error } = await db
    .from("pillar1_videos")
    .select("video_id, status")
    .eq("channel_id", sourceId)

  if (error) {
    console.error(`[press-freedom] DB error fetching processed videos:`, error.message)
    return new Map()
  }

  const map = new Map<string, VideoStatus>()
  for (const row of data || []) {
    map.set(row.video_id, row.status as VideoStatus)
  }
  return map
}

/**
 * Insert or update a video record. No-op if DB is not configured.
 */
export async function upsertVideo(
  video: VideoMeta,
  status: VideoStatus,
  errorMessage?: string
): Promise<void> {
  const db = getSupabase()
  if (!db) return

  const record = {
    video_id: video.videoId,
    channel_id: video.sourceId,
    title: video.title,
    upload_date: video.uploadDate
      ? `${video.uploadDate.slice(0, 4)}-${video.uploadDate.slice(4, 6)}-${video.uploadDate.slice(6, 8)}`
      : null,
    duration: video.duration || null,
    status,
    error_message: errorMessage || null,
  }

  const { error } = await db
    .from("pillar1_videos")
    .upsert(record, { onConflict: "video_id" })

  if (error) {
    console.error(`[press-freedom] DB error upserting video ${video.videoId}:`, error.message)
  }
}
