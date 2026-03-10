import { type NextRequest, NextResponse } from "next/server"
import { ARTICLE_TOPICS } from "@/lib/media-outlets"
import { getMediaArticles, upsertMediaArticles, type MediaArticleRecord } from "@/lib/db/media-articles"
import { updateFeedMetadata } from "@/lib/db/tweets"
import { createClient } from "@supabase/supabase-js"

export const maxDuration = 60

const ENGLISH_OUTLET_GROUPS = [
  {
    name: "US Major Papers & Wire Services",
    context: `English media sources to search:
- The New York Times - Major US newspaper
- The Washington Post - Major US newspaper
- The Wall Street Journal - Business newspaper
- Los Angeles Times - West coast newspaper
- AP News - Major wire service
- Reuters - Major wire service
- Miami Herald - Key South Florida outlet with Latin America focus`,
  },
  {
    name: "US Networks & Magazines",
    context: `English media sources to search:
- CNN - Major TV network
- ABC News - Major TV network
- NBC News - Major TV network
- CBS News - Major TV network
- NPR - Public broadcasting
- PBS - Public broadcasting
- Bloomberg - Business news
- The Economist - News magazine
- Time Magazine - News magazine`,
  },
  {
    name: "UK & International English",
    context: `English media sources to search:
- BBC - UK public broadcaster
- Financial Times - UK business newspaper
- The Guardian - UK newspaper
- The Times - UK newspaper
- The Telegraph - UK newspaper
- The Independent - UK newspaper`,
  },
]

const SPANISH_OUTLET_GROUPS = [
  {
    name: "Spain & Mexico",
    context: `Fuentes en español para buscar:
- El País (España)
- El Mundo (España)
- ABC España (España)
- La Vanguardia (España)
- Reforma (México)
- El Universal(México)
- Agencia EFE (México)`,
  },
  {
    name: "South America",
    context: `Fuentes en español para buscar:
- Clarín (Argentina)
- La Nación Argentina (Argentina)
- El Tiempo Colombia (Colombia)
- Semana - Colombian (Colombia)
- El Mercurio (Chile)`,
  },
  {
    name: "US Spanish & International",
    context: `Fuentes en español para buscar:
- Univisión (Televisora hispana en EEUU)
- Telemundo (Televisora hispana en EEUU)
- CNN en Español (Televisora hispana en EEUU)
- BBC Mundo - (Televisora internacional)
- DW Español - (Televisora alemana internacional)
- VOA Noticias - Voice of America Spanish
- Euronews en Español - European Spanish service`,
  },
]

const VENEZUELAN_OUTLET_GROUPS = [
  {
    name: "Venezuelan News Sites",
    context: `Fuentes venezolanas independientes para buscar:
- La Patilla (Página de noticias venezolana)
- El Pitazo (Página de noticias venezolana)
- Efecto Cocuyo (Página de noticias venezolana)`,
  },
  {
    name: "Venezuelan Newspapers",
    context: `Fuentes venezolanas independientes para buscar:
- El Nacional (Periódico venezolano)
- Tal Cual (Periódico venezolano)
- Runrunes (Página de noticias venezolana)`,
  },
]

const REGIME_OUTLET_GROUPS = [
  {
    name: "Venezuelan State Media",
    context: `Pro-Maduro media venezolano (para perspectivas alternativas):
- VTV (Venezolana de Televisión) 
- Telesur (televisora del régimen)
- Últimas Noticias (periódico del régimen)
- Globovisión - Venezuelan TV (televisora del régimen)
- Correo del Orinoco (periódico del régimen)
- Agencia Venezolana de Noticias (AVN)`,
  },
  {
    name: "Allied International Media",
    context: `Pro-Maduro media internacional (para perspectivas alternativas):
- Venezuela Analysis (página de análisis pro-régimen)
- TVes (televisora del régimen)
- La Iguana TV (página de noticias pro-régimen)
- Russia Today (televisora del régimen ruso)
- HispanTV (televisora del régimen iraní)`,
  },
]

