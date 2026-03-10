import { KEYWORD_REGEX, REFERENCE_TEXT, VENEZUELA_KEYWORDS } from "./venezuela-keywords"

// Cache for the reference embedding (computed once)
let referenceEmbedding: number[] | null = null

// Cosine similarity between two vectors
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

// Get embeddings from OpenAI
async function getEmbeddings(texts: string[]): Promise<number[][]> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.log("[v0] No OPENAI_API_KEY, falling back to keyword matching")
    return []
  }

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: texts,
    }),
  })

  if (!response.ok) {
    console.log("[v0] OpenAI embedding error:", response.status)
    return []
  }

  const data = await response.json()
  return data.data.map((d: { embedding: number[] }) => d.embedding)
}

// Get or compute the reference embedding
async function getReferenceEmbedding(): Promise<number[] | null> {
  if (referenceEmbedding) return referenceEmbedding

  const embeddings = await getEmbeddings([REFERENCE_TEXT])
  if (embeddings.length > 0) {
    referenceEmbedding = embeddings[0]
  }
  return referenceEmbedding
}

function findMatchingKeyword(text: string): string | null {
  for (const keyword of VENEZUELA_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i")
    if (regex.test(text)) {
      return keyword
    }
  }
  return null
}

// Score a single tweet for Venezuela relevance (0-1)
export async function scoreTweetRelevance(text: string): Promise<{ score: number; method: "keyword" | "semantic" }> {
  // First pass: keyword matching (instant)
  if (KEYWORD_REGEX.test(text)) {
    const matchedKeyword = findMatchingKeyword(text)
    console.log(
      `[v0] RELEVANCE KEYWORD MATCH: keyword="${matchedKeyword}", score=1.0, text="${text.substring(0, 80)}..."`,
    )
    return { score: 1.0, method: "keyword" }
  }

  // Second pass: semantic similarity (if OpenAI available)
  const refEmbed = await getReferenceEmbedding()
  if (!refEmbed) {
    console.log(`[v0] RELEVANCE NO REF EMBED: score=0, text="${text.substring(0, 80)}..."`)
    return { score: 0, method: "keyword" }
  }

  const [tweetEmbed] = await getEmbeddings([text])
  if (!tweetEmbed) {
    console.log(`[v0] RELEVANCE NO TWEET EMBED: score=0, text="${text.substring(0, 80)}..."`)
    return { score: 0, method: "keyword" }
  }

  const similarity = cosineSimilarity(tweetEmbed, refEmbed)
  const passed = similarity >= RELEVANCE_THRESHOLD
  console.log(
    `[v0] RELEVANCE EMBEDDING: score=${similarity.toFixed(4)}, threshold=${RELEVANCE_THRESHOLD}, passed=${passed}, text="${text.substring(0, 80)}..."`,
  )
  return { score: similarity, method: "semantic" }
}

// Batch score multiple tweets
export async function scoreTweetsRelevance<T extends { id: string; content?: string; text?: string }>(
  posts: T[],
): Promise<(T & { relevanceScore: number; relevanceMethod: "keyword" | "semantic" | "none" })[]> {
  const results: (T & { relevanceScore: number; relevanceMethod: "keyword" | "semantic" | "none" })[] = []

  // First pass: keyword matching
  const needsEmbedding: { index: number; text: string }[] = []

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const text = post.content || post.text || ""

    if (!text || text.trim().length === 0) {
      results.push({ ...post, relevanceScore: 0, relevanceMethod: "none" })
      continue
    }

    if (KEYWORD_REGEX.test(text)) {
      const matchedKeyword = findMatchingKeyword(text)
      console.log(`[v0] KEYWORD MATCH: keyword="${matchedKeyword}", score=1.0, text="${text.substring(0, 100)}..."`)
      results.push({ ...post, relevanceScore: 1.0, relevanceMethod: "keyword" })
    } else {
      results.push({ ...post, relevanceScore: 0, relevanceMethod: "none" })
      needsEmbedding.push({ index: i, text })
    }
  }

  console.log(
    `[v0] Keyword matched: ${results.length - needsEmbedding.length}, needs embedding: ${needsEmbedding.length}`,
  )

  // If no posts need embedding, return early
  if (needsEmbedding.length === 0) {
    return results
  }

  // Second pass: semantic similarity
  const refEmbed = await getReferenceEmbedding()
  if (!refEmbed) {
    return results
  }

  const validTexts = needsEmbedding.filter((item) => item.text.trim().length > 0)

  if (validTexts.length === 0) {
    return results
  }

  const batchSize = 100
  for (let batchStart = 0; batchStart < validTexts.length; batchStart += batchSize) {
    const batch = validTexts.slice(batchStart, batchStart + batchSize)
    const texts = batch.map((item) => item.text.substring(0, 8000)) // Truncate long texts

    const embeddings = await getEmbeddings(texts)

    for (let i = 0; i < batch.length; i++) {
      const { index, text } = batch[i]
      const embedding = embeddings[i]
      if (embedding) {
        const similarity = cosineSimilarity(embedding, refEmbed)
        const passed = similarity >= RELEVANCE_THRESHOLD
        console.log(
          `[v0] EMBEDDING: score=${similarity.toFixed(4)}, threshold=${RELEVANCE_THRESHOLD}, passed=${passed}, text="${text.substring(0, 100)}..."`,
        )
        results[index] = { ...results[index], relevanceScore: similarity, relevanceMethod: "semantic" }
      }
    }
  }

  const passedCount = results.filter((r) => r.relevanceScore >= RELEVANCE_THRESHOLD).length
  console.log(
    `[v0] RELEVANCE SUMMARY: ${passedCount}/${results.length} posts passed threshold (${RELEVANCE_THRESHOLD})`,
  )

  return results
}

// Default relevance threshold
export const RELEVANCE_THRESHOLD = 0.4

export async function scoreRelevance(text: string): Promise<{ score: number; method: "keyword" | "embedding" }> {
  const result = await scoreTweetRelevance(text)
  return {
    score: result.score,
    method: result.method === "keyword" ? "keyword" : "embedding",
  }
}
