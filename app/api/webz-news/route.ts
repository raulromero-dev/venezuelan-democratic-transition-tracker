import { type NextRequest, NextResponse } from "next/server"
import {
  fetchGoogleNewsArticles,
  filterByLookback,
  buildGoogleNewsRssUrl,
  buildSiteFilter,
  pickWhenModifier,
  OUTLET_DOMAINS,
} from "@/lib/rss/google-news"

export const maxDuration = 60
export const dynamic = "force-dynamic"

// Topic classification based on keywords
function classifyTopics(title: string, text: string): string[] {
  const content = `${title} ${text}`.toLowerCase()
  const topics: string[] = []

  if (
    content.includes("military") ||
    content.includes("troops") ||
    content.includes("operation") ||
    content.includes("navy") ||
    content.includes("southern spear") ||
    content.includes("lanza del sur")
  ) {
    topics.push("US military operations")
  }
  if (
    content.includes("narco") ||
    content.includes("drug") ||
    content.includes("trafficking") ||
    content.includes("cocaine") ||
    content.includes("cartel") ||
    content.includes("boat")
  ) {
    topics.push("Narco-trafficking")
  }
  if (
    content.includes("opposition") ||
    content.includes("maria corina") ||
    content.includes("edmundo") ||
    content.includes("machado") ||
    content.includes("gonzalez urrutia") ||
    content.includes("gonzález")
  ) {
    topics.push("Venezuelan opposition")
  }
  if (
    content.includes("human rights") ||
    content.includes("torture") ||
    content.includes("political prisoner") ||
    content.includes("detention") ||
    content.includes("persecution") ||
    content.includes("derechos humanos")
  ) {
    topics.push("Human Rights")
  }
  if (
    content.includes("sanction") ||
    content.includes("diplomat") ||
    content.includes("relations") ||
    content.includes("embassy") ||
    content.includes("rubio") ||
    content.includes("state department") ||
    content.includes("relaciones")
  ) {
    topics.push("Venezuela-US relations")
  }
  if (
    content.includes("humanitarian") ||
    content.includes("crisis") ||
    content.includes("food") ||
    content.includes("medicine") ||
    content.includes("refugee") ||
    content.includes("migration") ||
    content.includes("humanitaria") ||
    content.includes("migración")
  ) {
    topics.push("Humanitarian Crisis")
  }

  return topics.length > 0 ? topics : ["Venezuela-US relations"]
}

// Determine language from content
function detectLanguage(title: string, text: string): "en" | "es" {
  const spanishIndicators = [
    "el",
    "la",
    "los",
    "las",
    "de",
    "en",
    "que",
    "del",
    "con",
    "para",
    "por",
    "una",
    "uno",
    "según",
    "más",
    "sobre",
    "tras",
    "como",
    "hasta",
  ]
  const content = `${title} ${text}`.toLowerCase()
  const words = content.split(/\s+/)

  let spanishCount = 0
  for (const word of words.slice(0, 50)) {
    if (spanishIndicators.includes(word)) spanishCount++
  }

  return spanishCount > 5 ? "es" : "en"
}

/**
 * Search a category via Google News RSS with in-query date filtering
 */
async function searchCategoryViaRss(category: string, lookbackHours: number): Promise<any[]> {
  const domains = OUTLET_DOMAINS[category] || []

  if (domains.length === 0) {
    console.log(`[v0] No domains for category: ${category}`)
    return []
  }

  const whenModifier = pickWhenModifier(lookbackHours)

  // Build query with Venezuela + site filter + when modifier
  // Query structure: Venezuela (site:domain1 OR site:domain2) when:Xd
  const siteBlock = buildSiteFilter(domains)
  const query = `Venezuela ${siteBlock} ${whenModifier}`

  console.log(`[v0] Google News RSS query for ${category}: ${query.slice(0, 80)}...`)

  // Choose language params based on category
  const params =
    category === "Spanish" || category === "Venezuelan" || category === "Regime"
      ? { hl: "es-419", gl: "VE", ceid: "VE:es-419" }
      : { hl: "en-US", gl: "US", ceid: "US:en" }

  const rssUrl = buildGoogleNewsRssUrl({ query, ...params })

  const rssArticles = await fetchGoogleNewsArticles(rssUrl)

  // Secondary safety filter (when: should handle this, but just in case)
  const recent = filterByLookback(rssArticles, lookbackHours)

  console.log(`[v0] Google News RSS - ${category}: ${recent.length} articles`)

  return recent.map((a) => ({
    id: a.id,
    title: a.title,
    outlet: a.outlet,
    category,
    summary: a.summary,
    url: a.url,
    publishedAt: a.publishedAt,
    language: detectLanguage(a.title, a.summary),
    topics: classifyTopics(a.title, a.summary),
  }))
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const hoursBack = Number.parseInt(searchParams.get("hours") || "72")
  const category = searchParams.get("category") || "All"
  const topic = searchParams.get("topic") || "All"
  const language = searchParams.get("language") || "All"

  try {
    console.log(`[v0] Google News RSS search - category: ${category}, hours: ${hoursBack}, topic: ${topic}`)

    const allResults: any[] = []

    // Determine which categories to fetch
    const categoriesToFetch: string[] = []
    if (category === "All") {
      categoriesToFetch.push("English", "Spanish", "Venezuelan", "World", "Regime")
    } else {
      categoriesToFetch.push(category)
    }

    // Fetch each category in parallel
    const categoryPromises = categoriesToFetch.map((cat) => searchCategoryViaRss(cat, hoursBack))
    const results = await Promise.all(categoryPromises)

    for (const articles of results) {
      allResults.push(...articles)
    }

    // Deduplicate by URL
    const uniqueArticles = new Map<string, any>()
    for (const article of allResults) {
      if (article.url && !uniqueArticles.has(article.url)) {
        uniqueArticles.set(article.url, article)
      }
    }

    let articles = Array.from(uniqueArticles.values())

    // Apply language filter
    if (language !== "All") {
      const langCode = language === "English" ? "en" : "es"
      articles = articles.filter((a) => a.language === langCode)
    }

    // Apply topic filter
    if (topic !== "All") {
      articles = articles.filter((a) => a.topics?.includes(topic))
    }

    // Sort by date (newest first)
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    console.log(`[v0] Google News RSS - total unique articles: ${articles.length}`)

    return NextResponse.json({
      articles,
      fetchedAt: new Date().toISOString(),
      totalFound: articles.length,
      filters: { category, topic, language, hoursBack },
    })
  } catch (error) {
    console.error("[v0] Google News RSS error:", error)
    return NextResponse.json(
      {
        articles: [],
        error: String(error),
      },
      { status: 500 },
    )
  }
}
