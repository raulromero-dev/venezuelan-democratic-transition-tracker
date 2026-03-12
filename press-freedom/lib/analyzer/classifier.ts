import Anthropic from "@anthropic-ai/sdk"
import { ChunkAnalysis, EntityMentions } from "./types.js"
import { SYSTEM_PROMPT, userPrompt } from "./prompts.js"

const ENTITY_PATTERNS: Record<keyof Omit<EntityMentions, "otherUsOfficials">, RegExp> = {
  mariaCorinaMachado: /\b(Mar[ií]a\s+Corina|Machado|MCM)\b/gi,
  edmundoGonzalez: /\b(Edmundo\s+Gonz[aá]lez|Gonz[aá]lez\s+Urrutia)\b/gi,
  juanPabloGuanipa: /\b(Juan\s+Pablo\s+Guanipa|Guanipa)\b/gi,
  lauraDogu: /\b(Laura\s+Dogu|Dogu|Dugu)\b/gi,
  donaldTrump: /\b(Donald\s+Trump|Trump)\b/gi,
}

function regexEntityCount(text: string): Omit<EntityMentions, "otherUsOfficials"> {
  const counts: Record<string, number> = {}
  for (const [key, pattern] of Object.entries(ENTITY_PATTERNS)) {
    const matches = text.match(pattern)
    counts[key] = matches ? matches.length : 0
  }
  return counts as Omit<EntityMentions, "otherUsOfficials">
}

let client: Anthropic | null = null

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic()
  }
  return client
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function classifyChunk(
  text: string,
  chunkId: string,
  chunkIndex: number,
  date: string,
  showType: string,
): Promise<ChunkAnalysis> {
  const regexCounts = regexEntityCount(text)
  const maxRetries = 3

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await getClient().messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt(text, date, showType) }],
      })

      const content = response.content[0]
      if (content.type !== "text") throw new Error("Unexpected response type")

      // Strip markdown fences if the model wraps the JSON
      let jsonText = content.text.trim()
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "")
      }

      const parsed = JSON.parse(jsonText)

      // Merge regex and LLM entity counts (take max)
      const entityMentions: EntityMentions = {
        mariaCorinaMachado: Math.max(regexCounts.mariaCorinaMachado, parsed.entityMentions?.mariaCorinaMachado ?? 0),
        edmundoGonzalez: Math.max(regexCounts.edmundoGonzalez, parsed.entityMentions?.edmundoGonzalez ?? 0),
        juanPabloGuanipa: Math.max(regexCounts.juanPabloGuanipa, parsed.entityMentions?.juanPabloGuanipa ?? 0),
        lauraDogu: Math.max(regexCounts.lauraDogu, parsed.entityMentions?.lauraDogu ?? 0),
        donaldTrump: Math.max(regexCounts.donaldTrump, parsed.entityMentions?.donaldTrump ?? 0),
        otherUsOfficials: parsed.entityMentions?.otherUsOfficials ?? [],
      }

      return {
        chunkId,
        chunkIndex,
        text,
        isPoliticallyRelevant: Boolean(parsed.isPoliticallyRelevant),
        governmentSentiment: clamp(Number(parsed.governmentSentiment) || 0, -1, 1),
        oppositionSentiment: clamp(Number(parsed.oppositionSentiment) || 0, -1, 1),
        primaryTopic: parsed.primaryTopic ?? "other-non-political",
        topicSummary: parsed.topicSummary ?? "",
        entityMentions,
        usRelationsTone: parsed.usRelationsTone != null ? clamp(Number(parsed.usRelationsTone), -1, 1) : null,
      }
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string }
      if (error.status === 429) {
        const delay = Math.pow(2, attempt + 1) * 2000
        console.warn(`  Rate limited on ${chunkId}, waiting ${delay / 1000}s...`)
        await sleep(delay)
        continue
      }
      if (attempt < maxRetries - 1) {
        console.warn(`  Retry ${attempt + 1} for ${chunkId}: ${error.message}`)
        await sleep(2000)
        continue
      }
      console.error(`  Failed to classify ${chunkId} after ${maxRetries} attempts: ${error.message}`)
      return {
        chunkId,
        chunkIndex,
        text,
        isPoliticallyRelevant: false,
        governmentSentiment: 0,
        oppositionSentiment: 0,
        primaryTopic: "other-non-political",
        topicSummary: "",
        entityMentions: { ...regexCounts, otherUsOfficials: [] },
        usRelationsTone: null,
        error: true,
      }
    }
  }

  // Should never reach here, but TypeScript needs it
  throw new Error("Unreachable")
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
