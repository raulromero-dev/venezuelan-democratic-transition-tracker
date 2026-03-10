import { HOUSE_MEMBERS, type HouseMember } from "@/lib/house-members"
import { scoreTweetsRelevance, RELEVANCE_THRESHOLD } from "@/lib/semantic-relevance"
import { getTweets, upsertTweets, updateFeedMetadata, type TweetRecord } from "@/lib/db/tweets"

export const maxDuration = 60

const X_API_BEARER_TOKEN = process.env.X_API_BEARER_TOKEN

// Rate limit config for X API free tier
const BATCH_SIZE = 10 // 10 handles per batch
const BATCH_DELAY_MS = 3000 // 3 seconds between batches
const DEFAULT_LOOKBACK_HOURS = 2 // Default to 2 hours

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
    urls?: Array<{
      url: string
      expanded_url: string
      display_url: string
    }>
  }
  attachments?: {
    media_keys?: string[]
  }
  referenced_tweets?: Array<{
    type: "quoted" | "replied_to" | "retweeted"
    id: string
  }>
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
  includes?: {
    users?: XUser[]
    media?: XMedia[]
    tweets?: XTweet[]
  }
  meta?: {
    newest_id?: string
    oldest_id?: string
    result_count?: number
    next_token?: string
  }
  errors?: Array<{
    detail: string
    title: string
    type: string
  }>
}

export interface ProcessedPost {
  id: string
  handle: string
  author: string
  role: string
  content: string
  timestamp: string
  createdAt: string
  source: "X"
  url: string
  isVerified: boolean
  profileImage?: string
  metrics: {
    likes: number
    retweets: number
    replies: number
  }
  images?: string[]
  quotedTweet?: {
    author: string
    handle: string
    content: string
  }
  party: string
  state: string
  district: string
  fetchedAt: string
  relevanceScore?: number
  relevanceMethod?: "keyword" | "semantic"
}

// Get all House members with handles
function getHouseHandles(): { handle: string; member: HouseMember }[] {
  return HOUSE_MEMBERS.filter((m) => m.officialHandle).map((m) => ({
    handle: m.officialHandle,
    member: m,
  }))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lookbackHours = Number.parseInt(searchParams.get("lookbackHours") || "2")

  try {
    const dbPosts = await getTweets("house", { lookbackHours, limit: 200 })
    if (dbPosts.length > 0) {
      console.log("[v0] Returning", dbPosts.length, "House posts from database")
      const posts = dbPosts.map(dbToPost)
      const relevantCount = posts.filter((p) => (p.relevanceScore || 0) >= RELEVANCE_THRESHOLD).length
      return Response.json({
        posts,
        newestId: dbPosts[0]?.id,
        source: "database",
        meta: {
          totalTweets: posts.length,
          relevantPosts: relevantCount,
        },
      })
    }
  } catch (dbError) {
    console.error("[v0] Database read error:", dbError)
  }

  return Response.json({ posts: [], source: "database", meta: { totalTweets: 0 } })
}

