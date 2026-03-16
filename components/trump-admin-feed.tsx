"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  ExternalLink,
  Heart,
  Repeat2,
  MessageCircle,
  RefreshCw,
  Trash2,
  Loader2,
  ChevronDown,
  Quote,
  Filter,
} from "lucide-react"
import { RELEVANCE_THRESHOLD } from "@/lib/semantic-relevance"

interface Post {
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
  affiliation: string
  fetchedAt: string
  relevanceScore?: number
  relevanceMethod?: "keyword" | "semantic"
}

const DEFAULT_LOOKBACK_HOURS = 2

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return num.toString()
}

function getInitials(name: string): string {
  const words = name.split(" ").filter(Boolean)
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

function Avatar({ name, profileImage, className = "" }: { name: string; profileImage?: string; className?: string }) {
  const [imgError, setImgError] = useState(false)
  const initials = getInitials(name)

  if (profileImage && !imgError) {
    return (
      <div className={`relative overflow-hidden bg-zinc-200 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 ${className}`}>
        <Image
          src={profileImage || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-center bg-zinc-200 border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-mono text-xs font-bold ${className}`}
    >
      {initials}
    </div>
  )
}

export function TrumpAdminFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lookbackHours, setLookbackHours] = useState(DEFAULT_LOOKBACK_HOURS)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [showOnlyRelevant, setShowOnlyRelevant] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPosts = useCallback(
    async (isRefresh = false, hours = DEFAULT_LOOKBACK_HOURS) => {
      if (isRefresh) {
        setIsRefreshing(true)
      } else if (hours > lookbackHours) {
        setIsLoadingMore(true)
      } else {
        setIsLoading(true)
      }
      setError(null)

      try {
        const requestBody: Record<string, unknown> = {
          lookbackHours: hours,
          scoreRelevance: true,
          refresh: isRefresh,
        }

        console.log("[v0] Fetching US Officials feed:", JSON.stringify(requestBody))

        const response = await fetch("/api/us-officials-feed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to fetch feed")
        }

        const data = await response.json()
        console.log("[v0] Received US Officials posts:", data.posts?.length || 0, "source:", data.source)

        if (data.posts && data.posts.length > 0) {
          setPosts(data.posts)
          setLastUpdated(new Date())
          setLookbackHours(hours)
        } else if (isRefresh) {
          setLastUpdated(new Date())
        }
      } catch (err) {
        console.error("[v0] US Officials feed fetch error:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch latest posts. Please try again.")
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
        setIsLoadingMore(false)
      }
    },
    [lookbackHours],
  )

  const handleRefresh = () => fetchPosts(true, lookbackHours)

  const handleLoadMore = () => fetchPosts(false, lookbackHours + 2)

  const handleClearHistory = () => {
    if (confirm("Clear local view? (Database data will persist)")) {
      setPosts([])
      setLastUpdated(null)
      setLookbackHours(DEFAULT_LOOKBACK_HOURS)
    }
  }

  const filteredPosts = posts.filter((p) => {
    const matchesRelevance =
      !showOnlyRelevant || (p.relevanceScore !== undefined && p.relevanceScore >= RELEVANCE_THRESHOLD)
    return matchesRelevance
  })

  const relevantPostCount = posts.filter(
    (p) => p.relevanceScore !== undefined && p.relevanceScore >= RELEVANCE_THRESHOLD,
  ).length

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "Never"
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  return (
    <div className="space-y-6">
      <div className="relative bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl border border-black/[0.06] dark:border-white/10 p-6 overflow-hidden rounded-2xl">
        {/* Top reflection */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent dark:via-white/20 via-black/[0.06] to-transparent" />
        {/* Corner gradient */}
        <div className="absolute inset-0 bg-gradient-to-br dark:from-white/5 from-black/[0.02] via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-[10px] font-mono text-zinc-500 tracking-[0.3em] uppercase mb-1">EXECUTIVE BRANCH</p>
              <h2 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-white">Executive Branch X Feed</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-600">
                {formatLastUpdated(lastUpdated)} · {lookbackHours}h
              </span>
              {/* Glass buttons */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors border border-black/[0.06] dark:border-white/10 hover:border-black/20 dark:hover:border-white/30 px-3 py-1.5 bg-black/[0.03] dark:bg-white/5 backdrop-blur-sm hover:bg-black/[0.05] dark:hover:bg-white/10 disabled:opacity-50 rounded-full"
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                REFRESH
              </button>
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 dark:text-zinc-600 hover:text-red-500 dark:hover:text-red-400 transition-colors border border-black/[0.06] dark:border-white/10 hover:border-red-400/50 px-2 py-1.5 bg-black/[0.03] dark:bg-white/5 backdrop-blur-sm rounded-full"
                title="Clear local view"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Filter row */}
          <div className="flex items-center justify-between pt-2 border-t border-black/[0.06] dark:border-white/10">
            <button
              onClick={() => setShowOnlyRelevant(!showOnlyRelevant)}
              className={`flex items-center gap-2 text-[10px] font-mono transition-all px-3 py-1.5 rounded-full ${
                showOnlyRelevant
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-black skew-x-[-6deg] dark:shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                  : "text-zinc-500 border border-black/[0.06] dark:border-white/10 hover:border-black/20 dark:hover:border-white/30 bg-black/[0.03] dark:bg-white/5 backdrop-blur-sm hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Filter className="h-3 w-3" />
              <span className={showOnlyRelevant ? "skew-x-[6deg] inline-block" : ""}>VENEZUELA FILTER ACTIVE</span>
              {relevantPostCount > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 ${showOnlyRelevant ? "bg-white/20 dark:bg-black/20" : "bg-white/20"}`}>
                  {relevantPostCount}
                </span>
              )}
            </button>
            <span className="text-[10px] font-mono text-zinc-600">
              SHOWING <span className="text-zinc-900 dark:text-white">{filteredPosts.length}</span> OF {posts.length}
            </span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {(isLoading || isRefreshing) && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          {/* Hexagon Spinner */}
          <div className="relative w-8 h-8">
            {/* Outer ring */}
            <div
              className="absolute inset-0 border border-black/10 dark:border-white/20"
              style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
            />
            {/* Middle spinning ring */}
            <div
              className="absolute inset-1 border border-black/20 dark:border-white/40 animate-spin"
              style={{
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                animationDuration: "2s",
              }}
            />
            {/* Inner pulsing core */}
            <div
              className="absolute inset-2 bg-black/10 dark:bg-white/20 animate-pulse"
              style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
            />
          </div>
          <span className="text-zinc-500 font-mono text-[10px] tracking-wider">LOADING EXECUTIVE BRANCH POSTS...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-[10px] font-mono tracking-wider">
          {error}
        </div>
      )}

      {/* Feed Items */}
      {!isLoading && filteredPosts.length > 0 && (
        <div className="space-y-0">
          {filteredPosts.map((post) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block py-4 px-3 transition-all cursor-pointer border-l-2 border-zinc-200 dark:border-zinc-800 pl-4 hover:bg-black/[0.03] dark:hover:bg-white/5 hover:border-zinc-900 dark:hover:border-white rounded-lg"
            >
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Avatar
                    name={post.author}
                    profileImage={post.profileImage}
                    className="w-10 h-10 rounded-full border border-white/20"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Author Info */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-zinc-900 dark:text-white text-xs" style={{ fontFamily: "'Google Sans', sans-serif" }}>{post.author}</span>
                    {post.isVerified && (
                      <svg className="w-3 h-3 text-zinc-500 dark:text-white/60" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                      </svg>
                    )}
                    <span className="text-zinc-500 dark:text-zinc-600 text-[10px]" style={{ fontFamily: "'Google Sans', sans-serif" }}>{post.handle}</span>
                    <span className="text-zinc-400 dark:text-zinc-700">·</span>
                    <span className="text-zinc-500 dark:text-zinc-600 text-[10px]" style={{ fontFamily: "'Google Sans', sans-serif" }}>{post.timestamp}</span>
                    <span className="text-zinc-400 dark:text-zinc-700">·</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {post.role}
                    </span>
                  </div>

                  {/* Post Content */}
                  <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed whitespace-pre-wrap">{post.content}</p>

                  {/* Images */}
                  {post.images && post.images.length > 0 && (
                    <div
                      className={`grid gap-1.5 mt-2 ${post.images.length === 1 ? "grid-cols-1 max-w-xs" : "grid-cols-2 max-w-md"}`}
                    >
                      {post.images.slice(0, 4).map((img, idx) => (
                        <a
                          key={idx}
                          href={img}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="relative aspect-[16/9] max-h-32 bg-zinc-100 dark:bg-zinc-900 overflow-hidden border border-black/[0.06] dark:border-white/10 hover:border-black/20 dark:hover:border-white/30 transition-colors rounded-lg"
                        >
                          <Image
                            src={img || "/placeholder.svg"}
                            alt={`Media ${idx + 1}`}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).style.display = "none"
                            }}
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Quoted Tweet */}
                  {post.quotedTweet && (
                    <div className="mt-2 p-3 border border-black/[0.06] dark:border-white/10 bg-black/[0.03] dark:bg-white/5 backdrop-blur-sm rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Quote className="h-3 w-3 text-zinc-400 dark:text-zinc-600" />
                        <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400">{post.quotedTweet.author}</span>
                        <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-600">{post.quotedTweet.handle}</span>
                      </div>
                      <p className="text-[10px] text-zinc-500">{post.quotedTweet.content}</p>
                    </div>
                  )}

                  {/* Metrics Row */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 dark:text-zinc-600">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {formatNumber(post.metrics.replies)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Repeat2 className="h-3 w-3" />
                        {formatNumber(post.metrics.retweets)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {formatNumber(post.metrics.likes)}
                      </span>
                    </div>

                    <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                      VIEW ON X
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* See More Button */}
      {!isLoading && filteredPosts.length > 0 && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors border border-black/[0.06] dark:border-white/10 hover:border-black/20 dark:hover:border-white/30 px-6 py-2 bg-black/[0.03] dark:bg-white/5 backdrop-blur-sm hover:bg-black/[0.05] dark:hover:bg-white/10 disabled:opacity-50 tracking-wider rounded-full"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                LOADING...
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" />
                EXPAND TO {lookbackHours + 2}H
              </>
            )}
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredPosts.length === 0 && !error && (
        <div className="text-center py-20 space-y-4">
          <p className="text-zinc-500 dark:text-zinc-600 font-mono text-[10px] tracking-wider">
            {showOnlyRelevant ? "NO VENEZUELA-RELEVANT EXECUTIVE POSTS FOUND" : "NO EXECUTIVE POSTS FOUND"}
          </p>
          <button
            onClick={() => (showOnlyRelevant ? setShowOnlyRelevant(false) : fetchPosts(true))}
            className="text-[10px] font-mono text-zinc-900 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors tracking-wider"
          >
            {showOnlyRelevant ? "SHOW ALL POSTS →" : "FETCH LATEST →"}
          </button>
        </div>
      )}
    </div>
  )
}
