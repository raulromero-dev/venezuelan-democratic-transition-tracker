"use client"

import { useState, useEffect, useCallback } from "react"
import { RefreshCw, ExternalLink, Filter, ChevronDown, Clock } from "lucide-react"

// =============================================================================
// TYPES
// =============================================================================

interface WebzArticle {
  id: string
  title: string
  outlet: string
  site: string
  category: string
  summary: string
  url: string
  publishedAt: string
  language: "en" | "es"
  topics: string[]
  author?: string
}

type MediaCategory = "All" | "English" | "Spanish" | "Venezuelan" | "World" | "Regime"
type LanguageFilter = "All" | "English" | "Spanish"

// =============================================================================
// CONSTANTS
// =============================================================================

const TOPIC_FILTERS = [
  "US military operations",
  "Narco-trafficking",
  "Venezuelan opposition",
  "Human Rights",
  "Venezuela-US relations",
  "Humanitarian Crisis",
] as const

const TOPIC_COLORS: Record<string, string> = {
  "US military operations": "bg-red-500/20 text-red-400 border-red-500/30",
  "Narco-trafficking": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Venezuelan opposition": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Human Rights": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Venezuela-US relations": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Humanitarian Crisis": "bg-amber-500/20 text-amber-400 border-amber-500/30",
}

const HOUR_OPTIONS = [24, 48, 72, 168, 336] // 24h, 48h, 72h, 1 week, 2 weeks

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

// =============================================================================
// COMPONENT
// =============================================================================