export async function POST(request: Request) {
  console.log("[v0] === House Feed API (X API) Started ===")

  try {
    const body = await request.json()
    console.log("[v0] Request body:", JSON.stringify(body))

    const {
      lookbackHours = DEFAULT_LOOKBACK_HOURS,
      sinceId,
      maxResults = 50,
      scoreRelevance = true,
      refresh = false,
      party,
    } = body as {
      lookbackHours?: number
      sinceId?: string
      maxResults?: number
      scoreRelevance?: boolean
      refresh?: boolean
      party?: "Republican" | "Democrat" | "All"
    }

    // Check database first if not refreshing
    if (!refresh && !sinceId) {
      try {
        const dbPosts = await getTweets("house", { lookbackHours, limit: 200 })
        if (dbPosts.length > 0) {
          console.log("[v0] Returning", dbPosts.length, "House posts from database")
          const posts = dbPosts.map(dbToPost)
          const relevantCount = posts.filter((p) => (p.relevanceScore || 0) >= RELEVANCE_THRESHOLD).length
          return Response.json({
            posts,
            fetchedAt: new Date().toISOString(),
            lookbackHours,
            newestId: dbPosts[0]?.id,
            source: "database",
            meta: {
              totalTweets: posts.length,
              relevantPosts: relevantCount,
              relevanceThreshold: RELEVANCE_THRESHOLD,
            },
          })
        }
      } catch (dbError) {
        console.error("[v0] Database read error:", dbError)
      }
    }

    if (!X_API_BEARER_TOKEN) {
      console.error("[v0] ERROR: X_API_BEARER_TOKEN environment variable is not set")
      return Response.json(
        {
          error: "X API Bearer token not configured.",
          posts: [],
        },
        { status: 500 },
      )
    }

    const houseHandles = getHouseHandles()
    console.log("[v0] Total House members with handles:", houseHandles.length)

    // Create a map for quick lookup
    const handleToMember = new Map<string, HouseMember>()
    for (const { handle, member } of houseHandles) {
      handleToMember.set(handle.toLowerCase(), member)
    }

    const allHandles = houseHandles.map((h) => h.handle)

    const handleBatches: string[][] = []
    for (let i = 0; i < allHandles.length; i += BATCH_SIZE) {
      handleBatches.push(allHandles.slice(i, i + BATCH_SIZE))
    }

    const batchesToProcess = handleBatches
    console.log("[v0] Processing", batchesToProcess.length, "batches of", BATCH_SIZE, "handles each")

    const now = new Date()
    const startTime = new Date(now.getTime() - lookbackHours * 60 * 60 * 1000)
    const startTimeISO = startTime.toISOString()

    console.log("[v0] Time range: from", startTimeISO, "to now")
    console.log("[v0] Processing", batchesToProcess.length, "batches of House members")

    const allTweets: XTweet[] = []
    const allUsers: XUser[] = []
    const allMedia: XMedia[] = []
    const allIncludedTweets: XTweet[] = []
    let newestId: string | undefined

    for (let batchIndex = 0; batchIndex < batchesToProcess.length; batchIndex++) {
      const batch = batchesToProcess[batchIndex]
      const query = batch.map((h) => `from:${h}`).join(" OR ")

      console.log(`[v0] Batch ${batchIndex + 1}/${batchesToProcess.length}: querying ${batch.length} handles`)

      const params = new URLSearchParams({
        query: query,
        max_results: Math.min(maxResults, 100).toString(),
        "tweet.fields": "created_at,public_metrics,entities,attachments,referenced_tweets",
        "user.fields": "name,username,profile_image_url,verified,verified_type",
        "media.fields": "url,preview_image_url,type",
        expansions: "author_id,attachments.media_keys,referenced_tweets.id",
      })

      if (sinceId) {
        params.set("since_id", sinceId)
      } else {
        params.set("start_time", startTimeISO)
      }

      const url = `https://api.x.com/2/tweets/search/recent?${params.toString()}`

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${X_API_BEARER_TOKEN}`,
          },
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`[v0] X API error (batch ${batchIndex + 1}):`, errorText)
          if (response.status === 429) {
            console.log("[v0] Rate limited, stopping batch processing")
            break
          }
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
        continue
      }

      // Longer delay between batches (3 seconds)
      if (batchIndex < batchesToProcess.length - 1) {
        console.log(`[v0] Waiting ${BATCH_DELAY_MS}ms before next batch...`)
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
    const postsWithoutRelevance: Omit<ProcessedPost, "relevanceScore" | "relevanceMethod">[] = allTweets.map(
      (tweet) => {
        const user = userMap.get(tweet.author_id)
        const username = user?.username || "unknown"
        const handle = `@${username}`

        const member = handleToMember.get(username.toLowerCase())

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

        let quotedTweet: ProcessedPost["quotedTweet"] | undefined
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
          author: member?.name || user?.name || username,
          role: `Rep. (${member?.party?.charAt(0) || "?"}-${member?.state || "??"}-${member?.district || "?"})`,
          content: tweet.text,
          timestamp,
          createdAt: tweet.created_at,
          source: "X" as const,
          url: `https://x.com/${username}/status/${tweet.id}`,
          isVerified: user?.verified || user?.verified_type === "government" || !!member,
          profileImage: user?.profile_image_url?.replace("_normal", "_400x400"),
          metrics: {
            likes: tweet.public_metrics?.like_count || 0,
            retweets: tweet.public_metrics?.retweet_count || 0,
            replies: tweet.public_metrics?.reply_count || 0,
          },
          images: images.length > 0 ? images : undefined,
          quotedTweet,
          party: member?.party || "Unknown",
          state: member?.state || "??",
          district: member?.district || "?",
          fetchedAt: new Date().toISOString(),
        }
      },
    )

    // Score relevance
    let posts: ProcessedPost[]
    if (scoreRelevance && postsWithoutRelevance.length > 0) {
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

    // Sort by date
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Save to database
    try {
      const dbRecords: TweetRecord[] = posts.map((p) => ({
        id: p.id,
        feed_type: "house" as const,
        author: p.author,
        handle: p.handle.replace("@", ""),
        content: p.content,
        profile_image: p.profileImage,
        role: p.role,
        verified: p.isVerified,
        tweet_time: p.createdAt,
        link: p.url,
        images: p.images,
        metrics: p.metrics,
        quoted_tweet: p.quotedTweet,
        subgroups: [p.party],
        affiliation: p.party,
        relevance_score: p.relevanceScore,
        relevance_method: p.relevanceMethod,
      }))

      await upsertTweets(dbRecords)
      await updateFeedMetadata("house", newestId, lookbackHours)
      console.log("[v0] Saved", dbRecords.length, "House tweets to database")
    } catch (dbError) {
      console.error("[v0] Database save error:", dbError)
    }

    const relevantCount = posts.filter((p) => (p.relevanceScore || 0) >= RELEVANCE_THRESHOLD).length

    return Response.json({
      posts,
      fetchedAt: new Date().toISOString(),
      lookbackHours,
      accountsQueried: allHandles.length,
      newestId,
      source: "api",
      meta: {
        totalTweets: allTweets.length,
        batchesProcessed: batchesToProcess.length,
        relevantPosts: relevantCount,
        relevanceThreshold: RELEVANCE_THRESHOLD,
      },
    })
  } catch (error) {
    console.error("[v0] === House Feed API ERROR ===")
    console.error("[v0] Error:", error instanceof Error ? error.message : String(error))
    return Response.json({ error: "Failed to fetch feed", posts: [] }, { status: 500 })
  }
}

function dbToPost(record: TweetRecord): ProcessedPost {
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

  return {
    id: record.id,
    handle: `@${record.handle}`,
    author: record.author,
    role: record.role || "Representative",
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
    party: record.affiliation || "Unknown",
    state: "",
    district: "",
    fetchedAt: new Date().toISOString(),
    relevanceScore: record.relevance_score,
    relevanceMethod: record.relevance_method === "embedding" ? "semantic" : record.relevance_method,
  }
}
