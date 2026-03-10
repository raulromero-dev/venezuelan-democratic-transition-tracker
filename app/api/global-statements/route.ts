import { type NextRequest, NextResponse } from "next/server"
import {
  getAllForeignMinisterHandles,
  getForeignMinisterHandlesByRegion,
  getForeignMinisterAccountInfo,
} from "@/lib/foreign-ministers-accounts"
import { RELEVANCE_THRESHOLD, KEYWORD_REGEX } from "@/lib/venezuela-keywords"
import {
  buildGoogleNewsRssUrl,
  fetchGoogleNewsArticles,
  pickWhenModifier,
  buildSiteFilter,
} from "@/lib/rss/google-news"

export const maxDuration = 60
export const dynamic = "force-dynamic"

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

// =============================================================================
// X API TYPES & CONFIG
// =============================================================================

const X_API_BEARER_TOKEN = process.env.X_API_BEARER_TOKEN
const X_BATCH_SIZE = 10
const X_BATCH_DELAY_MS = 2000

const MAX_STATEMENT_AGE_DAYS = 30

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

// =============================================================================
// OPENAI EMBEDDINGS
// =============================================================================

let referenceEmbedding: number[] | null = null

const REFERENCE_TEXT = `Venezuela political crisis Maduro regime opposition sanctions diplomatic relations 
human rights violations migration refugees Nicolas Maduro Maria Corina Machado Edmundo Gonzalez 
electoral fraud democracy humanitarian aid PDVSA oil industry Caracas Bolivarian government 
political prisoners detention arbitrary arrests persecution exile diaspora TPS deportation 
US State Department foreign ministry diplomatic statement official position government response`

async function getEmbeddings(texts: string[]): Promise<number[][]> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.log("[v0] No OPENAI_API_KEY, falling back to keyword matching")
    return []
  }

  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: texts.map((t) => t.substring(0, 8000)),
      }),
    })

    if (!response.ok) {
      console.log("[v0] OpenAI embedding error:", response.status)
      return []
    }

    const data = await response.json()
    return data.data.map((d: { embedding: number[] }) => d.embedding)
  } catch (error) {
    console.error("[v0] Embedding error:", error)
    return []
  }
}

async function getReferenceEmbedding(): Promise<number[] | null> {
  if (referenceEmbedding) return referenceEmbedding

  const embeddings = await getEmbeddings([REFERENCE_TEXT])
  if (embeddings.length > 0) {
    referenceEmbedding = embeddings[0]
  }
  return referenceEmbedding
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// =============================================================================
// RELEVANCE SCORING
// =============================================================================

async function scoreStatements(statements: GlobalStatement[]): Promise<GlobalStatement[]> {
  const results: GlobalStatement[] = []
  const needsEmbedding: { index: number; text: string }[] = []

  // First pass: keyword matching
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    const text = `${statement.title} ${statement.content || ""}`

    if (KEYWORD_REGEX.test(text)) {
      results.push({
        ...statement,
        relevanceScore: 1.0,
        relevanceMethod: "keyword",
      })
    } else {
      results.push({
        ...statement,
        relevanceScore: 0,
        relevanceMethod: undefined,
      })
      needsEmbedding.push({ index: i, text })
    }
  }

  console.log(
    `[v0] Keyword matched: ${results.length - needsEmbedding.length}, needs embedding: ${needsEmbedding.length}`,
  )

  // Second pass: semantic similarity for non-keyword matches
  if (needsEmbedding.length > 0) {
    const refEmbed = await getReferenceEmbedding()
    if (refEmbed) {
      const BATCH_SIZE = 50
      for (let batchStart = 0; batchStart < needsEmbedding.length; batchStart += BATCH_SIZE) {
        const batch = needsEmbedding.slice(batchStart, batchStart + BATCH_SIZE)
        const texts = batch.map((item) => item.text)
        const embeddings = await getEmbeddings(texts)

        for (let i = 0; i < batch.length; i++) {
          const { index } = batch[i]
          const embedding = embeddings[i]
          if (embedding) {
            const similarity = cosineSimilarity(embedding, refEmbed)
            results[index] = {
              ...results[index],
              relevanceScore: similarity,
              relevanceMethod: "semantic",
            }
          }
        }
      }
    }
  }

  const passedCount = results.filter((r) => (r.relevanceScore || 0) >= RELEVANCE_THRESHOLD).length
  console.log(
    `[v0] RELEVANCE SUMMARY: ${passedCount}/${results.length} statements passed threshold (${RELEVANCE_THRESHOLD})`,
  )

  return results
}

