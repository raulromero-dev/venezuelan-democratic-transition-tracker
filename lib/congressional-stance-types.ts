// Types for congressional stance analysis

export type CongressionalStance = "ally" | "neutral" | "normalizer"

export interface StanceEvidence {
  url: string
  title: string
  snippet: string
  source: "x" | "web"
  date?: string
}

export interface CongressMemberStance {
  memberId: string // fullName as ID
  fullName: string
  chamber: "House" | "Senate"
  party: "Republican" | "Democrat" | "Independent"
  state: string
  district?: string
  stance: CongressionalStance
  confidence: number // 0-1
  evidence: StanceEvidence[]
  lastUpdated: string // ISO date
  analysisNotes?: string
}

export interface StanceAnalysisResult {
  members: CongressMemberStance[]
  lastFullRefresh: string
  processingStatus: "idle" | "processing" | "complete" | "error"
  processedCount: number
  totalCount: number
  errors: string[]
}
