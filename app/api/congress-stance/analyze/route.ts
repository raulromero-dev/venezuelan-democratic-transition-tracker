import { type NextRequest, NextResponse } from "next/server"
import { CONGRESS_MEMBERS, type CongressMember } from "@/lib/congress-members"
import type { CongressMemberStance, CongressionalStance } from "@/lib/congressional-stance-types"
import {
  upsertCongressionalStances,
  updateStanceRefreshTime,
  type CongressionalStanceRecord,
} from "@/lib/db/congressional-stances"
import { callOpenAI } from "@/lib/openai-fetch"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

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

async function analyzeCongressBatch(members: CongressMember[], batchLabel: string): Promise<CongressMemberStance[]> {
  const results: CongressMemberStance[] = []

  const memberNames = members.map((m) => `${getMemberName(m)} (${m.party}-${m.state})`).join(", ")

  console.log(`[v0] ${batchLabel}: Analyzing ${members.length} members: ${memberNames}`)

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
- Statements in congress or media (YouTube, Fox, CNN, Politico, New York Times, Washington Post, Wall Street Journal, other forms of media) about Venezuela from December 2025 onwards

Classify each member's stance based on their position on Venezuela's democratic opposition and the Delcy Rodríguez interim government:
- "ally" = Has made explicit statements supporting María Corina Machado, the democratic opposition, or calling for free elections. Opposes normalization with the Rodríguez interim government.
- "neutral" = No clear public statements found about Venezuela's opposition, MCM, elections, or the Rodríguez government since December 2025.
- "normalizer" = Supports diplomatic engagement with or recognition of the Delcy Rodríguez interim government. Advocates for accepting the political status quo. May oppose sanctions or pressure tactics against the current regime.

IMPORTANT: You MUST return an entry for EACH of the ${members.length} members listed above.

Return ONLY this JSON format:
[{"name":"Full Name","stance":"ally|neutral|normalizer","confidence":0.8,"evidence":[{"url":"https://...","title":"Title","snippet":"Brief quote or description"}],"analysisNotes":"Brief summary of their position"}]`

  try {
    console.log(`[v0] ${batchLabel}: Calling OpenAI for congressional analysis...`)

    const { responseText, model } = await callOpenAI(OPENAI_API_KEY!, {
      instructions:
        "You are a JSON API that only outputs valid JSON arrays. Never include any text, markdown, or explanation. Only output the JSON array.",
      input: prompt,
      tools: [{ type: "web_search", user_location: DC_LOCATION }],
      tool_choice: "auto",
      temperature: 0,
    })

    const data = JSON.parse(responseText)
    console.log(`[v0] ${batchLabel}: ${model} response received`)

    // Extract text from response
    let content = ""

    if (data.output_text) {
      content = data.output_text
      console.log(`[v0] ${batchLabel}: Found output_text directly (${content.length} chars)`)
    } else if (data.output && Array.isArray(data.output)) {
      console.log(`[v0] ${batchLabel}: Output array has ${data.output.length} items`)
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

    console.log(`[v0] ${batchLabel}: Response text preview: ${content.substring(0, 300)}`)

    // Parse JSON from response
    let analysisResults: any[] = []

    try {
      const directParse = JSON.parse(content.trim())
      if (Array.isArray(directParse)) {
        analysisResults = directParse
        console.log(`[v0] ${batchLabel}: Direct JSON parse succeeded: ${analysisResults.length} items`)
      }
    } catch {
      // Fall back to regex extraction
      const jsonMatch = content.match(/\[\s*\{[\s\S]*?\}\s*\]|\[\s*\]/)
      if (jsonMatch) {
        analysisResults = JSON.parse(jsonMatch[0])
        console.log(`[v0] ${batchLabel}: Regex JSON parse succeeded: ${analysisResults.length} items`)
      } else {
        console.log(`[v0] ${batchLabel}: No JSON array found in response`)
      }
    }

    // Map results back to members
    for (const member of members) {
      const memberName = getMemberName(member)
      const memberLastName = memberName.split(" ").pop()?.toLowerCase() || ""

      const analysis = analysisResults.find((a: any) => {
        const aName = (a.name || a.fullName || "").toLowerCase()
        return aName === memberName.toLowerCase() || aName.includes(memberLastName)
      })

      let mappedStance: CongressionalStance = "neutral"
      if (analysis?.stance) {
        const stanceLower = analysis.stance.toLowerCase().replace(/\s+/g, "-")
        if (["ally", "neutral", "normalizer"].includes(stanceLower)) {
          mappedStance = stanceLower as CongressionalStance
        }
      }

      const stance: CongressMemberStance = {
        memberId: memberName,
        fullName: memberName,
        chamber: member.chamber,
        party: member.party,
        state: member.state,
        district: member.district,
        stance: mappedStance,
        confidence: analysis?.confidence || 0,
        evidence: (analysis?.evidence || []).map((e: any) => ({
          url: e.url || "",
          title: e.title || "",
          snippet: e.snippet || "",
          source: e.url?.includes("x.com") || e.url?.includes("twitter.com") ? "x" : "web",
        })),
        lastUpdated: new Date().toISOString(),
        analysisNotes: analysis?.analysisNotes,
      }

      results.push(stance)
      console.log(`[v0] ${batchLabel}: ${memberName}: ${stance.stance} (confidence: ${stance.confidence})`)
    }
  } catch (error) {
    console.error(`[v0] ${batchLabel}: Batch analysis error:`, error instanceof Error ? error.message : error)
    // Return "neutral" stance for failed members
    for (const member of members) {
      const memberName = getMemberName(member)
      results.push({
        memberId: memberName,
        fullName: memberName,
        chamber: member.chamber,
        party: member.party,
        state: member.state,
        district: member.district,
        stance: "neutral",
        confidence: 0,
        evidence: [],
        lastUpdated: new Date().toISOString(),
        analysisNotes: "Analysis failed",
      })
    }
  }

  return results
}

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      console.error("[v0] OPENAI_API_KEY not configured")
      return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 500 })
    }

    const body = await request.json()
    const { batchIndex = 0 } = body

    const PARALLEL_BATCHES = 2
    const startIdx = batchIndex * BATCH_SIZE * PARALLEL_BATCHES
    const endIdx = Math.min(startIdx + BATCH_SIZE * PARALLEL_BATCHES, CONGRESS_MEMBERS.length)

    console.log(`[v0] POST request received: batchIndex=${batchIndex}, processing members ${startIdx + 1} to ${endIdx}`)

    if (startIdx >= CONGRESS_MEMBERS.length) {
      return NextResponse.json({
        complete: true,
        results: [],
        processedCount: CONGRESS_MEMBERS.length,
        totalCount: CONGRESS_MEMBERS.length,
      })
    }

    const allMembersToProcess = CONGRESS_MEMBERS.slice(startIdx, endIdx)
    const batches: CongressMember[][] = []

    for (let i = 0; i < allMembersToProcess.length; i += BATCH_SIZE) {
      batches.push(allMembersToProcess.slice(i, Math.min(i + BATCH_SIZE, allMembersToProcess.length)))
    }

    console.log(`[v0] Processing ${batches.length} batches in parallel (${allMembersToProcess.length} members total)`)

    const parallelResults = await Promise.all(
      batches.map((batch, idx) => analyzeCongressBatch(batch, `Batch ${batchIndex * PARALLEL_BATCHES + idx + 1}`)),
    )

    const results = parallelResults.flat()

    try {
      const dbRecords: CongressionalStanceRecord[] = results.map((r) => ({
        member_name: r.fullName,
        chamber: r.chamber as "Senate" | "House",
        party: r.party,
        state: r.state,
        district: r.district,
        stance: r.stance as "ally" | "neutral" | "normalizer",
        confidence: r.confidence,
        analysis_notes: r.analysisNotes,
        evidence: (r.evidence || []).map((e) => ({
          title: e.title,
          snippet: e.snippet,
          source: e.source,
          url: e.url,
        })),
      }))

      await upsertCongressionalStances(dbRecords)
      console.log(`[v0] Saved ${dbRecords.length} stances to database`)

      if (endIdx >= CONGRESS_MEMBERS.length) {
        await updateStanceRefreshTime()
        console.log(`[v0] Updated stance refresh timestamp`)
      }
    } catch (dbError) {
      console.error("[v0] Database save error:", dbError)
    }

    return NextResponse.json({
      complete: endIdx >= CONGRESS_MEMBERS.length,
      results,
      processedCount: endIdx,
      totalCount: CONGRESS_MEMBERS.length,
      nextBatchIndex: batchIndex + 1,
    })
  } catch (error) {
    console.error("[v0] POST handler error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    totalMembers: CONGRESS_MEMBERS.length,
    batchSize: BATCH_SIZE,
    totalBatches: Math.ceil(CONGRESS_MEMBERS.length / (BATCH_SIZE * 2)),
  })
}