export function WebzMediaFeed() {
  const [articles, setArticles] = useState<WebzArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Filters
  const [category, setCategory] = useState<MediaCategory>("All")
  const [language, setLanguage] = useState<LanguageFilter>("All")
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set())
  const [hoursBack, setHoursBack] = useState(72)

  // Dropdown states
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [showHoursDropdown, setShowHoursDropdown] = useState(false)

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        hours: hoursBack.toString(),
        category,
        language,
      })

      const response = await fetch(`/api/webz-news?${params}`)

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setArticles(data.articles || [])
      setLastUpdated(new Date())
    } catch (err) {
      console.error("[v0] Webz fetch error:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch articles")
    } finally {
      setLoading(false)
    }
  }, [category, language, hoursBack])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  // Toggle topic filter
  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) => {
      const next = new Set(prev)
      if (next.has(topic)) {
        next.delete(topic)
      } else {
        next.add(topic)
      }
      return next
    })
  }

  // Filter articles by selected topics
  const filteredArticles =
    selectedTopics.size === 0 ? articles : articles.filter((a) => a.topics.some((t) => selectedTopics.has(t)))

  const categories: MediaCategory[] = ["All", "English", "Spanish", "Venezuelan", "World", "Regime"]
  const languages: LanguageFilter[] = ["All", "English", "Spanish"]

  return (
    <div className="space-y-4">
      <div className="relative bg-zinc-950/50 backdrop-blur-xl border border-white/10 p-4 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative z-10 space-y-4">
          {/* Filter row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => {
                    setShowCategoryDropdown(!showCategoryDropdown)
                    setShowLanguageDropdown(false)
                    setShowHoursDropdown(false)
                  }}
                  className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-3 py-1.5 bg-white/5 backdrop-blur-sm hover:bg-white/10"
                >
                  <Filter className="w-3 h-3" />
                  {category.toUpperCase()}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-zinc-900 border border-white/10 z-50 min-w-[120px]">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setCategory(cat)
                          setShowCategoryDropdown(false)
                        }}
                        className={`w-full text-left px-3 py-2 text-[10px] font-mono transition-colors ${
                          category === cat ? "bg-white text-black" : "text-zinc-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {cat.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setShowLanguageDropdown(!showLanguageDropdown)
                    setShowCategoryDropdown(false)
                    setShowHoursDropdown(false)
                  }}
                  className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-3 py-1.5 bg-white/5 backdrop-blur-sm hover:bg-white/10"
                >
                  {language === "All" ? "ALL LANGUAGES" : language.toUpperCase()}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showLanguageDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-zinc-900 border border-white/10 z-50 min-w-[140px]">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang)
                          setShowLanguageDropdown(false)
                        }}
                        className={`w-full text-left px-3 py-2 text-[10px] font-mono transition-colors ${
                          language === lang ? "bg-white text-black" : "text-zinc-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {lang === "All" ? "ALL LANGUAGES" : lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setShowHoursDropdown(!showHoursDropdown)
                    setShowCategoryDropdown(false)
                    setShowLanguageDropdown(false)
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
            </div>

            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-[10px] font-mono text-zinc-600">
                  UPDATED {getTimeAgo(lastUpdated.toISOString()).toUpperCase()}
                </span>
              )}
              <button
                onClick={fetchArticles}
                disabled={loading}
                className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 hover:text-white transition-colors border border-white/10 hover:border-white/30 px-3 py-1.5 bg-white/5 backdrop-blur-sm hover:bg-white/10 disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                REFRESH
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {TOPIC_FILTERS.map((topic) => (
              <button
                key={topic}
                onClick={() => toggleTopic(topic)}
                className={`px-3 py-1.5 text-[10px] font-mono border transition-all ${
                  selectedTopics.has(topic)
                    ? TOPIC_COLORS[topic] + " border-current"
                    : "bg-white/5 text-zinc-500 border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {topic.toUpperCase()}
              </button>
            ))}
            {selectedTopics.size > 0 && (
              <button
                onClick={() => setSelectedTopics(new Set())}
                className="px-3 py-1.5 text-[10px] font-mono text-zinc-600 hover:text-white transition-colors"
              >
                CLEAR FILTERS
              </button>
            )}
          </div>

          {/* Results count */}
          <div className="text-[10px] font-mono text-zinc-600 pt-2 border-t border-white/10">
            SHOWING <span className="text-white">{filteredArticles.length}</span> ARTICLES
            {selectedTopics.size > 0 &&
              ` (FILTERED BY ${selectedTopics.size} TOPIC${selectedTopics.size > 1 ? "S" : ""})`}
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
          <span className="text-zinc-500 font-mono text-[10px] tracking-wider">LOADING ARTICLES FROM WEBZ.IO...</span>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-[10px] font-mono tracking-wider">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-zinc-950/80 border-b border-white/10">
                  <th className="px-4 py-3 text-left text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    TIME
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    TITLE
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    SOURCE
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    CATEGORY
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    TOPICS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-zinc-600 text-[10px] font-mono tracking-wider"
                    >
                      NO ARTICLES FOUND. TRY ADJUSTING YOUR FILTERS OR EXPANDING THE TIME RANGE.
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-zinc-600 whitespace-nowrap text-[10px] font-mono">
                        {getTimeAgo(article.publishedAt).toUpperCase()}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-zinc-300 text-xs inline-flex items-center gap-1 transition-colors"
                        >
                          {article.title}
                          <ExternalLink className="w-3 h-3 flex-shrink-0 text-zinc-600" />
                        </a>
                      </td>
                      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap text-[10px] font-mono">
                        {article.outlet.toUpperCase()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-[9px] font-mono border ${
                            article.category === "Regime"
                              ? "border-red-500/50 text-red-400 bg-red-500/10"
                              : article.category === "Venezuelan"
                                ? "border-yellow-500/50 text-yellow-400 bg-yellow-500/10"
                                : article.category === "Spanish"
                                  ? "border-orange-500/50 text-orange-400 bg-orange-500/10"
                                  : article.category === "World"
                                    ? "border-purple-500/50 text-purple-400 bg-purple-500/10"
                                    : "border-cyan-500/50 text-cyan-400 bg-cyan-500/10"
                          }`}
                        >
                          {article.category.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {article.topics.slice(0, 2).map((topic) => (
                            <span
                              key={topic}
                              className={`px-2 py-0.5 text-[9px] font-mono border ${TOPIC_COLORS[topic] || "bg-zinc-800/50 text-zinc-500 border-zinc-700"}`}
                            >
                              {topic.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
