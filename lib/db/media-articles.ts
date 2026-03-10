import { createServiceClient } from "@/lib/supabase/server"

export interface MediaArticleRecord {
  id?: string
  title: string
  snippet?: string
  source: string
  url: string
  image_url?: string
  published_at?: string
  category?: string
  relevance_score?: number
  topics?: string[]
}

export async function getMediaArticles(
  options: {
    lookbackHours?: number
    limit?: number
    category?: string
  } = {},
): Promise<MediaArticleRecord[]> {
  const supabase = await createServiceClient()
  const { lookbackHours = 24, limit = 50, category } = options

  let query = supabase.from("media_articles").select("*").order("published_at", { ascending: false }).limit(limit)

  // Filter by time window
  const cutoffTime = new Date(Date.now() - lookbackHours * 60 * 60 * 1000).toISOString()
  query = query.gte("published_at", cutoffTime)

  if (category && category !== "All") {
    query = query.eq("category", category)
  }

  const { data, error } = await query

  if (error) {
    console.error("[DB] Error fetching media articles:", error)
    throw error
  }

  return data || []
}

export async function upsertMediaArticles(articles: MediaArticleRecord[]): Promise<void> {
  if (articles.length === 0) return

  const supabase = await createServiceClient()

  const records = articles.map((article) => ({
    title: article.title,
    snippet: article.snippet,
    source: article.source,
    url: article.url,
    image_url: article.image_url,
    published_at: article.published_at || new Date().toISOString(),
    category: article.category,
    relevance_score: article.relevance_score,
    topics: article.topics || [],
    fetched_at: new Date().toISOString(),
  }))

  const { error } = await supabase.from("media_articles").upsert(records, {
    onConflict: "url",
    ignoreDuplicates: false,
  })

  if (error) {
    console.error("[DB] Error upserting media articles:", error)
    throw error
  }

  console.log(`[DB] Upserted ${records.length} media articles`)
}
