import { type NextRequest, NextResponse } from "next/server"
import { CONGRESS_MEMBERS, type CongressMember } from "@/lib/congress-members"
import {
  upsertCongressionalStances,
  updateStanceRefreshTime,
  getLastStanceRefresh,
  type CongressionalStanceRecord,
} from "@/lib/db/congressional-stances"
import { callOpenAI } from "@/lib/openai-fetch"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const CRON_SECRET = process.env.CRON_SECRET

const BATCH_SIZE = 5
const DC_LOCATION = {
  type: "approximate",
  country: "US",
  city: "Washington",
  region: "DC",
}

function getMemberName(member: CongressMember): string {
  return member.name || member.fullName || "Unknown"
}

async function analyzeCongressBatch(members: CongressMember[], batchLabel: string): Promise<CongressionalStanceRecord[]> {
  const results: CongressionalStanceRecord[] = []

  const memberNames = members.map((m) => `${getMemberName(m)} (${m.party}-${m.state})`).join(", ")

  console.log(`[CRON] ${batchLabel}: Analyzing ${members.length} members: ${memberNames}`)

  const prompt = `You are a JSON API. Respond ONLY with a valid JSON array. No text before or after.

Search the web for statements, votes, interviews, floor speeches, english media articles, and X/Twitter posts (very important) from these US Congress members about Venezuela from DECEMBER 2025 onwards, with emphasis on statements made in 2026:

${memberNames}

For EACH member listed above, find their public position on Venezuela by searching for statements FROM DECEMBER 2025 TO PRESENT:
- Statements supporting or opposing María Corina Machado and the Venezuelan democratic opposition from December 2025 onwards
- Calls for free and fair elections in Venezuela from December 2025 onwards
- Positions on the Delcy Rodríguez interim government (which took power after Maduro's departure) from December 2025 onwards
- Statements on recognizing or engaging with the Rodríguez government vs. the opposition from December 2025 onwards
- Tweets or X posts about Venezuela's political transition, MCM, Delcy Rodríguez, or elections from December 2025 onwards
- Floor speeches, interviews, or press statements about Venezuela's democratic future from December 2025 onwards
- Votes or co-sponsorships on Venezuela-related resolutions regarding elections or opposition recognition from December 2025 onwards

Classify each member's stance:
- "ally" = Has made explicit statements supporting María Corina Machado, the democratic opposition, or calling for free elections. Opposes normalization with the Rodríguez interim government.
- "neutral" = No clear public statements found about Venezuela's opposition, MCM, elections, or the Rodríguez government since December 2025.
- "normalizer" = Supports diplomatic engagement with or recognition of the Delcy Rodríguez interim government. Advocates for accepting the political status quo. May oppose sanctions or pressure tactics against the current regime.

Return ONLY this JSON format:
[{"name":"Full Name","stance":"ally|neutral|normalizer","confidence":0.8,"evidence":[{"url":"https://...","title":"Title","snippet":"Brief quote"}],"analysisNotes":"Brief summary"}]`

  try {
    const { responseText } = await callOpenAI(OPENAI_API_KEY!, {
      instructions: "You are a JSON API that only outputs valid JSON arrays.",
      input: prompt,
      tools: [{ type: "web_search", user_location: DC_LOCATION }],
      tool_choice: "auto",
      temperature: 0,
    })

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

    let analysisResults: any[] = []

    try {
      const directParse = JSON.parse(content.trim())
      if (Array.isArray(directParse)) {
        analysisResults = directParse
      }
    } catch {
      const jsonMatch = content.match(/\[\s*\{[\s\S]*?\}\s*\]|\[\s*\]/)
      if (jsonMatch) {
        analysisResults = JSON.parse(jsonMatch[0])
      }
    }

    for (const member of members) {
      const memberName = getMemberName(member)
      const memberLastName = memberName.split(" ").pop()?.toLowerCase() || ""

      const analysis = analysisResults.find((a: any) => {
        const aName = (a.name || a.fullName || "").toLowerCase()
        return aName === memberName.toLowerCase() || aName.includes(memberLastName)
      })

      let mappedStance: CongressionalStanceRecord["stance"] = "neutral"
      if (analysis?.stance) {
        const stanceLower = analysis.stance.toLowerCase().replace(/\s+/g, "-")
        if (["ally", "neutral", "normalizer"].includes(stanceLower)) {
          mappedStance = stanceLower as CongressionalStanceRecord["stance"]
        }
      }

      results.push({
        member_name: memberName,
        chamber: member.chamber as "Senate" | "House",
        party: member.party,
        state: member.state,
        district: member.district,
        stance: mappedStance,
        confidence: analysis?.confidence || 0,
        analysis_notes: analysis?.analysisNotes,
        evidence: (analysis?.evidence || []).map((e: any) => ({
          title: e.title || "",
          snippet: e.snippet || "",
          source: e.url?.includes("x.com") || e.url?.includes("twitter.com") ? "x" : "web",
          url: e.url,
        })),
      })

      console.log(`[CRON] ${batchLabel}: ${memberName}: ${mappedStance}`)
    }
  } catch (error) {
    console.error(`[CRON] ${batchLabel}: Batch analysis error:`, error)
    for (const member of members) {
      results.push({
        member_name: getMemberName(member),
        chamber: member.chamber as "Senate" | "House",
        party: member.party,
        state: member.state,
        district: member.district,
        stance: "neutral",
        confidence: 0,
        analysis_notes: "Analysis failed",
        evidence: [],
      })
    }
  }

  return results
}

