export interface EntityMentions {
  mariaCorinaMachado: number
  edmundoGonzalez: number
  juanPabloGuanipa: number
  lauraDogu: number
  donaldTrump: number
  otherUsOfficials: string[]
}

export interface ChunkAnalysis {
  chunkId: string
  chunkIndex: number
  text: string
  isPoliticallyRelevant: boolean
  governmentSentiment: number
  oppositionSentiment: number
  primaryTopic: string
  topicSummary: string
  entityMentions: EntityMentions
  usRelationsTone: number | null
  error?: boolean
}

export interface FileAnalysis {
  filename: string
  date: string
  showType: string
  totalChunks: number
  politicalChunks: number
  chunks: ChunkAnalysis[]
}

export interface ShowSentiment {
  showType: string
  filename: string
  avgGovSentiment: number
  avgOppSentiment: number
  politicalChunks: number
}

export interface DailySentiment {
  date: string
  shows: ShowSentiment[]
  aggregated: {
    avgGovernmentSentiment: number
    avgOppositionSentiment: number
    totalPoliticalChunks: number
  }
}

export interface DailyMentions {
  date: string
  entities: Record<string, { total: number; byShow: Record<string, number> }>
}

export interface UsRelationsSegment {
  summary: string
  tone: number
}

export interface DailyUsRelations {
  date: string
  avgTone: number | null
  relevantChunkCount: number
  topSegments: UsRelationsSegment[]
}

export interface TopicEntry {
  label: string
  chunkIds: string[]
  summaries: string[]
  dateRange: [string, string]
  avgSentiment: number
}

export interface TopicCluster {
  dimension: "opposition" | "government" | "us-relations"
  topics: TopicEntry[]
}

export interface PipelineMetadata {
  runAt: string
  totalFiles: number
  totalChunks: number
  politicalChunks: number
  apiCalls: number
  durationMs: number
}

export const TOPIC_CATEGORIES = [
  "government-policy",
  "opposition-politics",
  "us-relations",
  "economy",
  "security",
  "health",
  "infrastructure",
  "labor",
  "judiciary",
  "press-freedom",
  "international",
  "social",
  "other-non-political",
] as const

export type TopicCategory = (typeof TOPIC_CATEGORIES)[number]

const MONTH_MAP: Record<string, number> = {
  enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
  julio: 7, agosto: 8, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
}

export function parseBroadcastDate(filename: string): string {
  const match = filename.match(/(\d{1,2})-de-(\w+)-de-(\d{4})/)
  if (!match) {
    const prefix = filename.match(/^(\d{4})(\d{2})(\d{2})/)
    if (prefix) return `${prefix[1]}-${prefix[2]}-${prefix[3]}`
    throw new Error(`Cannot parse date from filename: ${filename}`)
  }
  const [, day, monthName, year] = match
  const month = MONTH_MAP[monthName.toLowerCase()]
  if (!month) throw new Error(`Unknown month: ${monthName}`)
  return `${year}-${String(month).padStart(2, "0")}-${String(Number(day)).padStart(2, "0")}`
}

export function parseShowType(filename: string): string {
  if (filename.includes("emision-matutina")) return "matutina"
  if (filename.includes("emision-estelar")) return "estelar"
  if (filename.includes("a-esta-hora")) return "a-esta-hora"
  if (filename.includes("fin-de-semana")) return "fin-de-semana"
  if (filename.includes("emision-meridiana") || filename.includes("emisión-meridiana")) return "meridiana"
  return "unknown"
}
