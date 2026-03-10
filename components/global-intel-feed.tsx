"use client"

import { useState, useEffect, useCallback } from "react"
import { ExternalLink, ChevronDown, RefreshCw, Globe2, Clock, Twitter, FileText } from "lucide-react"
import Image from "next/image"
import { getCountriesByRegion } from "@/lib/rss/government-sources"

// =============================================================================
// TYPES
// =============================================================================

interface GlobalStatement {
  id: string
  title: string
  content: string
  url: string
  publishedAt: string
  country: string
  countryCode: string
  flag: string
  region: string
  source: string
  sourceType: "rss" | "x"
  author?: string
  role?: string
  handle?: string
  profileImage?: string
  isVerified?: boolean
  metrics?: { likes: number; retweets: number; replies: number }
  images?: string[]
  quotedTweet?: { author: string; handle: string; content: string }
  relevanceScore?: number
  relevanceMethod?: "keyword" | "semantic"
}

type Region =
  | "All"
  | "North America"
  | "South America"
  | "Central America"
  | "Caribbean"
  | "Europe"
  | "Asia"
  | "Oceania"
  | "Africa"

// =============================================================================
// CONSTANTS
// =============================================================================

const HOUR_OPTIONS = [24, 48, 72, 168, 336]

// =============================================================================
// HELPERS
// =============================================================================

function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) return "< 1h ago"
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return "1 day ago"
  return `${diffDays} days ago`
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// =============================================================================
// COMPONENT
// =============================================================================