// =============================================================================
// RSS FETCHING - BATCHED BY REGION (like webz-news pattern)
// =============================================================================

const BANNED_DOMAINS = [".gov.za"]

// Official government domains by region
const GOVERNMENT_DOMAINS: Record<
  string,
  { domains: string[]; countries: Record<string, { code: string; flag: string }> }
> = {
  "North America": {
    domains: ["state.gov", "whitehouse.gov", "canada.ca", "international.gc.ca", "gob.mx", "sre.gob.mx"],
    countries: {
      "state.gov": { code: "US", flag: "🇺🇸" },
      "whitehouse.gov": { code: "US", flag: "🇺🇸" },
      "canada.ca": { code: "CA", flag: "🇨🇦" },
      "international.gc.ca": { code: "CA", flag: "🇨🇦" },
      "gob.mx": { code: "MX", flag: "🇲🇽" },
      "sre.gob.mx": { code: "MX", flag: "🇲🇽" },
    },
  },
  "South America": {
    domains: [
      "cancilleria.gob.ar",
      "argentina.gob.ar",
      "itamaraty.gov.br",
      "gov.br/mre",
      "cancilleria.gov.co",
      "minrel.gob.cl",
      "gob.pe",
      "cancilleria.gob.ec",
      "mrree.gub.uy",
      "mre.gov.py",
    ],
    countries: {
      "cancilleria.gob.ar": { code: "AR", flag: "🇦🇷" },
      "argentina.gob.ar": { code: "AR", flag: "🇦🇷" },
      "itamaraty.gov.br": { code: "BR", flag: "🇧🇷" },
      "gov.br/mre": { code: "BR", flag: "🇧🇷" },
      "cancilleria.gov.co": { code: "CO", flag: "🇨🇴" },
      "minrel.gob.cl": { code: "CL", flag: "🇨🇱" },
      "gob.pe": { code: "PE", flag: "🇵🇪" },
      "cancilleria.gob.ec": { code: "EC", flag: "🇪🇨" },
      "mrree.gub.uy": { code: "UY", flag: "🇺🇾" },
      "mre.gov.py": { code: "PY", flag: "🇵🇾" },
    },
  },
  "Central America": {
    domains: [
      "rree.gob.sv",
      "presidencia.gob.sv",
      "minex.gob.gt",
      "sreci.gob.hn",
      "cancilleria.gob.ni",
      "rree.go.cr",
      "mire.gob.pa",
      "mfa.gov.bz",
    ],
    countries: {
      "rree.gob.sv": { code: "SV", flag: "🇸🇻" },
      "presidencia.gob.sv": { code: "SV", flag: "🇸🇻" },
      "minex.gob.gt": { code: "GT", flag: "🇬🇹" },
      "sreci.gob.hn": { code: "HN", flag: "🇭🇳" },
      "cancilleria.gob.ni": { code: "NI", flag: "🇳🇮" },
      "rree.go.cr": { code: "CR", flag: "🇨🇷" },
      "mire.gob.pa": { code: "PA", flag: "🇵🇦" },
      "mfa.gov.bz": { code: "BZ", flag: "🇧🇿" },
    },
  },
  Caribbean: {
    domains: ["minrex.gob.cu", "mirex.gob.do", "mfaft.gov.jm", "foreign.gov.tt", "mae.gouv.ht"],
    countries: {
      "minrex.gob.cu": { code: "CU", flag: "🇨🇺" },
      "mirex.gob.do": { code: "DO", flag: "🇩🇴" },
      "mfaft.gov.jm": { code: "JM", flag: "🇯🇲" },
      "foreign.gov.tt": { code: "TT", flag: "🇹🇹" },
      "mae.gouv.ht": { code: "HT", flag: "🇭🇹" },
    },
  },
  Europe: {
    domains: [
      "gov.uk",
      "exteriores.gob.es",
      "diplomatie.gouv.fr",
      "auswaertiges-amt.de",
      "esteri.it",
      "eeas.europa.eu",
      "europa.eu",
      "government.nl",
      "diplomatie.belgium.be",
      "gov.pl",
      "portugal.gov.pt",
      "government.se",
      "regjeringen.no",
      "um.dk",
      "eda.admin.ch",
      "bmeia.gv.at",
      "dfa.ie",
      "mfa.gr",
      "mzv.cz",
      "kormany.hu",
      "mae.ro",
    ],
    countries: {
      "gov.uk": { code: "GB", flag: "🇬🇧" },
      "exteriores.gob.es": { code: "ES", flag: "🇪🇸" },
      "diplomatie.gouv.fr": { code: "FR", flag: "🇫🇷" },
      "auswaertiges-amt.de": { code: "DE", flag: "🇩🇪" },
      "esteri.it": { code: "IT", flag: "🇮🇹" },
      "eeas.europa.eu": { code: "EU", flag: "🇪🇺" },
      "europa.eu": { code: "EU", flag: "🇪🇺" },
      "government.nl": { code: "NL", flag: "🇳🇱" },
      "diplomatie.belgium.be": { code: "BE", flag: "🇧🇪" },
      "gov.pl": { code: "PL", flag: "🇵🇱" },
      "portugal.gov.pt": { code: "PT", flag: "🇵🇹" },
      "government.se": { code: "SE", flag: "🇸🇪" },
      "regjeringen.no": { code: "NO", flag: "🇳🇴" },
      "um.dk": { code: "DK", flag: "🇩🇰" },
      "eda.admin.ch": { code: "CH", flag: "🇨🇭" },
      "bmeia.gv.at": { code: "AT", flag: "🇦🇹" },
      "dfa.ie": { code: "IE", flag: "🇮🇪" },
      "mfa.gr": { code: "GR", flag: "🇬🇷" },
      "mzv.cz": { code: "CZ", flag: "🇨🇿" },
      "kormany.hu": { code: "HU", flag: "🇭🇺" },
      "mae.ro": { code: "RO", flag: "🇷🇴" },
    },
  },
  Asia: {
    domains: [
      "fmprc.gov.cn",
      "mid.ru",
      "mofa.go.jp",
      "mofa.go.kr",
      "mea.gov.in",
      "gov.il",
      "mfa.gov.tr",
      "mfa.gov.ir",
      "mofa.gov.sa",
      "mofaic.gov.ae",
      "kemlu.go.id",
      "dfa.gov.ph",
      "mfa.go.th",
      "kln.gov.my",
      "mfa.gov.sg",
      "mofa.gov.pk",
      "mofa.gov.qa",
    ],
    countries: {
      "fmprc.gov.cn": { code: "CN", flag: "🇨🇳" },
      "mid.ru": { code: "RU", flag: "🇷🇺" },
      "mofa.go.jp": { code: "JP", flag: "🇯🇵" },
      "mofa.go.kr": { code: "KR", flag: "🇰🇷" },
      "mea.gov.in": { code: "IN", flag: "🇮🇳" },
      "gov.il": { code: "IL", flag: "🇮🇱" },
      "mfa.gov.tr": { code: "TR", flag: "🇹🇷" },
      "mfa.gov.ir": { code: "IR", flag: "🇮🇷" },
      "mofa.gov.sa": { code: "SA", flag: "🇸🇦" },
      "mofaic.gov.ae": { code: "AE", flag: "🇦🇪" },
      "kemlu.go.id": { code: "ID", flag: "🇮🇩" },
      "dfa.gov.ph": { code: "PH", flag: "🇵🇭" },
      "mfa.go.th": { code: "TH", flag: "🇹🇭" },
      "kln.gov.my": { code: "MY", flag: "🇲🇾" },
      "mfa.gov.sg": { code: "SG", flag: "🇸🇬" },
      "mofa.gov.pk": { code: "PK", flag: "🇵🇰" },
      "mofa.gov.qa": { code: "QA", flag: "🇶🇦" },
    },
  },
  Oceania: {
    domains: [
      "dfat.gov.au",
      "pm.gov.au",
      "mfat.govt.nz",
      "beehive.govt.nz",
      "foreignaffairs.gov.fj",
      "foreignaffairs.gov.pg",
    ],
    countries: {
      "dfat.gov.au": { code: "AU", flag: "🇦🇺" },
      "pm.gov.au": { code: "AU", flag: "🇦🇺" },
      "mfat.govt.nz": { code: "NZ", flag: "🇳🇿" },
      "beehive.govt.nz": { code: "NZ", flag: "🇳🇿" },
      "foreignaffairs.gov.fj": { code: "FJ", flag: "🇫🇯" },
      "foreignaffairs.gov.pg": { code: "PG", flag: "🇵🇬" },
    },
  },
  Africa: {
    domains: ["dirco.gov.za", "foreignaffairs.gov.ng", "mfa.gov.eg", "mfa.go.ke", "diplomatie.gov.ma", "mae.gov.dz"],
    countries: {
      "dirco.gov.za": { code: "ZA", flag: "🇿🇦" },
      "foreignaffairs.gov.ng": { code: "NG", flag: "🇳🇬" },
      "mfa.gov.eg": { code: "EG", flag: "🇪🇬" },
      "mfa.go.ke": { code: "KE", flag: "🇰🇪" },
      "diplomatie.gov.ma": { code: "MA", flag: "🇲🇦" },
      "mae.gov.dz": { code: "DZ", flag: "🇩🇿" },
    },
  },
}

