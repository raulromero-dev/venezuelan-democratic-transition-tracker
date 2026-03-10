import { NextResponse } from "next/server"
import { getAllOsintHandles, getOsintAccountInfo } from "@/lib/osint-accounts"
import { scoreTweetsRelevance, RELEVANCE_THRESHOLD } from "@/lib/semantic-relevance"
import { getTweets, upsertTweets, updateFeedMetadata, deleteTweetsByFeedType, type TweetRecord } from "@/lib/db/tweets"

export const maxDuration = 60

const X_BEARER_TOKEN = process.env.X_API_BEARER_TOKEN

const BATCH_SIZE = 10 // 10 handles per batch
const BATCH_DELAY_MS = 3000 // 3 seconds between batches
const DEFAULT_LOOKBACK_HOURS = 2 // Default to 2 hours

interface XTweet {
  id: string
  text: string
  created_at: string
  author_id: string
  public_metrics?: {
    like_count: number
    retweet_count: number
    reply_count: number
    quote_count: number
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
  username: string
  name: string
  profile_image_url?: string
  verified?: boolean
}

interface XMedia {
  media_key: string
  type: "photo" | "video" | "animated_gif"
  url?: string
  preview_image_url?: string
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lookbackHours = Number.parseInt(searchParams.get("lookbackHours") || "2")
    const sinceId = searchParams.get("sinceId") || undefined
    const refresh = searchParams.get("refresh") === "true"

    console.log("[v0] OSINT Feed request - lookbackHours:", lookbackHours, "sinceId:", sinceId, "refresh:", refresh)

    // If not refreshing, try to get from database first
    if (!refresh) {
      try {
        const dbPosts = await getTweets("osint", { lookbackHours, limit: 200 })
        if (dbPosts.length > 0) {
          console.log("[v0] Returning", dbPosts.length, "OSINT posts from database")
          const posts = dbPosts.map(dbToPost)
          const relevantCount = posts.filter(
            (p) => p.relevanceMethod === "keyword" || (p.relevanceScore && p.relevanceScore >= RELEVANCE_THRESHOLD),
          ).length
          return NextResponse.json({
            posts,
            newestId: dbPosts[0]?.id,
            relevantPosts: relevantCount,
            totalPosts: posts.length,
            source: "database",
          })
        }
      } catch (dbError) {
        console.error("[v0] Database read error:", dbError)
      }
    }

    // Fetch fresh from X API
    if (!X_BEARER_TOKEN) {
      console.error("[v0] X_API_BEARER_TOKEN not configured")
      return NextResponse.json({ error: "X API not configured", posts: [] }, { status: 500 })
    }

    const allHandles = getAllOsintHandles()
    console.log("[v0] Total OSINT handles:", allHandles.length)

    const allTweets: XTweet[] = []
    const allUsers: Map<string, XUser> = new Map()
    const allMedia: Map<string, XMedia> = new Map()
    let newestId: string | undefined

    const startTime = new Date(Date.now() - lookbackHours * 60 * 60 * 1000).toISOString()

    const handleBatches: string[][] = []
    for (let i = 0; i < allHandles.length; i += BATCH_SIZE) {
      handleBatches.push(allHandles.slice(i, i + BATCH_SIZE))
    }
    const batchesToProcess = handleBatches
    console.log("[v0] Processing", batchesToProcess.length, "batches of", BATCH_SIZE, "handles each")

    for (let batchIndex = 0; batchIndex < batchesToProcess.length; batchIndex++) {
      const batchHandles = batchesToProcess[batchIndex]
      const query = batchHandles.map((h) => `from:${h}`).join(" OR ")
      const batchNum = batchIndex + 1

      console.log("[v0] OSINT batch", batchNum, "- handles:", batchHandles.length)

      const params = new URLSearchParams({
        query,
        max_results: "50",
        "tweet.fields": "created_at,public_metrics,attachments,referenced_tweets,author_id",
        "user.fields": "username,name,profile_image_url,verified",
        "media.fields": "url,preview_image_url,type",
        expansions: "author_id,attachments.media_keys,referenced_tweets.id",
        start_time: startTime,
      })

      try {
        const response = await fetch(`https://api.x.com/2/tweets/search/recent?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${X_BEARER_TOKEN}`,
          },
        })

        if (response.status === 429) {
          console.log(`[v0] OSINT batch ${batchNum} rate limited, stopping`)
          break
        }

        if (!response.ok) {
          const errorText = await response.text()
          console.error("[v0] X API error:", response.status, errorText)
          continue
        }

        const data = await response.json()

        if (data.data) {
          allTweets.push(...data.data)
          console.log(`[v0] OSINT batch ${batchNum} fetched ${data.data.length} tweets`)
        }

        if (data.includes?.users) {
          for (const user of data.includes.users) {
            allUsers.set(user.id, user)
          }
        }

        if (data.includes?.media) {
          for (const media of data.includes.media) {
            allMedia.set(media.media_key, media)
          }
        }