const OUTLET_CONTEXT = {
  world: `
International media sources to search:
- Le Monde, France24 - French outlets
- Deutsche Welle, Der Spiegel, Frankfurter Allgemeine Zeitung - German outlets
- The Spectator - UK magazine
- Haaretz, The Jerusalem Post, The Times of Israel, Ynet News, Israel Hayom, Globes - Israeli media
- Al Jazeera, Arab News, The National UAE - Middle East outlets
- South China Morning Post - Hong Kong outlet
- The Hindu, The Japan Times, NHK, The Straits Times - Asian media
- Daily Maverick, Mail & Guardian - South African outlets
- Folha de São Paulo, O Globo - Brazilian newspapers
- The Globe and Mail - Canadian newspaper
- The Sydney Morning Herald - Australian newspaper`,
}

const MIAMI_LOCATION = {
  type: "approximate",
  country: "US",
  city: "Miami",
  region: "Florida",
}

const CARACAS_LOCATION = {
  type: "approximate",
  country: "VE",
  city: "Caracas",
  region: "Distrito Capital",
}

const TOPIC_TAGS = ARTICLE_TOPICS.join(", ")

async function searchOutletGroup(
  groupName: string,
  outletContext: string,
  category: string,
  languageHint: string,
  currentDateStr: string,
  lookbackHours: number,
  location: typeof MIAMI_LOCATION = MIAMI_LOCATION,
): Promise<any[]> {
  const prompt = `You are a JSON API. You MUST respond with ONLY a valid JSON array. No text before or after. No markdown. No explanation.

Search the web for news articles about Venezuela's current situation from the last ${lookbackHours} hours. Current time: ${currentDateStr}

SEARCH TOPICS (find articles about ANY of these):
- Operation Southern Spear 
- US troop movements associated with Venezuela
- US military deployments to the Caribbean related to Venezuela
- Venezuela
- Maria Corina Machado (Venezuelan opposition leader)
- Nicolas Maduro (Venezuelan president)
- Jorge Rodriguez (Venezuelan National Assembly president)
- Diosdado Cabello (Venezuelan interior minister)
- Edmundo González Urrutia (opposition presidential candidate)
- Venezuela sanctions, oil exports, migration crisis
- Venezuela-US relations, diplomatic tensions
- Humanitarian situation in Venezuela
- Narco-trafficking and Venezuela
- Human rights in Venezuela

${languageHint}

${outletContext}

For each article, assign relevant topic tags from this list: ${TOPIC_TAGS}

RESPOND WITH ONLY THIS JSON FORMAT - NOTHING ELSE:
[{"id":"slug","title":"headline","outlet":"source name","category":"${category}","summary":"2-3 sentence summary","url":"https://...","publishedAt":"ISO date","topics":["topic1","topic2"]}]

If no articles found, respond with exactly: []`

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-5.1",
      instructions:
        "You are a JSON API that only outputs valid JSON arrays. Never include any text, markdown, or explanation. Only output the JSON array.",
      input: prompt,
      tools: [
        {
          type: "web_search",
          user_location: location,
        },
      ],
      tool_choice: "auto",
      temperature: 0,
    }),
  })

  const responseText = await response.text()
  console.log(`[v0] ${category} - ${groupName} API status:`, response.status)

  if (!response.ok) {
    console.error(`[v0] OpenAI API error for ${category} - ${groupName}:`, response.status, responseText)
    return []
  }

  try {
    const data = JSON.parse(responseText)

    let content = ""

    if (data.output_text) {
      content = data.output_text
    } else if (data.output && Array.isArray(data.output)) {
      for (const item of data.output) {
        if (item.type === "message" && item.content) {
          for (const contentItem of item.content) {
            if (contentItem.type === "output_text") {
              content += contentItem.text
            }
          }
        }
      }
    }

    console.log(`[v0] ${category} - ${groupName} content length:`, content.length)

    try {
      const directParse = JSON.parse(content.trim())
      if (Array.isArray(directParse)) {
        console.log(`[v0] ${category} - ${groupName}: parsed ${directParse.length} articles`)
        return directParse.map((a: any) => ({ ...a, category }))
      }
    } catch {
      // Fall back to regex extraction
    }

    const jsonMatch = content.match(/\[\s*\{[\s\S]*?\}\s*\]|\[\s*\]/)
    if (jsonMatch) {
      const articles = JSON.parse(jsonMatch[0])
      console.log(`[v0] ${category} - ${groupName}: regex parsed ${articles.length} articles`)
      return articles.map((a: any) => ({ ...a, category }))
    }

    console.log(`[v0] ${category} - ${groupName} no JSON array found`)
  } catch (e) {
    console.error(`[v0] ${category} - ${groupName} parse error:`, e)
  }

  return []
}