export function GlobalIntelFeed() {
  const [statements, setStatements] = useState<GlobalStatement[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  // const [sourceCounts, setSourceCounts] = useState<{ rss: number; x: number }>({ rss: 0, x: 0 })

  // Filters
  const [activeRegion, setActiveRegion] = useState<Region>("All")
  const [selectedCountry, setSelectedCountry] = useState<string>("All")
  const [hoursBack, setHoursBack] = useState(72)

  // Dropdown states
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [showHoursDropdown, setShowHoursDropdown] = useState(false)

  // Get countries for current region
  const availableCountries = activeRegion === "All" ? [] : getCountriesByRegion(activeRegion as Exclude<Region, "All">)

  const fetchStatements = useCallback(
    async (refresh = false) => {
      if (refresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      try {
        const params = new URLSearchParams({
          region: activeRegion,
          country: selectedCountry,
          hours: hoursBack.toString(),
        })

        const response = await fetch(`/api/global-statements?${params.toString()}`)

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setStatements(data.statements || [])
        // setSourceCounts(data.sources || { rss: 0, x: 0 })
        setLastUpdated(new Date())
      } catch (err) {
        console.error("[v0] Global statements fetch error:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch statements")
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [activeRegion, selectedCountry, hoursBack],
  )

  useEffect(() => {
    fetchStatements()
  }, [fetchStatements])

  // Reset country filter when region changes
  useEffect(() => {
    setSelectedCountry("All")
  }, [activeRegion])

  const regions: Region[] = [
    "All",
    "North America",
    "South America",
    "Central America",
    "Caribbean",
    "Europe",
    "Asia",
    "Oceania",
    "Africa",
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative bg-zinc-950/70 backdrop-blur-xl border border-white/10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent" />

        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-mono text-zinc-500 tracking-[0.3em] uppercase mb-1">
                INTERNATIONAL MONITORING
              </p>
              <h1 className="text-2xl font-light tracking-tight text-white">Foreign Ministers & Heads of State</h1>
              <p className="text-sm text-zinc-400 mt-2">
                Official statements from foreign ministries, presidents, and prime ministers - from verified X accounts
                and official government websites.
              </p>
            </div>
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap gap-1 mt-4">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`px-3 py-1.5 text-[10px] font-mono tracking-wider uppercase transition-all ${
                  activeRegion === region
                    ? "text-white bg-white/10 border border-white/20 skew-x-[-6deg] shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                    : "text-zinc-500 hover:text-white border border-transparent hover:border-zinc-800"
                }`}
              >
                <span className={activeRegion === region ? "skew-x-[6deg] inline-block" : ""}>
                  {region.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="relative bg-zinc-950/50 backdrop-blur-xl border border-white/10 p-4 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {/* Country Dropdown */}
              {activeRegion !== "All" && availableCountries.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowCountryDropdown(!showCountryDropdown)
                      setShowHoursDropdown(false)
                    }}
                    className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-3 py-1.5 bg-white/5 backdrop-blur-sm hover:bg-white/10"
                  >
                    {selectedCountry === "All" ? "ALL COUNTRIES" : selectedCountry.toUpperCase()}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-zinc-900 border border-white/10 z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
                      <button
                        onClick={() => {
                          setSelectedCountry("All")
                          setShowCountryDropdown(false)
                        }}
                        className={`w-full text-left px-3 py-2 text-[10px] font-mono transition-colors ${
                          selectedCountry === "All"
                            ? "bg-white text-black"
                            : "text-zinc-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        ALL COUNTRIES
                      </button>
                      {availableCountries.map((country) => (
                        <button
                          key={country}
                          onClick={() => {
                            setSelectedCountry(country)
                            setShowCountryDropdown(false)
                          }}
                          className={`w-full text-left px-3 py-2 text-[10px] font-mono transition-colors ${
                            selectedCountry === country
                              ? "bg-white text-black"
                              : "text-zinc-400 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {country.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Hours Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowHoursDropdown(!showHoursDropdown)
                    setShowCountryDropdown(false)
                  }}
                  className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-3 py-1.5 bg-white/5 backdrop-blur-sm hover:bg-white/10"
                >
                  <Clock className="w-3 h-3" />
                  {hoursBack < 168 ? `${hoursBack}H` : `${hoursBack / 24}D`}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showHoursDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-zinc-900 border border-white/10 z-50 min-w-[140px]">
                    {HOUR_OPTIONS.map((hours) => (
                      <button
                        key={hours}
                        onClick={() => {
                          setHoursBack(hours)
                          setShowHoursDropdown(false)
                        }}
                        className={`w-full text-left px-3 py-2 text-[10px] font-mono transition-colors ${
                          hoursBack === hours
                            ? "bg-white text-black"
                            : "text-zinc-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {hours < 168 ? `LAST ${hours} HOURS` : `LAST ${hours / 24} DAYS`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Results count */}
              <div className="text-[10px] font-mono text-zinc-600">
                <span className="text-white">{statements.length}</span> STATEMENTS
              </div>
            </div>

            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-[10px] font-mono text-zinc-600">
                  UPDATED {getTimeAgo(lastUpdated.toISOString()).toUpperCase()}
                </span>
              )}
              <button
                onClick={() => fetchStatements(true)}
                disabled={loading || refreshing}
                className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-3 py-1.5 bg-white/5 backdrop-blur-sm hover:bg-white/10 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
                REFRESH
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
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
          <span className="text-zinc-500 font-mono text-[10px] tracking-wider">
            FETCHING FROM OFFICIAL SOURCES & X ACCOUNTS...
          </span>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-[10px] font-mono tracking-wider">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && statements.length === 0 && (
        <div className="text-center py-12 border border-zinc-800/50 bg-zinc-950/30">
          <Globe2 className="h-8 w-8 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500 text-[10px] font-mono tracking-wider uppercase mb-2">
            NO VENEZUELA-RELATED STATEMENTS FOUND
          </p>
          <p className="text-zinc-600 text-[10px] font-mono mb-4">
            Try expanding the time range or selecting a different region
          </p>
          <button
            onClick={() => fetchStatements(true)}
            className="px-4 py-2 bg-white text-black text-[10px] font-mono tracking-wider uppercase hover:bg-zinc-200 transition-colors"
          >
            REFRESH
          </button>
        </div>
      )}

      {/* Statements List - Row format */}
      {!loading && !error && statements.length > 0 && (
        <div className="border border-white/10 bg-zinc-950/50 divide-y divide-white/5">
          {statements.map((statement) => (
            <a
              key={statement.id}
              href={statement.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col md:flex-row md:items-stretch hover:bg-white/5 transition-colors group"
            >
              <div className="flex md:flex-col items-center gap-3 md:gap-1 p-4 md:py-4 md:px-3 md:w-20 flex-shrink-0 border-b md:border-b-0 md:border-r border-white/5 md:justify-center">
                {statement.sourceType === "x" ? (
                  <>
                    {statement.profileImage ? (
                      <Image
                        src={statement.profileImage || "/placeholder.svg"}
                        alt={statement.author || ""}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full border border-sky-500/30"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-500/20 border border-sky-500/30">
                        <Twitter className="w-4 h-4 text-sky-400" />
                      </div>
                    )}
                    <span className="text-[9px] font-mono text-sky-400">X</span>
                    <div className="flex items-center gap-2 md:hidden ml-auto">
                      <span className="text-xl">{statement.flag}</span>
                      <span className="text-[10px] font-mono text-zinc-500">{statement.country}</span>
                      <span className="text-[10px] font-mono text-zinc-600">{getTimeAgo(statement.publishedAt)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded flex items-center justify-center bg-amber-500/20 border border-amber-500/30">
                      <FileText className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-[9px] font-mono text-amber-400">OFFICIAL</span>
                    <div className="flex items-center gap-2 md:hidden ml-auto">
                      <span className="text-xl">{statement.flag}</span>
                      <span className="text-[10px] font-mono text-zinc-500">{statement.country}</span>
                      <span className="text-[10px] font-mono text-zinc-600">{getTimeAgo(statement.publishedAt)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex-1 min-w-0 py-4 px-4 space-y-2">
                {/* Author/Title line */}
                <div className="flex items-center gap-2 flex-wrap">
                  {statement.author && <span className="text-white font-medium text-sm">{statement.author}</span>}
                  {statement.handle && <span className="text-zinc-500 text-[10px] font-mono">{statement.handle}</span>}
                  {statement.role && <span className="text-[10px] font-mono text-zinc-600">· {statement.role}</span>}
                  {statement.isVerified && (
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5">
                      VERIFIED
                    </span>
                  )}
                </div>

                {/* Title (for RSS) */}
                {statement.title && <h3 className="text-sm font-medium text-white leading-snug">{statement.title}</h3>}

                {/* Content */}
                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">{statement.content}</p>

                {/* Quoted Tweet */}
                {statement.quotedTweet && (
                  <div className="border-l-2 border-zinc-700 pl-3 mt-2">
                    <div className="text-[10px] font-mono text-zinc-500 mb-1">
                      {statement.quotedTweet.author} {statement.quotedTweet.handle}
                    </div>
                    <p className="text-xs text-zinc-500 line-clamp-2">{statement.quotedTweet.content}</p>
                  </div>
                )}

                {/* Images - responsive grid */}
                {statement.images && statement.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {statement.images.slice(0, 4).map((img, i) => (
                      <Image
                        key={i}
                        src={img || "/placeholder.svg"}
                        alt=""
                        width={120}
                        height={80}
                        className="w-16 sm:w-20 h-12 sm:h-14 object-cover border border-white/10"
                      />
                    ))}
                  </div>
                )}

                {/* Metrics (for X) */}
                {statement.metrics && statement.sourceType === "x" && (
                  <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-600">
                    <span>{statement.metrics.likes.toLocaleString()} likes</span>
                    <span>{statement.metrics.retweets.toLocaleString()} retweets</span>
                    <span>{statement.metrics.replies.toLocaleString()} replies</span>
                  </div>
                )}

                {/* Source (for RSS) */}
                {statement.sourceType === "rss" && statement.source && (
                  <div className="text-[10px] font-mono text-amber-400/70">{statement.source}</div>
                )}
              </div>

              <div className="hidden md:flex w-28 lg:w-32 flex-shrink-0 flex-col items-center justify-center py-4 px-2 border-l border-white/5 text-center">
                <span className="text-2xl mb-1">{statement.flag}</span>
                <span className="text-[9px] font-mono text-zinc-500 leading-tight">{statement.country}</span>
                <div className="mt-3 space-y-0.5">
                  <div className="text-[10px] font-mono text-zinc-500">{getTimeAgo(statement.publishedAt)}</div>
                  <div className="text-[10px] font-mono text-zinc-700">{formatDate(statement.publishedAt)}</div>
                </div>
                <ExternalLink className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity mt-2" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