// Country name lookup from domain
const DOMAIN_TO_COUNTRY: Record<string, string> = {
  "state.gov": "United States",
  "whitehouse.gov": "United States",
  "canada.ca": "Canada",
  "international.gc.ca": "Canada",
  "gob.mx": "Mexico",
  "sre.gob.mx": "Mexico",
  "cancilleria.gob.ar": "Argentina",
  "argentina.gob.ar": "Argentina",
  "itamaraty.gov.br": "Brazil",
  "gov.br/mre": "Brazil",
  "cancilleria.gov.co": "Colombia",
  "minrel.gob.cl": "Chile",
  "gob.pe": "Peru",
  "cancilleria.gob.ec": "Ecuador",
  "mrree.gub.uy": "Uruguay",
  "mre.gov.py": "Paraguay",
  "cancilleria.gob.bo": "Bolivia",
  "rree.gob.sv": "El Salvador",
  "presidencia.gob.sv": "El Salvador",
  "minex.gob.gt": "Guatemala",
  "sreci.gob.hn": "Honduras",
  "cancilleria.gob.ni": "Nicaragua",
  "rree.go.cr": "Costa Rica",
  "mire.gob.pa": "Panama",
  "minrex.gob.cu": "Cuba",
  "mirex.gob.do": "Dominican Republic",
  "gov.uk": "United Kingdom",
  "exteriores.gob.es": "Spain",
  "diplomatie.gouv.fr": "France",
  "auswaertiges-amt.de": "Germany",
  "esteri.it": "Italy",
  "eeas.europa.eu": "European Union",
  "europa.eu": "European Union",
  "government.nl": "Netherlands",
  "diplomatie.belgium.be": "Belgium",
  "gov.pl": "Poland",
  "portugal.gov.pt": "Portugal",
  "government.se": "Sweden",
  "regjeringen.no": "Norway",
  "um.dk": "Denmark",
  "eda.admin.ch": "Switzerland",
  "bmeia.gv.at": "Austria",
  "dfa.ie": "Ireland",
  "mfa.gr": "Greece",
  "mzv.cz": "Czech Republic",
  "kormany.hu": "Hungary",
  "mae.ro": "Romania",
  "fmprc.gov.cn": "China",
  "mid.ru": "Russia",
  "mofa.go.jp": "Japan",
  "mofa.go.kr": "South Korea",
  "mea.gov.in": "India",
  "gov.il": "Israel",
  "mfa.gov.tr": "Turkey",
  "mfa.gov.ir": "Iran",
  "mofa.gov.sa": "Saudi Arabia",
  "mofaic.gov.ae": "UAE",
  "kemlu.go.id": "Indonesia",
  "dfa.gov.ph": "Philippines",
  "mfa.go.th": "Thailand",
  "kln.gov.my": "Malaysia",
  "mfa.gov.sg": "Singapore",
  "mofa.gov.pk": "Pakistan",
  "mofa.gov.qa": "Qatar",
  "dfat.gov.au": "Australia",
  "pm.gov.au": "Australia",
  "mfat.govt.nz": "New Zealand",
  "beehive.govt.nz": "New Zealand",
  "dirco.gov.za": "South Africa",
  "foreignaffairs.gov.ng": "Nigeria",
  "mfa.gov.eg": "Egypt",
  "mfa.go.ke": "Kenya",
  "diplomatie.gov.ma": "Morocco",
  "mae.gov.dz": "Algeria",
  "mfa.gov.bz": "Belize",
  "mfaft.gov.jm": "Jamaica",
  "foreign.gov.tt": "Trinidad and Tobago",
  "mae.gouv.ht": "Haiti",
}

