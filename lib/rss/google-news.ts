// Map outlet names to their domains for site: filtering
export const OUTLET_DOMAINS: Record<string, string[]> = {
  English: [
    "nytimes.com",
    "washingtonpost.com",
    "wsj.com",
    "latimes.com",
    "apnews.com",
    "reuters.com",
    "bloomberg.com",
    "economist.com",
    "time.com",
    "npr.org",
    "pbs.org",
    "cnn.com",
    "abcnews.go.com",
    "nbcnews.com",
    "cbsnews.com",
    "miamiherald.com",
    "bbc.com",
    "ft.com",
    "theguardian.com",
    "thetimes.com",
    "telegraph.co.uk",
    "independent.co.uk",
  ],
  Spanish: [
    "elpais.com",
    "elmundo.es",
    "abc.es",
    "lavanguardia.com",
    "reforma.com",
    "eluniversal.com.mx",
    "clarin.com",
    "lanacion.com.ar",
    "eltiempo.com",
    "semana.com",
    "emol.com",
    "univision.com",
    "telemundo.com",
    "cnnespanol.cnn.com",
    "bbc.com/mundo",
    "dw.com/es",
    "voanoticias.com",
    "es.euronews.com",
    "efe.com",
  ],
  Venezuelan: [
    "elnacional.com",
    "lapatilla.com",
    "elpitazo.net",
    "efectococuyo.com",
    "talcualdigital.com",
    "runrun.es",
  ],
  World: [
    "lemonde.fr",
    "france24.com",
    "dw.com",
    "spiegel.de",
    "faz.net",
    "spectator.co.uk",
    "haaretz.com",
    "jpost.com",
    "timesofisrael.com",
    "ynetnews.com",
    "israelhayom.com",
    "globes.co.il",
    "aljazeera.com",
    "arabnews.com",
    "thenationalnews.com",
    "scmp.com",
    "thehindu.com",
    "japantimes.co.jp",
    "nhk.or.jp",
    "straitstimes.com",
    "dailymaverick.co.za",
    "mg.co.za",
    "folha.uol.com.br",
    "oglobo.globo.com",
    "theglobeandmail.com",
    "smh.com.au",
  ],
  Regime: [
    "venezuelanalysis.com",
    "vtv.gob.ve",
    "telesurtv.net",
    "ultimasnoticias.com.ve",
    "globovision.com",
    "correodelorinoco.gob.ve",
    "avn.info.ve",
    "tves.gob.ve",
    "laiguana.tv",
    "rt.com",
    "hispantv.com",
  ],
}

// Venezuela search topics (same as we used with ChatGPT)
export const VENEZUELA_SEARCH_TERMS = [
  "Venezuela",
  "Maria Corina Machado",
  "Maduro",
  "Edmundo Gonzalez",
  "drug boats Venezuela",
  "Operation Southern Spear",
  "Lanza del Sur",
]

/**
 * Build the Venezuela topic search block
 * Groups terms with OR for broader matching
 */
export function buildVenezuelaTopicBlock(): string {
  // Use shorter version for RSS (Venezuela is required, others are optional context)
  return "Venezuela"
}

/**
 * Build site filter for a list of domains
 * Google News RSS uses site: operator
 */
export function buildSiteFilter(domains: string[]): string {
  if (domains.length === 0) return ""
  if (domains.length === 1) return `site:${domains[0]}`

  // Group sites with OR - limit to avoid query length issues
  const limitedDomains = domains.slice(0, 10)
  return `(${limitedDomains.map((d) => `site:${d}`).join(" OR ")})`
}

/**
 * Pick the `when:` modifier for in-query date filtering
 * This is applied IN the query, not post-fetch
 *
 * Available modifiers: when:1h, when:1d, when:7d
 */
export function pickWhenModifier(lookbackHours: number): string {
  if (lookbackHours <= 1) return "when:1h"
  if (lookbackHours <= 24) return "when:1d"
  if (lookbackHours <= 72) return "when:3d"
  if (lookbackHours <= 168) return "when:7d"
  return "when:7d" // Max supported by Google News RSS
}

/**
 * Build the full Google News RSS URL
 */
export function buildGoogleNewsRssUrl(params: {
  query: string
  hl?: string // language
  gl?: string // country
  ceid?: string // edition
}): string {
  const { query, hl = "en-US", gl = "US", ceid = "US:en" } = params

  const encodedQuery = encodeURIComponent(query)
  return `https://news.google.com/rss/search?q=${encodedQuery}&hl=${hl}&gl=${gl}&ceid=${ceid}`
}

/**
 * Parse RSS XML to extract articles
 */
function parseRssXml(xml: string): Array<{
  id: string
  title: string
  outlet: string
  summary: string
  url: string
  publishedAt: string
}> {
  const articles: Array<{
    id: string
    title: string
    outlet: string
    summary: string
    url: string
    publishedAt: string
  }> = []

  // Simple XML parsing for RSS items
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1]

    // Extract fields
    const titleMatch = /<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>|<title>([\s\S]*?)<\/title>/.exec(itemXml)
    const linkMatch = /<link>([\s\S]*?)<\/link>/.exec(itemXml)
    const pubDateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(itemXml)
    const descMatch =
      /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/.exec(itemXml)
    const sourceMatch = /<source[^>]*>([\s\S]*?)<\/source>/.exec(itemXml)

    const title = (titleMatch?.[1] || titleMatch?.[2] || "").trim()
    const url = (linkMatch?.[1] || "").trim()
    const pubDate = (pubDateMatch?.[1] || "").trim()
    const description = (descMatch?.[1] || descMatch?.[2] || "").trim()
    const source = (sourceMatch?.[1] || "Unknown").trim()

    if (title && url) {
      articles.push({
        id: Buffer.from(url).toString("base64").slice(0, 32),
        title: decodeHtmlEntities(title),
        outlet: decodeHtmlEntities(source),
        summary: decodeHtmlEntities(stripHtml(description)),
        url,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      })
    }
  }

  return articles
}

/**
 * Decode HTML entities
 */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
}

/**
 * Strip HTML tags from text
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

/**
 * Fetch articles from Google News RSS
 */
export async function fetchGoogleNewsArticles(rssUrl: string): Promise<
  Array<{
    id: string
    title: string
    outlet: string
    summary: string
    url: string
    publishedAt: string
  }>
> {
  try {
    console.log(`[v0] Fetching Google News RSS: ${rssUrl.slice(0, 100)}...`)

    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NewsAggregator/1.0)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      cache: "no-store", // Force no caching to always get fresh data
    })

    if (!response.ok) {
      console.error(`[v0] Google News RSS error: ${response.status} ${response.statusText}`)
      return []
    }

    const xml = await response.text()
    console.log(`[v0] Google News RSS response length: ${xml.length} characters`)

    const articles = parseRssXml(xml)

    console.log(`[v0] Google News RSS parsed ${articles.length} articles`)
    return articles
  } catch (error) {
    console.error("[v0] Google News RSS fetch error:", error)
    return []
  }
}

/**
 * Filter articles by lookback hours (post-fetch safety filter)
 * Note: The primary filtering should be via `when:` in the query
 * This is a secondary safety filter
 */
export function filterByLookback(
  articles: Array<{ publishedAt: string }>,
  lookbackHours: number,
): Array<{ publishedAt: string }> {
  const cutoff = Date.now() - lookbackHours * 60 * 60 * 1000
  return articles.filter((a) => new Date(a.publishedAt).getTime() >= cutoff)
}