async function searchEnglish(currentDateStr: string, lookbackHours: number): Promise<any[]> {
  const languageHint = "Search in English."

  const results = await Promise.all(
    ENGLISH_OUTLET_GROUPS.map((group) =>
      searchOutletGroup(group.name, group.context, "English", languageHint, currentDateStr, lookbackHours),
    ),
  )

  const allArticles = results.flat()
  console.log(`[v0] English total: ${allArticles.length} articles from ${ENGLISH_OUTLET_GROUPS.length} groups`)
  return allArticles
}

async function searchSpanish(currentDateStr: string, lookbackHours: number): Promise<any[]> {
  const languageHint = "Search in Spanish."

  const results = await Promise.all(
    SPANISH_OUTLET_GROUPS.map((group) =>
      searchOutletGroup(group.name, group.context, "Spanish", languageHint, currentDateStr, lookbackHours),
    ),
  )

  const allArticles = results.flat()
  console.log(`[v0] Spanish total: ${allArticles.length} articles from ${SPANISH_OUTLET_GROUPS.length} groups`)
  return allArticles
}

async function searchVenezuelan(currentDateStr: string, lookbackHours: number): Promise<any[]> {
  const languageHint = "Search in Spanish. Focus on Venezuelan news sources."

  const results = await Promise.all(
    VENEZUELAN_OUTLET_GROUPS.map((group) =>
      searchOutletGroup(
        group.name,
        group.context,
        "Venezuelan",
        languageHint,
        currentDateStr,
        lookbackHours,
        CARACAS_LOCATION,
      ),
    ),
  )

  const allArticles = results.flat()
  console.log(`[v0] Venezuelan total: ${allArticles.length} articles from ${VENEZUELAN_OUTLET_GROUPS.length} groups`)
  return allArticles
}

async function searchRegime(currentDateStr: string, lookbackHours: number): Promise<any[]> {
  const languageHint = "Search in Spanish. Focus on pro-government Venezuelan and allied media sources."

  const results = await Promise.all(
    REGIME_OUTLET_GROUPS.map((group) =>
      searchOutletGroup(
        group.name,
        group.context,
        "Regime",
        languageHint,
        currentDateStr,
        lookbackHours,
        CARACAS_LOCATION,
      ),
    ),
  )

  const allArticles = results.flat()
  console.log(`[v0] Regime total: ${allArticles.length} articles from ${REGIME_OUTLET_GROUPS.length} groups`)
  return allArticles
}

async function searchCategory(category: "World", currentDateStr: string, lookbackHours: number): Promise<any[]> {
  const outletContext = OUTLET_CONTEXT.world
  const languageHint = "Search in English, Spanish, French, German, Portuguese, and other languages."

  return searchOutletGroup(
    category,
    outletContext,
    category,
    languageHint,
    currentDateStr,
    lookbackHours,
    MIAMI_LOCATION,
  )
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lookbackHours = Number.parseInt(searchParams.get("lookbackHours") || "24")
  const category = searchParams.get("category") || undefined

  try {
    const dbArticles = await getMediaArticles({ lookbackHours, limit: 100, category })
    if (dbArticles.length > 0) {
      console.log("[v0] Returning", dbArticles.length, "media articles from database")
      const articles = dbArticles.map((a) => ({
        id: a.id,
        title: a.title,
        outlet: a.source,
        category: a.category || "English",
        summary: a.snippet,
        url: a.url,
        publishedAt: a.published_at,
        topics: a.topics || [],
      }))
      return NextResponse.json({
        articles,
        fetchedAt: new Date().toISOString(),
        source: "database",
      })
    }
  } catch (dbError) {
    console.error("[v0] Database read error:", dbError)
  }

  return NextResponse.json({ articles: [], source: "database" })
}

