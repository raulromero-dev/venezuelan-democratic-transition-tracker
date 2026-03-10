import { type NextRequest, NextResponse } from "next/server"
import { getGlobalIntel, upsertGlobalIntel, type GlobalIntelRecord } from "@/lib/db/global-intel"
import { updateFeedMetadata } from "@/lib/db/tweets"

export const maxDuration = 60

const MIAMI_LOCATION = {
  type: "approximate",
  country: "US",
  city: "Miami",
  region: "Florida",
}

const REGION_CONTEXT = {
  "Latin America": `
Latin American sources to search:
- Reuters Latin America, AP, AFP - Wire services with regional bureaus
- Infobae, Clarín, La Nación (Argentina) - Major Argentine outlets
- Folha de S.Paulo, O Globo, UOL (Brazil) - Major Brazilian newspapers
- El Tiempo, El Espectador (Colombia) - Colombian newspapers
- El Comercio, El Universo (Ecuador/Peru) - Andean outlets
- NTN24 - Colombian 24-hour news with Latin America focus
- Government press releases from Argentina, Brazil, Colombia, Chile`,

  "EU & UK": `
European & UK sources to search:
- BBC News, The Guardian, Financial Times, Reuters UK - Major UK outlets
- EU Observer, Euronews, Politico Europe - EU-focused news
- El País, El Mundo (Spain) - Spanish newspapers with Venezuela coverage
- Le Monde, France 24 (France) - French outlets
- Deutsche Welle, Der Spiegel (Germany) - German outlets
- European Commission and European Parliament press releases
- UK Foreign Office statements`,

  "Intl Orgs": `
International organization sources to search:
- UN News, UNHCR, OHCHR - United Nations agencies
- OAS (Organization of American States) press releases
- Human Rights Watch, Amnesty International - Human rights groups
- International Crisis Group - Conflict analysis
- Reuters, AP, AFP - Wire services covering international bodies
- IACHR (Inter-American Commission on Human Rights)`,

  China: `
China-related sources to search:
- Xinhua News Agency - Official Chinese state news agency
- CGTN, China Daily, Global Times - Chinese state media with English coverage
- South China Morning Post - Hong Kong-based outlet covering China
- Reuters, AP, AFP - Wire services covering China-Venezuela relations
- Chinese Ministry of Foreign Affairs statements
- Chinese Embassy statements on Venezuela
- Academic and think tank reports on China-Venezuela relations
- Belt and Road Initiative coverage related to Venezuela
- Trade and economic agreements between China and Venezuela
- Chinese investment in Venezuelan oil sector`,
}

async function searchRegion(
  region: "Latin America" | "EU & UK" | "Intl Orgs" | "China",
  currentDateStr: string,
  lookbackHours: number,
): Promise<any[]> {
  const now = new Date()
  const cutoff = new Date(now.getTime() - lookbackHours * 60 * 60 * 1000)

  const prompt = `You are a JSON API. You MUST respond with ONLY a valid JSON array. No text before or after. No markdown. No explanation.

Search the web for recent news and statements about Venezuela from ${region} sources.

SEARCH TOPICS (find content about ANY of these):
- Venezuela political crisis, Maduro government
- Maria Corina Machado (Venezuelan opposition leader)
- Edmundo González Urrutia (opposition presidential candidate)
- Nicolas Maduro, Diosdado Cabello, Jorge Rodriguez (Venezuelan government)
- Venezuela sanctions, diplomatic recognition
- Venezuela migration crisis, refugees
- Venezuela humanitarian situation
- Operation Southern Spear / US military in Caribbean
- Regional diplomatic responses to Venezuela

${REGION_CONTEXT[region]}

Focus on ${region} sources and perspectives.

RESPOND WITH ONLY THIS JSON FORMAT - NOTHING ELSE:
[{"id":"unique-slug","type":"statement|article|report","author":"Person or institution name","role":"Title or position","region":"${region}","title":"Brief headline","content":"2-3 sentence summary","url":"https://source-url","publishedAt":"YYYY-MM-DD","source":"Source name"}]

If no items found, respond with exactly: []`

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
      tools: [{ type: "web_search", user_location: MIAMI_LOCATION }],
      tool_choice: "auto",
      temperature: 0,
    }),
  })

  const responseText = await response.text()
  console.log(`[v0] Global Intel ${region} API status:`, response.status)

  if (!response.ok) {
    console.error(`[v0] Global Intel ${region} API error:`, responseText.substring(0, 500))
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
            if (contentItem.type === "output_text" && contentItem.text) {
              content += contentItem.text
            } else if (contentItem.type === "text" && contentItem.text) {
              content += contentItem.text
            }
          }
        }
      }
    }

    console.log(`[v0] Global Intel ${region} CONTENT LENGTH:`, content.length)

    try {
      const parsed = JSON.parse(content.trim())
      if (Array.isArray(parsed)) {
        console.log(`[v0] Global Intel ${region} PARSED ${parsed.length} items`)
        const filtered = parsed.filter((item: any) => {
          if (!item.publishedAt) {
            console.log(`[v0] Global Intel ${region} - Including item (no date): ${item.title?.substring(0, 50)}`)
            return true
          }
          const itemDate = new Date(item.publishedAt)
          if (isNaN(itemDate.getTime())) {
            console.log(
              `[v0] Global Intel ${region} - Including item (invalid date "${item.publishedAt}"): ${item.title?.substring(0, 50)}`,
            )
            return true
          }
          const isRecent = itemDate >= cutoff
          if (!isRecent) {
            console.log(
              `[v0] Global Intel ${region} - Filtered out (too old ${item.publishedAt}): ${item.title?.substring(0, 50)}`,
            )
          }
          return isRecent
        })
        console.log(`[v0] Global Intel ${region} after filtering: ${filtered.length} items`)
        return filtered.map((a: any) => ({ ...a, region }))
      }
    } catch {
      const jsonMatch = content.match(/\[\s*\{[\s\S]*?\}\s*\]|\[\s*\]/)
      if (jsonMatch) {
        const items = JSON.parse(jsonMatch[0])
        console.log(`[v0] Global Intel ${region} REGEX PARSED ${items.length} items`)
        const filtered = items.filter((item: any) => {
          if (!item.publishedAt) return true
          const itemDate = new Date(item.publishedAt)
          if (isNaN(itemDate.getTime())) return true
          return itemDate >= cutoff
        })
        console.log(`[v0] Global Intel ${region} after filtering: ${filtered.length} items`)
        return filtered.map((a: any) => ({ ...a, region }))
      }
    }

    console.log(`[v0] Global Intel ${region} NO RESULTS`)
    return []
  } catch (e) {
    console.error(`[v0] Global Intel ${region} PARSE ERROR:`, e)
    return []
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lookbackHours = Number.parseInt(searchParams.get("lookbackHours") || "168")
  const country = searchParams.get("country") || undefined

  try {
    const dbItems = await getGlobalIntel({ lookbackHours, limit: 100, country })
    if (dbItems.length > 0) {
      console.log("[v0] Returning", dbItems.length, "global intel items from database")
      const items = dbItems.map((i) => ({
        id: i.id,
        type: "statement",
        author: i.leader_name,
        role: i.leader_title,
        region: i.country,
        title: i.statement.substring(0, 100),
        content: i.statement,
        url: i.source_url || "",
        publishedAt: i.statement_date,
        source: i.source || "",
      }))
      return NextResponse.json({
        items,
        fetchedAt: new Date().toISOString(),
        source: "database",
      })
    }
  } catch (dbError) {
    console.error("[v0] Database read error:", dbError)
  }

  return NextResponse.json({ items: [], source: "database" })
}

