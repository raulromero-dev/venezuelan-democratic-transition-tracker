import {
  getForeignMinisterAccountInfo,
  getForeignMinisterHandlesByRegion,
  getAllForeignMinisterHandles,
  type ForeignMinisterAccount,
} from "@/lib/foreign-ministers-accounts"
import { scoreTweetsRelevance } from "@/lib/semantic-relevance"
import { RELEVANCE_THRESHOLD } from "@/lib/venezuela-keywords"
import { getTweets, upsertTweets, updateFeedMetadata, type TweetRecord, type FeedType } from "@/lib/db/tweets"

export const maxDuration = 60

const X_API_BEARER_TOKEN = process.env.X_API_BEARER_TOKEN

// Rate limit config
const BATCH_SIZE = 10
const BATCH_DELAY_MS = 3000
const DEFAULT_LOOKBACK_HOURS = 24

interface XTweet {
  id: string
  text: string
  author_id: string
  created_at: string
  public_metrics?: {
    like_count: number
    retweet_count: number
    reply_count: number
    quote_count: number
  }
  entities?: {
    urls?: Array<{ url: string; expanded_url: string; display_url: string }>
    mentions?: Array<{ username: string }>
  }
  attachments?: { media_keys?: string[] }
  referenced_tweets?: Array<{ type: "quoted" | "replied_to" | "retweeted"; id: string }>
}

interface XUser {
  id: string
  name: string
  username: string
  profile_image_url?: string
  verified?: boolean
  verified_type?: string
}

interface XMedia {
  media_key: string
  type: "photo" | "video" | "animated_gif"
  url?: string
  preview_image_url?: string
}

interface XApiResponse {
  data?: XTweet[]
  includes?: { users?: XUser[]; media?: XMedia[]; tweets?: XTweet[] }
  meta?: { newest_id?: string; oldest_id?: string; result_count?: number; next_token?: string }
  errors?: Array<{ detail: string; title: string; type: string }>
}

export interface ForeignMinisterPost {
  id: string
  handle: string
  author: string
  role: string
  country: string
  countryCode: string
  flag: string
  region: string
  content: string
  timestamp: string
  createdAt: string
  source: "X"
  url: string
  isVerified: boolean
  profileImage?: string
  metrics: { likes: number; retweets: number; replies: number }
  images?: string[]
  quotedTweet?: { author: string; handle: string; content: string }
  relevanceScore?: number
  relevanceMethod?: "keyword" | "semantic"
}

const FEED_TYPE: FeedType = "foreign-ministers" as FeedType

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lookbackHours = Number.parseInt(searchParams.get("lookbackHours") || "24")
  const region = searchParams.get("region") || "All"

  try {
    // Try to get from database first
    const dbPosts = await getTweets(FEED_TYPE, { lookbackHours, limit: 500 })
    if (dbPosts.length > 0) {
      console.log("[v0] Returning", dbPosts.length, "foreign minister posts from database")
      let posts = dbPosts.map(dbToPost)

      // Filter by region if specified
      if (region !== "All") {
        posts = posts.filter((p) => p.region === region)
      }

      // Filter by relevance
      posts = posts.filter((p) => (p.relevanceScore || 0) >= RELEVANCE_THRESHOLD)

      return Response.json({
        posts,
        source: "database",
        meta: { totalTweets: posts.length },
      })
    }
  } catch (dbError) {
    console.error("[v0] Database read error:", dbError)
  }

  return Response.json({ posts: [], source: "database", meta: { totalTweets: 0 } })
}

