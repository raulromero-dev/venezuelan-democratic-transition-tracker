import Anthropic from "@anthropic-ai/sdk"
import {
  FileAnalysis,
  DailySentiment,
  DailyMentions,
  DailyUsRelations,
  TopicCluster,
  TopicEntry,
} from "./types.js"
import { TOPIC_CLUSTERING_PROMPT } from "./prompts.js"

export function aggregateDailySentiment(files: FileAnalysis[]): DailySentiment[] {
  const byDate = new Map<string, FileAnalysis[]>()
  for (const f of files) {
    const existing = byDate.get(f.date) || []
    existing.push(f)
    byDate.set(f.date, existing)
  }

  const results: DailySentiment[] = []
  for (const [date, dayFiles] of [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const shows = dayFiles.map((f) => {
      const political = f.chunks.filter((c) => c.isPoliticallyRelevant && !c.error)
      const avgGov = political.length > 0
        ? political.reduce((sum, c) => sum + c.governmentSentiment, 0) / political.length
        : 0
      const avgOpp = political.length > 0
        ? political.reduce((sum, c) => sum + c.oppositionSentiment, 0) / political.length
        : 0
      return {
        showType: f.showType,
        filename: f.filename,
        avgGovSentiment: round(avgGov),
        avgOppSentiment: round(avgOpp),
        politicalChunks: political.length,
      }
    })

    const totalPolitical = shows.reduce((s, sh) => s + sh.politicalChunks, 0)
    const weightedGov = totalPolitical > 0
      ? shows.reduce((s, sh) => s + sh.avgGovSentiment * sh.politicalChunks, 0) / totalPolitical
      : 0
    const weightedOpp = totalPolitical > 0
      ? shows.reduce((s, sh) => s + sh.avgOppSentiment * sh.politicalChunks, 0) / totalPolitical
      : 0

    results.push({
      date,
      shows,
      aggregated: {
        avgGovernmentSentiment: round(weightedGov),
        avgOppositionSentiment: round(weightedOpp),
        totalPoliticalChunks: totalPolitical,
      },
    })
  }

  return results
}

export function aggregateDailyMentions(files: FileAnalysis[]): DailyMentions[] {
  const entityKeys = ["mariaCorinaMachado", "edmundoGonzalez", "juanPabloGuanipa", "lauraDogu", "donaldTrump"] as const
  const byDate = new Map<string, FileAnalysis[]>()
  for (const f of files) {
    const existing = byDate.get(f.date) || []
    existing.push(f)
    byDate.set(f.date, existing)
  }

  const results: DailyMentions[] = []
  for (const [date, dayFiles] of [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const entities: Record<string, { total: number; byShow: Record<string, number> }> = {}

    for (const key of entityKeys) {
      const byShow: Record<string, number> = {}
      let total = 0
      for (const f of dayFiles) {
        const count = f.chunks.reduce((s, c) => s + (c.entityMentions[key] || 0), 0)
        byShow[f.showType] = count
        total += count
      }
      entities[key] = { total, byShow }
    }

    // Collect other US officials
    const otherOfficials = new Set<string>()
    for (const f of dayFiles) {
      for (const c of f.chunks) {
        for (const name of c.entityMentions.otherUsOfficials) {
          otherOfficials.add(name)
        }
      }
    }
    if (otherOfficials.size > 0) {
      entities["otherUsOfficials"] = { total: otherOfficials.size, byShow: {} }
    }

    results.push({ date, entities })
  }

  return results
}

export function aggregateDailyUsRelations(files: FileAnalysis[]): DailyUsRelations[] {
  const byDate = new Map<string, FileAnalysis[]>()
  for (const f of files) {
    const existing = byDate.get(f.date) || []
    existing.push(f)
    byDate.set(f.date, existing)
  }

  const results: DailyUsRelations[] = []
  for (const [date, dayFiles] of [...byDate.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const usChunks = dayFiles.flatMap((f) =>
      f.chunks.filter((c) => c.usRelationsTone != null && !c.error)
    )

    const avgTone = usChunks.length > 0
      ? round(usChunks.reduce((s, c) => s + c.usRelationsTone!, 0) / usChunks.length)
      : null

    const topSegments = usChunks
      .sort((a, b) => Math.abs(b.usRelationsTone!) - Math.abs(a.usRelationsTone!))
      .slice(0, 3)
      .map((c) => ({ summary: c.topicSummary, tone: c.usRelationsTone! }))

    results.push({ date, avgTone, relevantChunkCount: usChunks.length, topSegments })
  }

  return results
}

export async function clusterTopics(files: FileAnalysis[]): Promise<TopicCluster[]> {
  const dimensions: { name: "opposition" | "government" | "us-relations"; topics: string[]; filter: (t: string) => boolean }[] = [
    {
      name: "opposition",
      topics: ["opposition-politics"],
      filter: (t) => t === "opposition-politics",
    },
    {
      name: "government",
      topics: ["government-policy", "judiciary", "security"],
      filter: (t) => ["government-policy", "judiciary", "security"].includes(t),
    },
    {
      name: "us-relations",
      topics: ["us-relations", "international"],
      filter: (t) => t === "us-relations",
    },
  ]

  const client = new Anthropic()
  const clusters: TopicCluster[] = []

  for (const dim of dimensions) {
    const relevantChunks = files.flatMap((f) =>
      f.chunks.filter((c) => c.isPoliticallyRelevant && !c.error && dim.filter(c.primaryTopic))
    )

    if (relevantChunks.length === 0) {
      clusters.push({ dimension: dim.name, topics: [] })
      continue
    }

    // Also include chunks where entity mentions are relevant to the dimension
    const allRelevant = files.flatMap((f) =>
      f.chunks.filter((c) => {
        if (c.error || !c.isPoliticallyRelevant) return false
        if (dim.filter(c.primaryTopic)) return true
        if (dim.name === "opposition" && (c.entityMentions.mariaCorinaMachado > 0 || c.entityMentions.edmundoGonzalez > 0 || c.entityMentions.juanPabloGuanipa > 0)) return true
        if (dim.name === "us-relations" && (c.entityMentions.lauraDogu > 0 || c.entityMentions.donaldTrump > 0 || c.usRelationsTone != null)) return true
        return false
      })
    )

    const uniqueChunks = [...new Map(allRelevant.map((c) => [c.chunkId, c])).values()]
    const summaryInput = uniqueChunks.map((c) => `[${c.chunkId}] (sentiment: ${
      dim.name === "us-relations" ? c.usRelationsTone ?? 0 :
      dim.name === "opposition" ? c.oppositionSentiment :
      c.governmentSentiment
    }) ${c.topicSummary}`).join("\n")

    try {
      const response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4096,
        system: TOPIC_CLUSTERING_PROMPT,
        messages: [{ role: "user", content: `Dimension: ${dim.name}\n\nSegment summaries:\n${summaryInput}` }],
      })

      const content = response.content[0]
      if (content.type !== "text") throw new Error("Unexpected response type")

      let jsonText = content.text.trim()
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "")
      }
      const parsed = JSON.parse(jsonText)

      const topics: TopicEntry[] = (parsed as Array<{ label: string; chunkIds: string[]; avgSentiment: number }>).map((t) => {
        const matchedChunks = uniqueChunks.filter((c) => t.chunkIds.includes(c.chunkId))
        const dates = matchedChunks
          .map((c) => {
            const file = files.find((f) => f.chunks.some((fc) => fc.chunkId === c.chunkId))
            return file?.date ?? ""
          })
          .filter(Boolean)
          .sort()

        return {
          label: t.label,
          chunkIds: t.chunkIds,
          summaries: matchedChunks.map((c) => c.topicSummary),
          dateRange: [dates[0] || "", dates[dates.length - 1] || ""] as [string, string],
          avgSentiment: round(t.avgSentiment),
        }
      })

      clusters.push({ dimension: dim.name, topics })
    } catch (err) {
      console.error(`  Failed to cluster ${dim.name} topics:`, err)
      clusters.push({ dimension: dim.name, topics: [] })
    }
  }

  return clusters
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000
}