export async function POST(request: NextRequest) {
  try {
    const { region = "All", lookbackHours = 48, refresh = false } = await request.json()

    if (!refresh) {
      try {
        const dbItems = await getGlobalIntel({ lookbackHours, limit: 100 })
        if (dbItems.length > 0) {
          console.log("[v0] Returning", dbItems.length, "global intel items from database")
          const items = dbItems.map((i) => ({
            id: i.id,
            type: "statement",
            author: i.leader_name,
            role: i.leader_title,
            region: i.country,
            title: i.statement.substring(0, 100),
            content: i.statement,
            url: i.source_url || "",
            publishedAt: i.statement_date,
            source: i.source || "",
          }))
          return NextResponse.json({
            items,
            fetchedAt: new Date().toISOString(),
            region,
            lookbackHours,
            source: "database",
          })
        }
      } catch (dbError) {
        console.error("[v0] Database read error:", dbError)
      }
    }

    const currentDateStr = new Date().toISOString()

    console.log("[v0] Global Intel request:", { region, lookbackHours, currentDateStr })

    let allItems: any[] = []

    if (region === "All") {
      const [latam, euuk, intl, china] = await Promise.all([
        searchRegion("Latin America", currentDateStr, lookbackHours),
        searchRegion("EU & UK", currentDateStr, lookbackHours),
        searchRegion("Intl Orgs", currentDateStr, lookbackHours),
        searchRegion("China", currentDateStr, lookbackHours),
      ])
      allItems = [...latam, ...euuk, ...intl, ...china]
      console.log(
        `[v0] Global Intel Combined: LatAm=${latam.length}, EU&UK=${euuk.length}, IntlOrgs=${intl.length}, China=${china.length}`,
      )
    } else {
      const regionMap: Record<string, "Latin America" | "EU & UK" | "Intl Orgs" | "China"> = {
        LatAm: "Latin America",
        "EU & UK": "EU & UK",
        "Intl Orgs": "Intl Orgs",
        China: "China",
      }
      allItems = await searchRegion(regionMap[region] || "Latin America", currentDateStr, lookbackHours)
    }

    allItems.sort((a, b) => {
      const dateA = new Date(a.publishedAt || 0).getTime()
      const dateB = new Date(b.publishedAt || 0).getTime()
      return dateB - dateA
    })

    try {
      const dbRecords: GlobalIntelRecord[] = allItems.map((i) => ({
        leader_name: i.author || "Unknown",
        leader_title: i.role || "",
        country: i.region || "",
        statement: i.content || i.title || "",
        stance: i.type,
        source: i.source,
        source_url: i.url,
        statement_date: i.publishedAt || new Date().toISOString(),
      }))

      await upsertGlobalIntel(dbRecords)
      await updateFeedMetadata("global-intel" as any, undefined, lookbackHours)
      console.log("[v0] Saved", dbRecords.length, "global intel items to database")
    } catch (dbError) {
      console.error("[v0] Database save error:", dbError)
    }

    console.log("[v0] Global Intel total items:", allItems.length)

    return NextResponse.json({
      items: allItems,
      fetchedAt: new Date().toISOString(),
      region,
      lookbackHours,
      source: "api",
    })
  } catch (error) {
    console.error("[v0] Global Intel error:", error)
    return NextResponse.json({ items: [], error: String(error) }, { status: 500 })
  }
}