export async function POST(request: Request) {
  console.log("[v0] === Foreign Minister Feed API Started ===")

  try {
    const body = await request.json()
    const {
      region = "All",
      lookbackHours = DEFAULT_LOOKBACK_HOURS,
      refresh = false,
    } = body as {
      region?: string
      lookbackHours?: number
      refresh?: boolean
    }

    // Try database first if not refreshing
    if (!refresh) {
      try {
        const dbPosts = await getTweets(FEED_TYPE, { lookbackHours, limit: 500 })
        if (dbPosts.length > 0) {
          console.log("[v0] Returning", dbPosts.length, "foreign minister posts from database")
          let posts = dbPosts.map(dbToPost)

          if (region !== "All") {
            posts = posts.filter((p) => p.region === region)
          }

          const relevantPosts = posts.filter((p) => (p.relevanceScore || 0) >= RELEVANCE_THRESHOLD)

          return Response.json({
            posts: relevantPosts,
            source: "database",
            meta: { totalTweets: posts.length, relevantPosts: relevantPosts.length },
          })
        }
      } catch (dbError) {
        console.error("[v0] Database read error:", dbError)
      }
    }

    if (!X_API_BEARER_TOKEN) {
      console.error("[v0] X_API_BEARER_TOKEN not configured")
      return Response.json({ error: "X API not configured", posts: [] }, { status: 500 })
    }

    // Get handles based on region
    const handles =
      region === "All"
        ? getAllForeignMinisterHandles()
        : getForeignMinisterHandlesByRegion(region as ForeignMinisterAccount["region"])

    console.log("[v0] Querying", handles.length, "accounts for region:", region)

    // Batch the handles
    const handleBatches: string[][] = []
    for (let i = 0; i < handles.length; i += BATCH_SIZE) {
      handleBatches.push(handles.slice(i, i + BATCH_SIZE))
    }

    const now = new Date()
    const startTime = new Date(now.getTime() - lookbackHours * 60 * 60 * 1000)
    const startTimeISO = startTime.toISOString()

    const allTweets: XTweet[] = []
    const allUsers: XUser[] = []
    const allMedia: XMedia[] = []
    const allIncludedTweets: XTweet[] = []
    let newestId: string | undefined

    for (let batchIndex = 0; batchIndex < handleBatches.length; batchIndex++) {
      const batch = handleBatches[batchIndex]
      const query = batch.map((h) => `from:${h}`).join(" OR ")

      console.log(`[v0] Batch ${batchIndex + 1}/${handleBatches.length}: querying ${batch.length} handles`)

      const params = new URLSearchParams({
        query,
        max_results: "100",
        "tweet.fields": "created_at,public_metrics,entities,attachments,referenced_tweets",
        "user.fields": "name,username,profile_image_url,verified,verified_type",
        "media.fields": "url,preview_image_url,type",
        expansions: "author_id,attachments.media_keys,referenced_tweets.id",
        start_time: startTimeISO,
      })

      const url = `https://api.x.com/2/tweets/search/recent?${params.toString()}`

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${X_API_BEARER_TOKEN}` },
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`[v0] X API error (batch ${batchIndex + 1}):`, errorText)
          if (response.status === 429) break
          continue
        }

        const data: XApiResponse = await response.json()

        if (data.data) allTweets.push(...data.data)
        if (data.includes?.users) allUsers.push(...data.includes.users)
        if (data.includes?.media) allMedia.push(...data.includes.media)
        if (data.includes?.tweets) allIncludedTweets.push(...data.includes.tweets)
        if (data.meta?.newest_id && (!newestId || data.meta.newest_id > newestId)) {
          newestId = data.meta.newest_id
        }
      } catch (fetchError) {
        console.error(`[v0] Fetch error (batch ${batchIndex + 1}):`, fetchError)
      }

      if (batchIndex < handleBatches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS))
      }
    }

    console.log("[v0] Total tweets fetched:", allTweets.length)

    // Build lookup maps
    const userMap = new Map<string, XUser>()
    for (const user of allUsers) userMap.set(user.id, user)

    const mediaMap = new Map<string, XMedia>()
    for (const media of allMedia) mediaMap.set(media.media_key, media)

    const quotedTweetMap = new Map<string, XTweet>()
    for (const tweet of allIncludedTweets) quotedTweetMap.set(tweet.id, tweet)

    // Process tweets
    const postsWithoutRelevance: Omit<ForeignMinisterPost, "relevanceScore" | "relevanceMethod">[] = allTweets.map(
      (tweet) => {
        const user = userMap.get(tweet.author_id)
        const username = user?.username || "unknown"
        const handle = `@${username}`

        const account = getForeignMinisterAccountInfo(username)

        const images: string[] = []
        if (tweet.attachments?.media_keys) {
          for (const key of tweet.attachments.media_keys) {
            const media = mediaMap.get(key)
            if (media) {
              const mediaUrl = media.url || media.preview_image_url
              if (mediaUrl) images.push(mediaUrl)
            }
          }
        }

        let quotedTweet: ForeignMinisterPost["quotedTweet"] | undefined
        const quotedRef = tweet.referenced_tweets?.find((r) => r.type === "quoted")
        if (quotedRef) {
          const quoted = quotedTweetMap.get(quotedRef.id)
          if (quoted) {
            const quotedUser = userMap.get(quoted.author_id)
            quotedTweet = {
              author: quotedUser?.name || "Unknown",
              handle: quotedUser ? `@${quotedUser.username}` : "@unknown",
              content: quoted.text,
            }
          }
        }

        const createdAt = new Date(tweet.created_at)
        const diffMs = now.getTime() - createdAt.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMins / 60)
        const diffDays = Math.floor(diffHours / 24)

        let timestamp: string
        if (diffDays > 0) {
          timestamp = `${diffDays}d ago`
        } else if (diffHours > 0) {
          timestamp = `${diffHours}h ago`
        } else {
          timestamp = `${diffMins}m ago`
        }

        return {
          id: tweet.id,
          handle,
          author: account?.name || user?.name || username,
          role: account?.role || "Government Official",
          country: account?.country || "Unknown",
          countryCode: account?.countryCode || "XX",
          flag: account?.flag || "🏳️",
          region: account?.region || "Unknown",
          content: tweet.text,
          timestamp,
          createdAt: tweet.created_at,
          source: "X" as const,
          url: `https://x.com/${username}/status/${tweet.id}`,
          isVerified: user?.verified || user?.verified_type === "government" || !!account,
          profileImage: user?.profile_image_url?.replace("_normal", "_400x400"),
          metrics: {
            likes: tweet.public_metrics?.like_count || 0,
            retweets: tweet.public_metrics?.retweet_count || 0,
            replies: tweet.public_metrics?.reply_count || 0,
          },
          images: images.length > 0 ? images : undefined,
          quotedTweet,
        }
      },
    )

    // Score relevance
    let posts: ForeignMinisterPost[]
    if (postsWithoutRelevance.length > 0) {
      const scoredPosts = await scoreTweetsRelevance(postsWithoutRelevance.map((p) => ({ id: p.id, text: p.content })))
      const scoreMap = new Map(scoredPosts.map((p) => [p.id, { score: p.relevanceScore, method: p.relevanceMethod }]))
      posts = postsWithoutRelevance.map((p) => {
        const score = scoreMap.get(p.id)
        return {
          ...p,
          relevanceScore: score?.score,
          relevanceMethod: score?.method === "none" ? undefined : score?.method,
        }
      })
    } else {
      posts = postsWithoutRelevance.map((p) => ({ ...p, relevanceScore: undefined, relevanceMethod: undefined }))
    }

    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Save to database
    try {
      const dbRecords: TweetRecord[] = posts.map((p) => ({
        id: p.id,
        feed_type: FEED_TYPE,
        author: p.author,
        handle: p.handle.replace("@", ""),
        content: p.content,
        profile_image: p.profileImage,
        role: p.role,
        category: p.country,
        verified: p.isVerified,
        tweet_time: p.createdAt,
        link: p.url,
        images: p.images,
        metrics: p.metrics,
        quoted_tweet: p.quotedTweet,
        subgroups: [p.region],
        affiliation: p.country,
        relevance_score: p.relevanceScore,
        relevance_method: p.relevanceMethod,
      }))

      await upsertTweets(dbRecords)
      await updateFeedMetadata(FEED_TYPE, newestId, lookbackHours)
      console.log("[v0] Saved", dbRecords.length, "foreign minister tweets to database")
    } catch (dbError) {
      console.error("[v0] Database save error:", dbError)
    }

    // Filter by relevance for response
    const relevantPosts = posts.filter((p) => (p.relevanceScore || 0) >= RELEVANCE_THRESHOLD)

    return Response.json({
      posts: relevantPosts,
      source: "api",
      meta: {
        totalTweets: allTweets.length,
        relevantPosts: relevantPosts.length,
        accountsQueried: handles.length,
      },
    })
  } catch (error) {
    console.error("[v0] Foreign Minister Feed API error:", error)
    return Response.json({ error: "Failed to fetch feed", posts: [] }, { status: 500 })
  }
}