function getCountryFromUrl(url: string, region: string): { country: string; countryCode: string; flag: string } {
  const regionData = GOVERNMENT_DOMAINS[region]
  if (!regionData) {
    return { country: "Unknown", countryCode: "XX", flag: "🏳️" }
  }

  for (const domain of Object.keys(regionData.countries)) {
    if (url.includes(domain)) {
      const countryName = DOMAIN_TO_COUNTRY[domain] || "Unknown"
      return {
        country: countryName,
        ...regionData.countries[domain],
      }
    }
  }

  return { country: "Unknown", countryCode: "XX", flag: "🏳️" }
}

async function fetchRssStatements(region: string, lookbackHours: number): Promise<GlobalStatement[]> {
  const allStatements: GlobalStatement[] = []
  const whenMod = pickWhenModifier(lookbackHours)

  // Determine which regions to fetch
  const regionsToFetch = region === "All" ? Object.keys(GOVERNMENT_DOMAINS) : [region]

  console.log(`[v0] RSS: Fetching ${regionsToFetch.length} regions`)

  for (const reg of regionsToFetch) {
    const regionData = GOVERNMENT_DOMAINS[reg]
    if (!regionData) continue

    // Build site filter for this region (max 10 domains per query)
    const domains = regionData.domains.slice(0, 10)
    const siteFilter = buildSiteFilter(domains)

    // Build query: Venezuela + site filter + when modifier
    const query = `Venezuela ${siteFilter} ${whenMod}`

    console.log(`[v0] RSS query for ${reg}: ${query.slice(0, 80)}...`)

    const rssUrl = buildGoogleNewsRssUrl({
      query,
      hl: "en-US",
      gl: "US",
      ceid: "US:en",
    })

    try {
      const articles = await fetchGoogleNewsArticles(rssUrl)

      for (const article of articles) {
        const isBanned = BANNED_DOMAINS.some((domain) => article.url.includes(domain))
        if (isBanned) {
          continue
        }

        // Strip HTML from content
        const cleanTitle = article.title.replace(/<[^>]*>/g, "").trim()
        const cleanSummary = (article.summary || "").replace(/<[^>]*>/g, "").trim()

        // Get country info from URL
        const countryInfo = getCountryFromUrl(article.url, reg)

        allStatements.push({
          id: `rss-${article.id}`,
          title: cleanTitle,
          content: cleanSummary,
          url: article.url,
          publishedAt: article.publishedAt,
          country: countryInfo.country,
          countryCode: countryInfo.countryCode,
          flag: countryInfo.flag,
          region: reg,
          source: article.outlet,
          sourceType: "rss",
          author: article.outlet,
          role: "Official Statement",
          isVerified: true,
        })
      }

      console.log(`[v0] RSS ${reg}: Found ${articles.length} articles`)
    } catch (error) {
      console.error(`[v0] RSS error for ${reg}:`, error)
    }

    // Small delay between region queries
    if (regionsToFetch.indexOf(reg) < regionsToFetch.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  // Deduplicate by URL
  const seen = new Set<string>()
  const deduped = allStatements.filter((s) => {
    if (seen.has(s.url)) return false
    seen.add(s.url)
    return true
  })

  console.log(`[v0] RSS: Total ${deduped.length} unique statements after deduplication`)
  return deduped
}

// =============================================================================
// X API FETCHING (Direct Tweets from Foreign Ministers)
// =============================================================================

async function fetchXStatements(region: string, lookbackHours: number): Promise<GlobalStatement[]> {
  if (!X_API_BEARER_TOKEN) {
    console.log("[v0] X_API_BEARER_TOKEN not configured, skipping X fetch")
    return []
  }

  const handles =
    region === "All"
      ? getAllForeignMinisterHandles()
      : getForeignMinisterHandlesByRegion(
          region as
            | "North America"
            | "South America"
            | "Central America"
            | "Caribbean"
            | "Europe"
            | "Asia"
            | "Oceania"
            | "Africa",
        )

  console.log(`[v0] X: Fetching from ${handles.length} foreign minister accounts`)

  const handleBatches: string[][] = []
  for (let i = 0; i < handles.length; i += X_BATCH_SIZE) {
    handleBatches.push(handles.slice(i, i + X_BATCH_SIZE))
  }

  const now = new Date()
  const startTime = new Date(now.getTime() - lookbackHours * 60 * 60 * 1000)
  const startTimeISO = startTime.toISOString()

  const allTweets: XTweet[] = []
  const allUsers: XUser[] = []
  const allMedia: XMedia[] = []
  const allIncludedTweets: XTweet[] = []

  for (let batchIndex = 0; batchIndex < handleBatches.length; batchIndex++) {
    const batch = handleBatches[batchIndex]
    const query = batch.map((h) => `from:${h}`).join(" OR ")

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
        if (response.status === 429) {
          console.log("[v0] X API rate limited, stopping X fetch")
          break
        }
        continue
      }

      const data: XApiResponse = await response.json()

      if (data.data) allTweets.push(...data.data)
      if (data.includes?.users) allUsers.push(...data.includes.users)
      if (data.includes?.media) allMedia.push(...data.includes.media)
      if (data.includes?.tweets) allIncludedTweets.push(...data.includes.tweets)
    } catch (fetchError) {
      console.error(`[v0] X fetch error (batch ${batchIndex + 1}):`, fetchError)
    }

    if (batchIndex < handleBatches.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, X_BATCH_DELAY_MS))
    }
  }

  console.log(`[v0] X: Fetched ${allTweets.length} tweets from foreign ministers`)

  // Build lookup maps
  const userMap = new Map<string, XUser>()
  for (const user of allUsers) userMap.set(user.id, user)

  const mediaMap = new Map<string, XMedia>()
  for (const media of allMedia) mediaMap.set(media.media_key, media)

  const quotedTweetMap = new Map<string, XTweet>()
  for (const tweet of allIncludedTweets) quotedTweetMap.set(tweet.id, tweet)

  // Convert to GlobalStatement format
  const results: GlobalStatement[] = allTweets.map((tweet) => {
    const user = userMap.get(tweet.author_id)
    const username = user?.username || "unknown"
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

    let quotedTweet: GlobalStatement["quotedTweet"] | undefined
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

    return {
      id: `x-${tweet.id}`,
      title: "",
      content: tweet.text,
      url: `https://x.com/${username}/status/${tweet.id}`,
      publishedAt: tweet.created_at,
      country: account?.country || "Unknown",
      countryCode: account?.countryCode || "XX",
      flag: account?.flag || "🏳️",
      region: account?.region || "Unknown",
      source: "X",
      sourceType: "x" as const,
      author: account?.name || user?.name || username,
      role: account?.role || "Government Official",
      handle: `@${username}`,
      profileImage: user?.profile_image_url?.replace("_normal", "_400x400"),
      isVerified: user?.verified || user?.verified_type === "government" || !!account,
      metrics: {
        likes: tweet.public_metrics?.like_count || 0,
        retweets: tweet.public_metrics?.retweet_count || 0,
        replies: tweet.public_metrics?.reply_count || 0,
      },
      images: images.length > 0 ? images : undefined,
      quotedTweet,
    }
  })

  return results
}

