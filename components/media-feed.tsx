"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  RefreshCw,
  ExternalLink,
  Trash2,
  Loader2,
  Users,
  Newspaper,
  MessageCircle,
  Repeat2,
  Heart,
  Bookmark,
  ChevronDown,
  Filter,
} from "lucide-react"
import { RELEVANCE_THRESHOLD } from "@/lib/semantic-relevance"

import { WebzMediaFeed } from "@/components/webz-media-feed"

// =============================================================================
// TYPES
// =============================================================================

type MainTab = "updated" | "influencers"
type InfluencerGroup = "All" | "MAGA" | "Democratic" | "Venezuelan"

interface InfluencerPost {
  id: string
  name: string
  handle: string
  avatar: string
  group: string
  verified: boolean
  content: string
  time: string
  images?: string[]
  likes: number
  retweets: number
  replies: number
  link: string
  relevanceScore?: number
  relevanceMethod?: "keyword" | "semantic" | "none"
}

// =============================================================================
// UTILITIES
// =============================================================================

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
  if (num >= 1000) return (num / 1000).toFixed(1) + "K"
  return num.toString()
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  return `${diffDays}d`
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

function getGroupColor(group: string): string {
  switch (group) {
    case "MAGA":
      return "text-red-400"
    case "Democratic":
      return "text-blue-400"
    case "Venezuelan":
      return "text-yellow-400"
    default:
      return "text-zinc-400"
  }
}

// =============================================================================
// AVATAR COMPONENT
// =============================================================================