// This endpoint can be called by Vercel Cron or manually
export async function GET(request: NextRequest) {
  // Verify cron secret if provided (for Vercel Cron)
  const authHeader = request.headers.get("authorization")
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    // Allow manual refresh without secret for now
    console.log("[CRON] Running manual refresh (no cron secret)")
  }

  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 })
    }

    // Check last refresh - only run if more than 20 hours since last refresh
    const lastRefresh = await getLastStanceRefresh()
    if (lastRefresh) {
      const hoursSinceRefresh = (Date.now() - new Date(lastRefresh).getTime()) / (1000 * 60 * 60)
      if (hoursSinceRefresh < 20) {
        return NextResponse.json({
          skipped: true,
          message: `Last refresh was ${hoursSinceRefresh.toFixed(1)} hours ago. Skipping.`,
          lastRefresh,
        })
      }
    }

    console.log(`[CRON] Starting congressional stance refresh for ${CONGRESS_MEMBERS.length} members`)

    const allResults: CongressionalStanceRecord[] = []
    const PARALLEL_BATCHES = 2
    
    // Process in batches
    for (let i = 0; i < CONGRESS_MEMBERS.length; i += BATCH_SIZE * PARALLEL_BATCHES) {
      const batchMembers = CONGRESS_MEMBERS.slice(i, i + BATCH_SIZE * PARALLEL_BATCHES)
      const batches: CongressMember[][] = []

      for (let j = 0; j < batchMembers.length; j += BATCH_SIZE) {
        batches.push(batchMembers.slice(j, Math.min(j + BATCH_SIZE, batchMembers.length)))
      }

      const batchResults = await Promise.all(
        batches.map((batch, idx) => analyzeCongressBatch(batch, `Batch ${Math.floor(i / BATCH_SIZE) + idx + 1}`))
      )

      allResults.push(...batchResults.flat())

      // Small delay between batch groups
      if (i + BATCH_SIZE * PARALLEL_BATCHES < CONGRESS_MEMBERS.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    // Save to database
    await upsertCongressionalStances(allResults)
    await updateStanceRefreshTime()

    console.log(`[CRON] Refresh complete. Saved ${allResults.length} stances.`)

    return NextResponse.json({
      success: true,
      totalProcessed: allResults.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[CRON] Refresh failed:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Refresh failed" },
      { status: 500 }
    )
  }
}