// =============================================================================
// API HANDLER
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const region = searchParams.get("region") || "All"
    const country = searchParams.get("country") || "All"
    const hoursBack = Number.parseInt(searchParams.get("hours") || "72", 10)

    console.log(`[v0] Global statements: region=${region}, country=${country}, hours=${hoursBack}`)

    // Fetch from both sources in parallel
    const [rssStatements, xStatements] = await Promise.all([
      fetchRssStatements(region, hoursBack),
      fetchXStatements(region, hoursBack),
    ])

    console.log(`[v0] Fetched ${rssStatements.length} RSS + ${xStatements.length} X statements`)

    // Combine all statements
    let allStatements = [...rssStatements, ...xStatements]

    const now = new Date()
    const maxAgeMs = MAX_STATEMENT_AGE_DAYS * 24 * 60 * 60 * 1000
    allStatements = allStatements.filter((s) => {
      const publishedDate = new Date(s.publishedAt)
      const ageMs = now.getTime() - publishedDate.getTime()
      const isRecent = ageMs <= maxAgeMs
      if (!isRecent) {
        console.log(
          `[v0] Filtering out old statement: ${s.title?.slice(0, 50)}... (age: ${Math.floor(ageMs / (24 * 60 * 60 * 1000))} days)`,
        )
      }
      return isRecent
    })

    console.log(`[v0] After age filter: ${allStatements.length} statements`)

    // Score for relevance
    const scoredStatements = await scoreStatements(allStatements)

    // Filter by relevance threshold
    let relevantStatements = scoredStatements.filter((s) => (s.relevanceScore || 0) >= RELEVANCE_THRESHOLD)

    // Filter by country if specified
    if (country !== "All") {
      relevantStatements = relevantStatements.filter((s) => s.country === country)
    }

    // Sort by date descending
    relevantStatements.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    console.log(`[v0] Returning ${relevantStatements.length} relevant statements`)

    return NextResponse.json({
      statements: relevantStatements,
      sources: {
        rss: rssStatements.length,
        x: xStatements.length,
      },
      meta: {
        region,
        country,
        hoursBack,
        totalFetched: rssStatements.length + xStatements.length,
        relevantCount: relevantStatements.length,
      },
    })
  } catch (error) {
    console.error("[v0] Global statements error:", error)
    return NextResponse.json({ error: "Failed to fetch global statements", statements: [] }, { status: 500 })
  }
}