function dbToPost(record: TweetRecord): ForeignMinisterPost {
  const createdAt = new Date(record.tweet_time)
  const now = new Date()
  const diffMs = now.getTime() - createdAt.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  let timestamp: string
  if (diffDays > 0) {
    timestamp = `${diffDays}d ago`
  } else if (diffHours > 0) {
    timestamp = `${diffHours}h ago`
  } else {
    timestamp = `${diffMins}m ago`
  }

  // Try to get account info
  const account = getForeignMinisterAccountInfo(record.handle)

  return {
    id: record.id,
    handle: `@${record.handle}`,
    author: record.author,
    role: record.role || "Government Official",
    country: account?.country || record.category || record.affiliation || "Unknown",
    countryCode: account?.countryCode || "XX",
    flag: account?.flag || "🏳️",
    region: account?.region || record.subgroups?.[0] || "Unknown",
    content: record.content,
    timestamp,
    createdAt: record.tweet_time,
    source: "X",
    url: record.link,
    isVerified: record.verified,
    profileImage: record.profile_image,
    metrics: record.metrics,
    images: record.images && record.images.length > 0 ? record.images : undefined,
    quotedTweet: record.quoted_tweet,
    relevanceScore: record.relevance_score,
    relevanceMethod: record.relevance_method === "embedding" ? "semantic" : record.relevance_method,
  }
}