export async function POST(request: NextRequest) {
  try {
    const { category = "All", lookbackHours = 24, refresh = false } = await request.json()

    if (!refresh) {
      try {
        const dbArticles = await getMediaArticles({
          lookbackHours,
          limit: 100,
          category: category !== "All" ? category : undefined,
        })
        if (dbArticles.length > 0) {
          console.log("[v0] Returning", dbArticles.length, "media articles from database")
          const articles = dbArticles.map((a) => ({
            id: a.id,
            title: a.title,
            outlet: a.source,
            category: a.category || "English",
            summary: a.snippet,
            url: a.url,
            publishedAt: a.published_at,
            topics: a.topics || [],
          }))
          return NextResponse.json({
            articles,
            fetchedAt: new Date().toISOString(),
            category,
            lookbackHours,
            source: "database",
          })
        }
      } catch (dbError) {
        console.error("[v0] Database read error:", dbError)
      }
    }

    const now = new Date()
    const currentDateStr = now.toISOString()

    console.log("[v0] Media articles request:", { category, lookbackHours, currentDateStr })

    let allArticles: any[] = []

    if (category === "All") {
      const [english, spanish, venezuelan, world] = await Promise.all([
        searchEnglish(currentDateStr, lookbackHours),
        searchSpanish(currentDateStr, lookbackHours),
        searchVenezuelan(currentDateStr, lookbackHours),
        searchCategory("World", currentDateStr, lookbackHours),
      ])
      allArticles = [...english, ...spanish, ...venezuelan, ...world]
      console.log(
        `[v0] Combined: English=${english.length}, Spanish=${spanish.length}, Venezuelan=${venezuelan.length}, World=${world.length}`,
      )
    } else if (category === "English") {
      allArticles = await searchEnglish(currentDateStr, lookbackHours)
    } else if (category === "Spanish") {
      allArticles = await searchSpanish(currentDateStr, lookbackHours)
    } else if (category === "Venezuelan") {
      allArticles = await searchVenezuelan(currentDateStr, lookbackHours)
    } else if (category === "Regime") {
      allArticles = await searchRegime(currentDateStr, lookbackHours)
    } else if (category === "World") {
      allArticles = await searchCategory("World", currentDateStr, lookbackHours)
    }

    allArticles.sort((a, b) => {
      const dateA = new Date(a.publishedAt || 0).getTime()
      const dateB = new Date(b.publishedAt || 0).getTime()
      return dateB - dateA
    })

    try {
      const dbRecords: MediaArticleRecord[] = allArticles.map((a) => ({
        title: a.title,
        snippet: a.summary,
        source: a.outlet,
        url: a.url,
        category: a.category,
        published_at: a.publishedAt || new Date().toISOString(),
        topics: a.topics || [],
      }))

      await upsertMediaArticles(dbRecords)
      await updateFeedMetadata("media" as any, undefined, lookbackHours)
      console.log("[v0] Saved", dbRecords.length, "media articles to database")
    } catch (dbError) {
      console.error("[v0] Database save error:", dbError)
    }

    console.log("[v0] Total articles:", allArticles.length)

    return NextResponse.json({
      articles: allArticles,
      fetchedAt: new Date().toISOString(),
      category,
      lookbackHours,
      source: "api",
    })
  } catch (error) {
    console.error("[v0] Media articles error:", error)
    return NextResponse.json({ articles: [], error: String(error) }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Delete all media articles
    const { error: articlesError } = await supabase
      .from("media_articles")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000") // Delete all rows

    if (articlesError) {
      console.error("[v0] Error deleting media articles:", articlesError)
      return NextResponse.json({ error: articlesError.message }, { status: 500 })
    }

    // Also clear feed metadata for media
    await supabase.from("feed_metadata").delete().eq("feed_type", "media")

    console.log("[v0] Media articles deleted successfully")

    return NextResponse.json({ success: true, message: "All media articles deleted" })
  } catch (error) {
    console.error("[v0] Delete error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