function Avatar({ name, avatar, className = "" }: { name: string; avatar?: string; className?: string }) {
  const [imgError, setImgError] = useState(false)
  const initials = getInitials(name)

  if (avatar && !imgError) {
    return (
      <div className={`relative overflow-hidden bg-zinc-800 border border-white/20 ${className}`}>
        <Image
          src={avatar || "/placeholder.svg"}
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
      className={`flex items-center justify-center bg-zinc-800 border border-white/20 text-zinc-400 font-mono text-xs font-bold ${className}`}
    >
      {initials}
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function MediaFeed() {
  const [activeTab, setActiveTab] = useState<MainTab>("updated")

  // Influencers state
  const [posts, setPosts] = useState<InfluencerPost[]>([])
  const [influencerGroup, setInfluencerGroup] = useState<InfluencerGroup>("All")
  const [lookbackHours, setLookbackHours] = useState(2)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [showOnlyRelevant, setShowOnlyRelevant] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClearing, setIsClearing] = useState(false)

  // =============================================================================
  // DATA FETCHING
  // =============================================================================

  const fetchPosts = useCallback(
    async (isRefresh = false, hours = 2) => {
      if (isRefresh) {
        setIsRefreshing(true)
      } else if (hours > lookbackHours) {
        setIsLoadingMore(true)
      } else {
        setIsLoading(true)
      }
      setError(null)

      try {
        const response = await fetch("/api/influencer-feed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            group: influencerGroup,
            lookbackHours: hours,
            refresh: isRefresh,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to fetch feed")
        }

        const data = await response.json()

        if (data.posts && data.posts.length > 0) {
          setPosts(data.posts)
          setLastUpdated(new Date())
          setLookbackHours(hours)
        } else if (isRefresh) {
          setLastUpdated(new Date())
        }
      } catch (err) {
        console.error("[v0] Error fetching influencer posts:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch posts")
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
        setIsLoadingMore(false)
      }
    },
    [influencerGroup, lookbackHours],
  )

  const handleRefresh = () => fetchPosts(true, lookbackHours)

  const handleLoadMore = () => fetchPosts(false, lookbackHours + 2)

  const handleClearHistory = () => {
    if (!confirm("Clear all Influencer posts from database? This cannot be undone.")) {
      return
    }

    setIsClearing(true)
    setError(null)

    fetch("/api/influencer-feed", { method: "DELETE" })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to clear (${response.status})`)
        }

        setPosts([])
        setLastUpdated(null)
      })
      .catch((err) => {
        console.error("[v0] Error clearing Influencer posts:", err)
        setError(err instanceof Error ? err.message : "Failed to clear posts")
      })
      .finally(() => {
        setIsClearing(false)
      })
  }

  // =============================================================================
  // EFFECTS
  // =============================================================================

  useEffect(() => {
    if (activeTab === "influencers") {
      fetchPosts(false, lookbackHours)
    }
  }, [activeTab]) // eslint-disable-line react-hooks/exhaustive-deps

  // =============================================================================
  // FILTERED DATA
  // =============================================================================

  const filteredPosts = posts.filter((p) => {
    if (influencerGroup !== "All" && p.group !== influencerGroup) return false
    if (showOnlyRelevant) {
      return (
        (p.relevanceScore !== undefined && p.relevanceScore >= RELEVANCE_THRESHOLD) || p.relevanceMethod === "keyword"
      )
    }
    return true
  })

  const relevantPostCount = posts.filter(
    (p) =>
      (p.relevanceScore !== undefined && p.relevanceScore >= RELEVANCE_THRESHOLD) || p.relevanceMethod === "keyword",
  ).length

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "Never"
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const groupFilters: InfluencerGroup[] = ["All", "MAGA", "Democratic", "Venezuelan"]

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div className="space-y-6">
      <div className="relative bg-zinc-950/70 backdrop-blur-xl border border-white/10 p-6 overflow-hidden">
        {/* Top reflection */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        {/* Corner gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-[10px] font-mono text-zinc-500 tracking-[0.3em] uppercase mb-1">
                REAL-TIME MONITORING
              </p>
              <h1 className="text-2xl font-light tracking-tight text-white">Media & Influencers</h1>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="w-1.5 h-1.5 bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
              <span className="text-[10px] font-mono text-white tracking-wider">LIVE</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("updated")}
              className={`flex items-center gap-2 text-[10px] font-mono px-4 py-2 transition-all ${
                activeTab === "updated"
                  ? "bg-white text-black skew-x-[-6deg] shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                  : "text-zinc-500 hover:text-white bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:bg-white/10"
              }`}
            >
              <Newspaper className={`w-3 h-3 ${activeTab === "updated" ? "skew-x-[6deg]" : ""}`} />
              <span
                className={activeTab === "updated" ? "skew-x-[6deg] inline-block tracking-wider" : "tracking-wider"}
              >
                MEDIA OUTLETS
              </span>
            </button>
            <button
              onClick={() => setActiveTab("influencers")}
              className={`flex items-center gap-2 text-[10px] font-mono px-4 py-2 transition-all ${
                activeTab === "influencers"
                  ? "bg-white text-black skew-x-[-6deg] shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                  : "text-zinc-500 hover:text-white bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:bg-white/10"
              }`}
            >
              <Users className={`w-3 h-3 ${activeTab === "influencers" ? "skew-x-[6deg]" : ""}`} />
              <span
                className={activeTab === "influencers" ? "skew-x-[6deg] inline-block tracking-wider" : "tracking-wider"}
              >
                INFLUENCERS
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* UPDATED MEDIA TAB */}
      {activeTab === "updated" && (
        <div className="mt-6">
          <WebzMediaFeed />
        </div>
      )}

      {/* INFLUENCERS TAB */}
      {activeTab === "influencers" && (
        <div className="space-y-6">
          <div className="relative bg-zinc-950/50 backdrop-blur-xl border border-white/10 p-4 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-sm font-mono text-white tracking-wider">INFLUENCER X FEED</h2>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-zinc-600">
                    {formatLastUpdated(lastUpdated)} · {lookbackHours}H
                  </span>
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-3 py-1.5 bg-white/5 backdrop-blur-sm hover:bg-white/10 disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                    REFRESH
                  </button>
                  <button
                    onClick={handleClearHistory}
                    disabled={isClearing}
                    className="flex items-center gap-2 text-[10px] font-mono text-zinc-600 hover:text-red-400 transition-colors border border-white/10 hover:border-red-400/50 px-2 py-1.5 bg-white/5 backdrop-blur-sm disabled:opacity-50"
                    title="Clear all Influencer posts from database"
                  >
                    <Trash2 className={`h-3 w-3 ${isClearing ? "animate-pulse" : ""}`} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {groupFilters.map((group) => (
                  <button
                    key={group}
                    onClick={() => setInfluencerGroup(group)}
                    className={`text-[10px] font-mono px-3 py-1.5 transition-all whitespace-nowrap ${
                      influencerGroup === group
                        ? "bg-white text-black skew-x-[-6deg] shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                        : "text-zinc-500 hover:text-white bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:bg-white/10"
                    }`}
                  >
                    <span
                      className={
                        influencerGroup === group ? "skew-x-[6deg] inline-block tracking-wider" : "tracking-wider"
                      }
                    >
                      {group.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <button
                  onClick={() => setShowOnlyRelevant(!showOnlyRelevant)}
                  className={`flex items-center gap-2 text-[10px] font-mono transition-all px-3 py-1.5 ${
                    showOnlyRelevant
                      ? "bg-white text-black skew-x-[-6deg] shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                      : "text-zinc-500 border border-white/10 hover:border-white/30 bg-white/5 backdrop-blur-sm hover:text-white"
                  }`}
                >
                  <Filter className="h-3 w-3" />
                  <span className={showOnlyRelevant ? "skew-x-[6deg] inline-block" : ""}>VENEZUELA FILTER</span>
                  {relevantPostCount > 0 && (
                    <span className={`ml-1 px-1.5 py-0.5 ${showOnlyRelevant ? "bg-black/20" : "bg-white/20"}`}>
                      {relevantPostCount}
                    </span>
                  )}
                </button>
                <span className="text-[10px] font-mono text-zinc-600">
                  SHOWING <span className="text-white">{filteredPosts.length}</span> OF {posts.length}
                </span>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1 h-4 bg-white skew-x-[-12deg] animate-pulse"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
              <span className="text-zinc-500 font-mono text-[10px] tracking-wider">LOADING INFLUENCER POSTS...</span>
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
                <div
                  key={post.id}
                  className="group py-4 border-l-2 border-zinc-800 pl-4 hover:bg-white/5 hover:border-white transition-all cursor-pointer"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("a")) return
                    window.open(post.link, "_blank", "noopener,noreferrer")
                  }}
                >
                  <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <Avatar name={post.name} avatar={post.avatar} className="w-10 h-10 rounded-none" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Author Info */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-white text-xs tracking-wide">{post.name}</span>
                        {post.verified && (
                          <svg className="w-3 h-3 text-white/60" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                          </svg>
                        )}
                        <span className="text-zinc-600 text-[10px] font-mono">@{post.handle}</span>
                        <span className="text-zinc-700">·</span>
                        <span className="text-zinc-600 text-[10px] font-mono">{formatTimeAgo(post.time)}</span>
                        <span className="text-zinc-700">·</span>
                        <span className={`text-[10px] font-mono uppercase tracking-wider ${getGroupColor(post.group)}`}>
                          {post.group}
                        </span>
                      </div>

                      {/* Post Content */}
                      <p className="text-zinc-400 text-xs leading-relaxed whitespace-pre-wrap">{post.content}</p>

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
                              className="relative aspect-[16/9] max-h-32 bg-zinc-900 overflow-hidden border border-white/10 hover:border-white/30 transition-colors"
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
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-600">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {formatNumber(post.replies)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Repeat2 className="h-3 w-3" />
                            {formatNumber(post.retweets)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {formatNumber(post.likes)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bookmark className="h-3 w-3" />
                          </span>
                        </div>

                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-[10px] font-mono text-zinc-600 hover:text-white transition-colors"
                        >
                          VIEW ON X
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* See More Button */}
          {!isLoading && filteredPosts.length > 0 && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-6 py-2 bg-white/5 backdrop-blur-sm hover:bg-white/10 disabled:opacity-50 tracking-wider"
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
              <p className="text-zinc-600 font-mono text-[10px] tracking-wider">
                {showOnlyRelevant ? "NO VENEZUELA-RELEVANT INFLUENCER POSTS FOUND" : "NO INFLUENCER POSTS FOUND"}
              </p>
              <button
                onClick={() => (showOnlyRelevant ? setShowOnlyRelevant(false) : fetchPosts(true))}
                className="text-[10px] font-mono text-white hover:text-zinc-300 transition-colors tracking-wider"
              >
                {showOnlyRelevant ? "SHOW ALL POSTS →" : "FETCH LATEST →"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
