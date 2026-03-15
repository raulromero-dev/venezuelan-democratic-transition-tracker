import { createServiceClient } from "@/lib/supabase/server"

export type FeedType = "osint" | "us-officials" | "influencers" | "foreign-ministers"

export interface TweetRecord {
  id: string
  feed_type: FeedType
  author: string
  handle: string
  content: string
  avatar?: string
  profile_image?: string
  role?: string
  category?: string
  verified: boolean
  tweet_time: string
  link: string
  images?: string[]
  metrics: {
    likes: number
    retweets: number
    replies: number
  }
  quoted_tweet?: {
    author: string
    handle: string
    content: string
  }
  subgroups?: string[]
  affiliation?: string
  relevance_score?: number
  relevance_method?: "keyword" | "embedding" | "semantic"
}

export async function getTweets(
  feedType: FeedType,
  options: {
    lookbackHours?: number
    sinceId?: string
    limit?: number
    minRelevanceScore?: number
  } = {},
): Promise<TweetRecord[]> {
  const supabase = await createServiceClient()
  const { lookbackHours = 12, sinceId, limit = 200, minRelevanceScore } = options

  let query = supabase
    .from("eov_tweets")
    .select("*")
    .eq("feed_type", feedType)
    .order("tweet_time", { ascending: false })
    .limit(limit)

  // Filter by time window
  const cutoffTime = new Date(Date.now() - lookbackHours * 60 * 60 * 1000).toISOString()
  query = query.gte("tweet_time", cutoffTime)

  // If sinceId provided, only get tweets newer than that
  if (sinceId) {
    query = query.gt("id", sinceId)
  }

  // Filter by relevance score if specified
  if (minRelevanceScore !== undefined) {
    query = query.gte("relevance_score", minRelevanceScore)
  }

  const { data, error } = await query

  if (error) {
    console.error(`[DB] Error fetching ${feedType} tweets:`, error)
    throw error
  }

  return (data || []).map((row) => ({
    ...row,
    images: row.images || [],
    metrics: row.metrics || { likes: 0, retweets: 0, replies: 0 },
    subgroups: row.subgroups || [],
  }))
}

export async function upsertTweets(tweets: TweetRecord[]): Promise<void> {
  if (tweets.length === 0) return

  const supabase = await createServiceClient()

  const records = tweets.map((tweet) => ({
    id: tweet.id,
    feed_type: tweet.feed_type,
    author: tweet.author,
    handle: tweet.handle,
    content: tweet.content,
    avatar: tweet.avatar,
    profile_image: tweet.profile_image,
    role: tweet.role,
    category: tweet.category,
    verified: tweet.verified,
    tweet_time: tweet.tweet_time,
    link: tweet.link,
    images: tweet.images || [],
    metrics: tweet.metrics || { likes: 0, retweets: 0, replies: 0 },
    quoted_tweet: tweet.quoted_tweet,
    subgroups: tweet.subgroups || [],
    affiliation: tweet.affiliation,
    relevance_score: tweet.relevance_score,
    relevance_method: tweet.relevance_method,
    fetched_at: new Date().toISOString(),
  }))

  const { error } = await supabase.from("tweets").upsert(records, {
    onConflict: "id",
    ignoreDuplicates: false,
  })

  if (error) {
    console.error(`[DB] Error upserting tweets:`, error)
    throw error
  }

  console.log(`[DB] Upserted ${records.length} tweets`)
}

export async function getNewestTweetId(feedType: FeedType): Promise<string | null> {
  const supabase = await createServiceClient()

  const { data, error } = await supabase.from("eov_feed_metadata").select("newest_id").eq("feed_type", feedType).single()

  if (error && error.code !== "PGRST116") {
    console.error(`[DB] Error fetching newest tweet ID:`, error)
  }

  return data?.newest_id || null
}

export async function updateFeedMetadata(feedType: FeedType, newestId?: string, lookbackHours?: number): Promise<void> {
  const supabase = await createServiceClient()

  const updates: Record<string, unknown> = {
    last_fetched_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (newestId) {
    updates.newest_id = newestId
  }

  if (lookbackHours !== undefined) {
    updates.lookback_hours = lookbackHours
  }

  const { error } = await supabase.from("eov_feed_metadata").update(updates).eq("feed_type", feedType)

  if (error) {
    console.error(`[DB] Error updating feed metadata:`, error)
  }
}

export async function deleteTweetsByFeedType(feedType: FeedType): Promise<number> {
  const supabase = await createServiceClient()

  // First get count of records to be deleted
  const { count, error: countError } = await supabase
    .from("eov_tweets")
    .select("*", { count: "exact", head: true })
    .eq("feed_type", feedType)

  if (countError) {
    console.error(`[DB] Error counting ${feedType} tweets:`, countError)
    throw countError
  }

  // Delete all tweets for this feed type
  const { error } = await supabase.from("tweets").delete().eq("feed_type", feedType)

  if (error) {
    console.error(`[DB] Error deleting ${feedType} tweets:`, error)
    throw error
  }

  console.log(`[DB] Deleted ${count || 0} ${feedType} tweets`)
  return count || 0
}
