"use client"

import { useState, useEffect, useCallback } from "react"
import {
  ExternalLink,
  ChevronDown,
  Heart,
  Repeat2,
  MessageCircle,
  Bookmark,
  RefreshCw,
  Trash2,
  Filter,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"
import { RELEVANCE_THRESHOLD } from "@/lib/semantic-relevance"

interface Post {
  id: string
  type: "tweet"
  author: string
  handle: string
  avatar: string
  role: string
  category: string
  verified: boolean
  time: string
  content: string
  images?: string[]
  link: string
  metrics: {
    likes: number
    retweets: number
    replies: number
  }
  relevanceScore?: number
  relevanceMethod?: "keyword" | "embedding" | "semantic"
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

function Avatar({ src, name, className = "" }: { src?: string; name: string; className?: string }) {
  const [imageError, setImageError] = useState(false)
  const initials = getInitials(name)

  if (!src || imageError) {
    return (
      <div
        className={`flex items-center justify-center bg-zinc-800 border border-zinc-700 text-zinc-400 font-mono text-xs font-bold ${className}`}
      >
        {initials}
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden bg-zinc-800 border border-zinc-700 ${className}`}>
      <Image
        src={src || "/placeholder.svg"}
        alt={name}
        fill
        className="object-cover"
        onError={() => setImageError(true)}
        unoptimized
      />
    </div>
  )
}

export function OsintFeedX() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lookbackHours, setLookbackHours] = useState(DEFAULT_LOOKBACK_HOURS)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [showOnlyRelevant, setShowOnlyRelevant] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

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
        const params = new URLSearchParams({
          lookbackHours: hours.toString(),
        })

        if (isRefresh) {
          params.set("refresh", "true")
        }

        console.log("[v0] Fetching OSINT feed:", params.toString())

        const response = await fetch(`/api/osint-feed?${params.toString()}`)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error("[v0] OSINT API error:", response.status, errorData)
          throw new Error(errorData.error || `Failed to fetch feed (${response.status})`)
        }

        const data = await response.json()
        console.log("[v0] Received OSINT posts:", data.posts?.length || 0, "source:", data.source)

        if (data.posts && data.posts.length > 0) {
          setPosts(data.posts)
          setLastUpdated(new Date())
          setLookbackHours(hours)
        } else if (isRefresh) {
          setLastUpdated(new Date())
        }
      } catch (err) {
        console.error("[v0] OSINT feed fetch error:", err)
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

  const handleClearHistory = async () => {
    if (!confirm("Clear all OSINT posts from database? This cannot be undone.")) {
      return
    }

    setIsClearing(true)
    try {
      console.log("[v0] Clearing OSINT posts from database...")
      const response = await fetch("/api/osint-feed", { method: "DELETE" })
      const data = await response.json()

      if (response.ok) {
        console.log("[v0] OSINT clear response:", data)
        setPosts([])
        setLastUpdated(null)
        setError(null)
      } else {
        console.error("[v0] Failed to clear OSINT posts:", data.error)
        setError(`Failed to clear: ${data.error}`)
      }
    } catch (err) {
      console.error("[v0] Error clearing OSINT posts:", err)
      setError("Failed to clear posts")
    } finally {
      setIsClearing(false)
    }
  }

  const filteredPosts = posts.filter((p) => {
    const matchesRelevance =
      !showOnlyRelevant ||
      p.relevanceMethod === "keyword" ||
      (p.relevanceScore !== undefined && p.relevanceScore >= RELEVANCE_THRESHOLD)
    return matchesRelevance
  })

  const relevantPostCount = posts.filter(
    (p) =>
      p.relevanceMethod === "keyword" || (p.relevanceScore !== undefined && p.relevanceScore >= RELEVANCE_THRESHOLD),
  ).length

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "Never"
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header - Glassmorphic */}
      <div className="relative bg-zinc-950/70 backdrop-blur-xl border border-white/10 p-4 flex-shrink-0">
        {/* Top reflection line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Corner gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase block mb-1">
              OSINT INTELLIGENCE
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">Open Source Intel</h2>
            <p className="text-[11px] text-zinc-500 mt-1">Monitoring think tanks, analysts, and government sources</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-600">
              {formatLastUpdated(lastUpdated)} · {lookbackHours}H
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono tracking-wider uppercase transition-all border ${
                isRefreshing
                  ? "bg-white/10 text-white border-white/20"
                  : "bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-white"
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
              REFRESH
            </button>
            <button
              onClick={handleClearHistory}
              disabled={isClearing}
              className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors border border-zinc-800 hover:border-red-400/50"
              title="Clear OSINT posts from database"
            >
              <Trash2 className={`w-3.5 h-3.5 ${isClearing ? "animate-pulse" : ""}`} />
            </button>
          </div>
        </div>

        {/* Venezuela Filter Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowOnlyRelevant(!showOnlyRelevant)}
            className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono tracking-wider uppercase transition-all border ${
              showOnlyRelevant
                ? "text-emerald-400 border-emerald-400/50 bg-emerald-400/10 skew-x-[-6deg] shadow-[0_0_12px_rgba(52,211,153,0.2)]"
                : "text-zinc-500 border-zinc-800 hover:border-zinc-600 bg-transparent hover:text-white"
            }`}
          >
            <Filter className="w-3 h-3" />
            VENEZUELA FILTER
            {relevantPostCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-zinc-800 text-zinc-400 text-[9px]">{relevantPostCount}</span>
            )}
          </button>
          <span className="text-[10px] font-mono text-zinc-600">
            {filteredPosts.length} OF {posts.length} POSTS
          </span>
        </div>
      </div>

      {/* Loading State */}
      {(isLoading || isRefreshing) && posts.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            {/* Hexagon Spinner */}
            <div className="relative w-8 h-8">
              {/* Outer ring */}
              <div
                className="absolute inset-0 border border-white/20"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
              />
              {/* Middle spinning ring */}
              <div
                className="absolute inset-1 border border-white/40 animate-spin"
                style={{
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  animationDuration: "2s",
                }}
              />
              {/* Inner pulsing core */}
              <div
                className="absolute inset-2 bg-white/20 animate-pulse"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
              />
            </div>
            <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
              Loading OSINT Intelligence...
            </span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="m-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-[11px] font-mono flex items-center gap-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button
            onClick={handleRefresh}
            className="ml-auto text-red-300 hover:text-red-200 underline uppercase tracking-wider"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Feed Items */}
      {!isLoading && filteredPosts.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-0">
            {filteredPosts.map((post) => {
              return (
                <a
                  key={post.id}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block py-4 px-4 transition-all cursor-pointer border-l-2 border-l-zinc-800 hover:border-l-white hover:bg-white/5"
                >
                  <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <Avatar src={post.avatar} name={post.author} className="w-12 h-12 rounded-none" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Author Info */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">{post.author}</span>
                        {post.verified && (
                          <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                          </svg>
                        )}
                        <span className="text-zinc-500 text-[10px] font-mono">@{post.handle}</span>
                        <span className="text-zinc-700">·</span>
                        <span className="text-zinc-500 text-[10px] font-mono">
                          {new Date(post.time).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      {/* Post Content */}
                      <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>

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
                              className="relative aspect-[16/9] max-h-32 bg-zinc-800 overflow-hidden border border-zinc-700 hover:border-zinc-500 transition-colors"
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

                      {/* Metrics Row */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-5">
                          <span className="flex items-center gap-1.5 text-zinc-600 text-[10px] font-mono">
                            <MessageCircle className="w-3.5 h-3.5" />
                            {formatNumber(post.metrics.replies)}
                          </span>
                          <span className="flex items-center gap-1.5 text-zinc-600 text-[10px] font-mono">
                            <Repeat2 className="w-3.5 h-3.5" />
                            {formatNumber(post.metrics.retweets)}
                          </span>
                          <span className="flex items-center gap-1.5 text-zinc-600 text-[10px] font-mono">
                            <Heart className="w-3.5 h-3.5" />
                            {formatNumber(post.metrics.likes)}
                          </span>
                          <span className="flex items-center gap-1.5 text-zinc-600 text-[10px] font-mono">
                            <Bookmark className="w-3.5 h-3.5" />
                          </span>
                        </div>

                        <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-zinc-500 group-hover:text-white transition-colors uppercase">
                          VIEW ON X
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      )}

      {/* See More Button */}
      {!isLoading && filteredPosts.length > 0 && (
        <div className="flex-shrink-0 p-4 border-t border-zinc-800/50">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-[10px] font-mono tracking-wider uppercase text-zinc-500 hover:text-white transition-all border border-zinc-800 hover:border-zinc-600 bg-transparent hover:bg-white/5 disabled:opacity-50"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                LOADING...
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                SEE MORE ({lookbackHours + 2}H LOOKBACK)
              </>
            )}
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredPosts.length === 0 && !error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase mb-4">
              {showOnlyRelevant ? "NO VENEZUELA-RELEVANT POSTS FOUND" : "NO OSINT POSTS AVAILABLE"}
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 text-[10px] font-mono tracking-wider uppercase text-zinc-400 border border-zinc-700 hover:border-zinc-600 hover:text-white transition-all"
            >
              FETCH LATEST
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