        if (data.meta?.newest_id) {
          if (!newestId || data.meta.newest_id > newestId) {
            newestId = data.meta.newest_id
          }
        }
      } catch (error) {
        console.error(`[v0] OSINT batch ${batchNum} error:`, error)
      }

      if (batchIndex < batchesToProcess.length - 1) {
        console.log(`[v0] Waiting ${BATCH_DELAY_MS}ms before next batch...`)
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS))
      }
    }

    console.log("[v0] Total OSINT tweets fetched:", allTweets.length)

    const postsWithoutRelevance = allTweets.map((tweet) => {
      const user = allUsers.get(tweet.author_id)
      const accountInfo = user ? getOsintAccountInfo(user.username) : undefined

      const images: string[] = []
      if (tweet.attachments?.media_keys) {
        for (const key of tweet.attachments.media_keys) {
          const media = allMedia.get(key)
          if (media) {
            const url = media.url || media.preview_image_url
            if (url) images.push(url)
          }
        }
      }

      const category = accountInfo?.category || "Individual Analysts"

      return {
        id: tweet.id,
        type: "tweet" as const,
        author: user?.name || "Unknown",
        handle: user?.username || "",
        avatar: user?.profile_image_url?.replace("_normal", "_bigger") || "",
        role: accountInfo?.description || category,
        category,
        verified: user?.verified || false,
        time: tweet.created_at,
        content: tweet.text,
        images,
        link: user ? `https://x.com/${user.username}/status/${tweet.id}` : "",
        metrics: {
          likes: tweet.public_metrics?.like_count || 0,
          retweets: tweet.public_metrics?.retweet_count || 0,
          replies: tweet.public_metrics?.reply_count || 0,
        },
      }
    })

    console.log("[v0] Scoring relevance for", postsWithoutRelevance.length, "OSINT posts (keyword + embeddings)...")
    const scoredPosts = await scoreTweetsRelevance(postsWithoutRelevance.map((p) => ({ id: p.id, text: p.content })))
    const scoreMap = new Map(scoredPosts.map((p) => [p.id, { score: p.relevanceScore, method: p.relevanceMethod }]))

    const posts = postsWithoutRelevance.map((p) => {
      const scoreInfo = scoreMap.get(p.id)
      return {
        ...p,
        relevanceScore: scoreInfo?.score ?? 0,
        relevanceMethod: scoreInfo?.method === "none" ? undefined : scoreInfo?.method,
      }
    })

    posts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    try {
      const dbRecords: TweetRecord[] = posts.map((p) => ({
        id: p.id,
        feed_type: "osint" as const,
        author: p.author,
        handle: p.handle,
        content: p.content,
        avatar: p.avatar,
        role: p.role,
        category: p.category,
        verified: p.verified,
        tweet_time: p.time,
        link: p.link,
        images: p.images,
        metrics: p.metrics,
        relevance_score: p.relevanceScore,
        relevance_method: p.relevanceMethod,
      }))

      await upsertTweets(dbRecords)
      await updateFeedMetadata("osint", newestId, lookbackHours)
      console.log("[v0] Saved", dbRecords.length, "OSINT tweets to database")
    } catch (dbError) {
      console.error("[v0] Database save error:", dbError)
      // Continue - still return posts even if save fails
    }

    const relevantCount = posts.filter(
      (p) => p.relevanceMethod === "keyword" || (p.relevanceScore && p.relevanceScore >= RELEVANCE_THRESHOLD),
    ).length

    console.log("[v0] OSINT posts processed:", posts.length, "relevant:", relevantCount)

    return NextResponse.json({
      posts,
      newestId,
      relevantPosts: relevantCount,
      totalPosts: posts.length,
      source: "api",
    })
  } catch (error) {
    console.error("[v0] OSINT Feed critical error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch OSINT feed",
        posts: [],
        relevantPosts: 0,
        totalPosts: 0,
        source: "error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE() {
  try {
    console.log("[v0] DELETE /api/osint-feed - Clearing OSINT posts from database")

    const deletedCount = await deleteTweetsByFeedType("osint")

    console.log("[v0] Successfully deleted", deletedCount, "OSINT posts from database")

    return NextResponse.json({
      success: true,
      deletedCount,
      message: `Cleared ${deletedCount} OSINT posts from database`,
    })
  } catch (error) {
    console.error("[v0] Error clearing OSINT posts:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

function dbToPost(record: TweetRecord) {
  return {
    id: record.id,
    type: "tweet" as const,
    author: record.author,
    handle: record.handle,
    avatar: record.avatar || "",
    role: record.role || "",
    category: record.category || "Individual Analysts",
    verified: record.verified,
    time: record.tweet_time,
    content: record.content,
    images: record.images || [],
    link: record.link,
    metrics: record.metrics,
    relevanceScore: record.relevance_score,
    relevanceMethod: record.relevance_method,
  }
}
