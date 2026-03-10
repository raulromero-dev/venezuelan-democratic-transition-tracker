"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { RefreshCw, Search, X, Trash2, Edit3, Save, XCircle, Download, SlidersHorizontal, ChevronDown } from "lucide-react"
import { CONGRESS_MEMBERS } from "@/lib/congress-members"
import { MemberListItem } from "./MemberListItem"

interface StanceOverride {
  member_name: string
  chamber: string
  override_stance: string
  user_notes: string
}

interface CongressMember {
  id: string
  name: string
  role: string
  party: string
  state: string
  district?: string
  position: string
  confidence: number
  evidence: Array<{
    title: string
    snippet: string
    source: string
    url?: string
  }>
  analysisNotes?: string
  lastUpdated?: string
  hasOverride?: boolean
  overrideStance?: string
  userNotes?: string
  tags?: string[]
  committees?: string[]
}

interface CongressMemberStanceDB {
  member_name: string
  chamber: string
  party: string
  state: string
  district?: string
  stance: string
  confidence: number
  analysis_notes?: string
  evidence: Array<{
    title: string
    snippet: string
    source: string
    url?: string
  }>
  last_updated?: string
}

interface CongressMemberStanceLocal {
  name?: string
  fullName?: string
  chamber: string
  party: string
  state: string
  district?: string
  stance: string
  confidence?: number
  evidence?: Array<{
    title?: string
    snippet?: string
    source?: string
    url?: string
  }>
  analysisNotes?: string
  lastUpdated?: string
}

const STATE_CODE_TO_NAME: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
  PR: "Puerto Rico",
  GU: "Guam",
  VI: "Virgin Islands",
  AS: "American Samoa",
  MP: "Northern Mariana Islands",
}

const STATE_NAME_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_CODE_TO_NAME).map(([code, name]) => [name, code]),
)

function getStateCode(stateNameOrCode: string): string {
  if (stateNameOrCode.length === 2) return stateNameOrCode.toUpperCase()
  return STATE_NAME_TO_CODE[stateNameOrCode] || stateNameOrCode
}

const STATE_LAYOUT = [
  [null, null, null, null, null, null, null, null, null, null, null, "ME"],
  [null, null, null, null, null, null, "WI", null, null, null, "VT", "NH"],
  ["WA", "ID", "MT", "ND", "MN", "IL", "MI", null, null, "NY", "MA", null],
  ["OR", "NV", "WY", "SD", "IA", "IN", "OH", "PA", "NJ", "CT", "RI", null],
  ["CA", "UT", "CO", "NE", "MO", "KY", "WV", "VA", "MD", "DE", null, null],
  [null, "AZ", "NM", "KS", "AR", "TN", "NC", "SC", "DC", null, null, null],
  [null, null, null, "OK", "LA", "MS", "AL", "GA", null, null, null, null],
  ["HI", "AK", null, "TX", null, null, null, null, "FL", null, null, null],
]

export function CongressionalMap() {
  const [members, setMembers] = useState<CongressMember[]>([])
  const [overrides, setOverrides] = useState<Map<string, StanceOverride>>(new Map())
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [chamberFilter, setChamberFilter] = useState<"all" | "senate" | "house">("all")
  const [stanceFilter, setStanceFilter] = useState<string | null>(null)
  const [partyFilter, setPartyFilter] = useState<"all" | "R" | "D">("all")
  const [tagFilters, setTagFilters] = useState<Set<string>>(new Set())
  const [committeeFilter, setCommitteeFilter] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)

  // Build tag/committee lookup from the source CONGRESS_MEMBERS data
  const memberMetaLookup = useMemo(() => {
    const lookup = new Map<string, { tags: string[]; committees: string[] }>()
    for (const m of CONGRESS_MEMBERS) {
      lookup.set(m.name, { tags: m.tags || [], committees: m.committees || [] })
    }
    return lookup
  }, [])

  // Tags to hide from the filter UI (data is preserved)
  const hiddenTags = useMemo(() => new Set(["Trump Ally"]), [])

  // All available tags across all members (excluding hidden ones)
  const availableTags = useMemo(() => {
    const tags = new Set<string>()
    for (const m of CONGRESS_MEMBERS) {
      for (const t of m.tags || []) {
        if (!hiddenTags.has(t)) tags.add(t)
      }
    }
    return Array.from(tags).sort()
  }, [hiddenTags])

  // All available committees across all members
  const availableCommittees = useMemo(() => {
    const committees = new Set<string>()
    for (const m of CONGRESS_MEMBERS) {
      for (const c of m.committees || []) {
        committees.add(c)
      }
    }
    return Array.from(committees).sort()
  }, [])

  const toggleTagFilter = useCallback((tag: string) => {
    setTagFilters((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) {
        next.delete(tag)
      } else {
        next.add(tag)
      }
      return next
    })
  }, [])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (chamberFilter !== "all") count++
    if (partyFilter !== "all") count++
    if (stanceFilter) count++
    if (committeeFilter) count++
    count += tagFilters.size
    return count
  }, [chamberFilter, partyFilter, stanceFilter, tagFilters, committeeFilter])
  const [lastRefresh, setLastRefresh] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Override editing state
  const [isEditingOverride, setIsEditingOverride] = useState(false)
  const [editOverrideStance, setEditOverrideStance] = useState("")
  const [editUserNotes, setEditUserNotes] = useState("")
  const [isSavingOverride, setIsSavingOverride] = useState(false)

  const dbToMember = useCallback((dbStance: CongressMemberStanceDB): CongressMember => {
    const memberName = dbStance.member_name
    const memberId = memberName.toLowerCase().replace(/\s+/g, "-")
    const meta = memberMetaLookup.get(memberName)
    return {
      id: memberId,
      name: memberName,
      role: dbStance.chamber === "House" ? "Representative" : "Senator",
      party: dbStance.party === "Republican" ? "R" : dbStance.party === "Democrat" ? "D" : "I",
      state: dbStance.state,
      district: dbStance.district,
      position: dbStance.stance || "neutral",
      confidence: dbStance.confidence || 0,
      evidence: (dbStance.evidence || []).map((e) => ({
        title: e.title || "",
        snippet: e.snippet || "",
        source: e.source || "web",
        url: e.url,
      })),
      analysisNotes: dbStance.analysis_notes,
      lastUpdated: dbStance.last_updated,
      tags: meta?.tags || [],
      committees: meta?.committees || [],
    }
  }, [memberMetaLookup])

  const stanceToMember = useCallback((stance: CongressMemberStanceLocal): CongressMember => {
    const memberName = stance.fullName || stance.name || "Unknown"
    const memberId = memberName.toLowerCase().replace(/\s+/g, "-")
    const meta = memberMetaLookup.get(memberName)
    return {
      id: memberId,
      name: memberName,
      role: stance.chamber === "house" || stance.chamber === "House" ? "Representative" : "Senator",
      party: stance.party === "Republican" ? "R" : stance.party === "Democrat" ? "D" : "I",
      state: stance.state || "Unknown",
      district: stance.district,
      position: stance.stance || "neutral",
      confidence: stance.confidence || 0,
      evidence: (stance.evidence || []).map((e) => ({
        title: e.title || "",
        snippet: e.snippet || "",
        source: e.source || "web",
        url: e.url,
      })),
      analysisNotes: stance.analysisNotes,
      lastUpdated: stance.lastUpdated,
      tags: meta?.tags || [],
      committees: meta?.committees || [],
    }
  }, [memberMetaLookup])

  // Load overrides
  const loadOverrides = useCallback(async () => {
    try {
      const response = await fetch("/api/congress-stance/override")
      if (response.ok) {
        const data = await response.json()
        if (data.overrides) {
          const overrideMap = new Map<string, StanceOverride>()
          for (const o of data.overrides) {
            const key = `${o.member_name}-${o.chamber}`
            overrideMap.set(key, o)
          }
          setOverrides(overrideMap)
          console.log(`[v0] Loaded ${data.overrides.length} overrides from database`)
        }
      }
    } catch (error) {
      console.error("[v0] Error loading overrides:", error)
    }
  }, [])

  useEffect(() => {
    async function loadFromDatabase() {
      setIsLoading(true)
      try {
        // Load stances and overrides in parallel
        const [stancesResponse] = await Promise.all([
          fetch("/api/congress-stance"),
          loadOverrides(),
        ])
        
        if (stancesResponse.ok) {
          const data = await stancesResponse.json()
          if (data.stances && data.stances.length > 0) {
            setMembers(data.stances.map(dbToMember))
            setLastRefresh(data.lastRefresh)
            console.log(`[v0] Loaded ${data.stances.length} stances from database`)
          }
        }
      } catch (error) {
        console.error("[v0] Error loading from database:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadFromDatabase()
  }, [dbToMember, loadOverrides])

  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true)
    setProgress({ current: 0, total: CONGRESS_MEMBERS.length })

    try {
      const infoResponse = await fetch("/api/congress-stance/analyze")
      if (!infoResponse.ok) {
        throw new Error(`Failed to get analysis info: ${infoResponse.status}`)
      }
      const info = await infoResponse.json()
      console.log(`[v0] Analysis info: ${info.totalMembers} members, ${info.totalBatches} batches`)

      const allResults: CongressMemberStanceLocal[] = []
      let batchIndex = 0
      let complete = false

      while (!complete) {
        console.log(`[v0] Processing batch ${batchIndex + 1}...`)

        const response = await fetch("/api/congress-stance/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ batchIndex }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`[v0] Batch ${batchIndex + 1} failed:`, errorText)
          batchIndex++
          continue
        }

        const data = await response.json()
        console.log(`[v0] Batch ${batchIndex + 1} complete: ${data.results?.length || 0} results`)

        if (data.results) {
          allResults.push(...data.results)
        }

        setProgress({ current: data.processedCount, total: data.totalCount })
        complete = data.complete
        batchIndex = data.nextBatchIndex || batchIndex + 1

        // Small delay between batches
        if (!complete) {
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }

      console.log(`[v0] All results collected: ${allResults.length}`)

      const now = new Date().toISOString()
      setLastRefresh(now)
      setMembers(allResults.map(stanceToMember))
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [stanceToMember])

  const clearData = useCallback(async () => {
    try {
      const response = await fetch("/api/congress-stance", {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("[v0] Failed to delete stances:", error)
        return
      }

      console.log("[v0] Successfully deleted all stances from database")

      // Clear local state
      setMembers([])
      setLastRefresh(null)
      setSelectedStates(new Set())
      setSelectedMemberId(null)
      setStanceFilter(null)
      setPartyFilter("all")
      setTagFilters(new Set())
      setCommitteeFilter(null)
    } catch (error) {
      console.error("[v0] Error clearing data:", error)
    }
  }, [])

  // Save override
  const saveOverride = useCallback(async (member: CongressMember) => {
    setIsSavingOverride(true)
    try {
      const chamber = member.role === "Senator" ? "Senate" : "House"
      const response = await fetch("/api/congress-stance/override", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberName: member.name,
          chamber,
          overrideStance: editOverrideStance,
          userNotes: editUserNotes,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("[v0] Failed to save override:", error)
        return
      }

      console.log(`[v0] Saved override for ${member.name}`)
      
      // Update local overrides map
      const key = `${member.name}-${chamber}`
      setOverrides((prev) => {
        const newMap = new Map(prev)
        newMap.set(key, {
          member_name: member.name,
          chamber,
          override_stance: editOverrideStance,
          user_notes: editUserNotes,
        })
        return newMap
      })
      
      setIsEditingOverride(false)
    } catch (error) {
      console.error("[v0] Error saving override:", error)
    } finally {
      setIsSavingOverride(false)
    }
  }, [editOverrideStance, editUserNotes])

  // Delete override
  const deleteOverride = useCallback(async (member: CongressMember) => {
    const chamber = member.role === "Senator" ? "Senate" : "House"
    try {
      const response = await fetch(
        `/api/congress-stance/override?memberName=${encodeURIComponent(member.name)}&chamber=${chamber}`,
        { method: "DELETE" }
      )

      if (!response.ok) {
        const error = await response.json()
        console.error("[v0] Failed to delete override:", error)
        return
      }

      console.log(`[v0] Deleted override for ${member.name}`)
      
      // Update local overrides map
      const key = `${member.name}-${chamber}`
      setOverrides((prev) => {
        const newMap = new Map(prev)
        newMap.delete(key)
        return newMap
      })
      
      setIsEditingOverride(false)
      setEditOverrideStance("")
      setEditUserNotes("")
    } catch (error) {
      console.error("[v0] Error deleting override:", error)
    }
  }, [])

  // Export to CSV
  const exportToCSV = useCallback(() => {
    // Build CSV data with all members including override info
    const csvData = members.map((m) => {
      const chamberDb = m.role === "Senator" ? "Senate" : "House"
      const key = `${m.name}-${chamberDb}`
      const override = overrides.get(key)
      
      // Get the effective stance (override if set, otherwise AI analysis)
      const effectiveStance = (override?.override_stance && override.override_stance !== "") 
        ? override.override_stance 
        : m.position
      
      // Format evidence as a string
      const evidenceStr = m.evidence.map(e => `${e.title}: ${e.snippet} (${e.url || e.source})`).join(" | ")
      
      return {
        name: m.name,
        role: m.role,
        party: m.party,
        state: m.state,
        district: m.district || "",
        ai_stance: m.position,
        override_stance: override?.override_stance || "",
        effective_stance: effectiveStance,
        confidence: m.confidence,
        analysis_notes: m.analysisNotes || "",
        user_notes: override?.user_notes || "",
        evidence: evidenceStr,
        last_updated: m.lastUpdated || "",
      }
    })
    
    // CSV header
    const headers = [
      "Name", "Role", "Party", "State", "District", 
      "AI Stance", "Override Stance", "Effective Stance", 
      "Confidence", "Analysis Notes", "User Notes", "Evidence", "Last Updated"
    ]
    
    // Build CSV content
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => [
        `"${row.name.replace(/"/g, '""')}"`,
        `"${row.role}"`,
        `"${row.party}"`,
        `"${row.state}"`,
        `"${row.district}"`,
        `"${row.ai_stance}"`,
        `"${row.override_stance}"`,
        `"${row.effective_stance}"`,
        row.confidence,
        `"${(row.analysis_notes || "").replace(/"/g, '""')}"`,
        `"${(row.user_notes || "").replace(/"/g, '""')}"`,
        `"${(row.evidence || "").replace(/"/g, '""')}"`,
        `"${row.last_updated}"`,
      ].join(","))
    ].join("\n")
    
    // Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `congressional_positions_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [members, overrides])

  // Start editing override
  const startEditingOverride = useCallback((member: CongressMember) => {
    const chamber = member.role === "Senator" ? "Senate" : "House"
    const key = `${member.name}-${chamber}`
    const existingOverride = overrides.get(key)
    
    // If there's an existing override with a stance, use it; otherwise default to empty (no override)
    setEditOverrideStance(existingOverride?.override_stance || "")
    setEditUserNotes(existingOverride?.user_notes || "")
    setIsEditingOverride(true)
  }, [overrides])

  const stanceCounts = useMemo(() => {
    const counts = {
      senate: { ally: 0, normalizer: 0, neutral: 0 },
      house: { ally: 0, normalizer: 0, neutral: 0 },
    }
    for (const m of members) {
      const chamber = m.role === "Senator" ? "senate" : "house"
      const chamberDb = m.role === "Senator" ? "Senate" : "House"
      
      // Check for override - only use if override_stance is not empty
      const key = `${m.name}-${chamberDb}`
      const override = overrides.get(key)
      const stance = (override?.override_stance && override.override_stance !== "") 
        ? override.override_stance 
        : (m.position || "neutral")
      
      if (stance in counts[chamber]) {
        counts[chamber][stance as keyof (typeof counts)["senate"]]++
      } else {
        counts[chamber]["neutral"]++
      }
    }
    return counts
  }, [members, overrides])

  const filteredMembers = useMemo(() => {
    // Add override info to members
    let filtered = members.map((m) => {
      const chamberDb = m.role === "Senator" ? "Senate" : "House"
      const key = `${m.name}-${chamberDb}`
      const override = overrides.get(key)
      return {
        ...m,
        hasOverride: !!override,
        userNotes: override?.user_notes,
        // Only use override stance if it's not empty
        position: (override?.override_stance && override.override_stance !== "") 
          ? override.override_stance 
          : m.position,
      }
    })

    // Filter by chamber
    if (chamberFilter !== "all") {
      filtered = filtered.filter((m) => {
        const memberChamber = m.role === "Senator" ? "senate" : "house"
        return memberChamber === chamberFilter
      })
    }

    // Filter by stance
    if (stanceFilter) {
      filtered = filtered.filter((m) => m.position === stanceFilter)
    }

    // Filter by party
    if (partyFilter !== "all") {
      filtered = filtered.filter((m) => m.party === partyFilter)
    }

    // Filter by tags (member must have ALL selected tags)
    if (tagFilters.size > 0) {
      filtered = filtered.filter((m) => {
        const memberTags = m.tags || memberMetaLookup.get(m.name)?.tags || []
        return Array.from(tagFilters).every((tag) => memberTags.includes(tag))
      })
    }

    // Filter by committee
    if (committeeFilter) {
      filtered = filtered.filter((m) => {
        const memberCommittees = m.committees || memberMetaLookup.get(m.name)?.committees || []
        return memberCommittees.includes(committeeFilter)
      })
    }

    // Only filter if user has actively selected states
    if (selectedStates.size > 0) {
      filtered = filtered.filter((m) => {
        const memberStateCode = getStateCode(m.state)
        return selectedStates.has(memberStateCode)
      })
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.state.toLowerCase().includes(query) ||
          m.party.toLowerCase().includes(query) ||
          m.position.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [members, selectedStates, searchQuery, overrides, chamberFilter, stanceFilter, partyFilter, tagFilters, committeeFilter, memberMetaLookup])

  const selectedMember = useMemo(() => {
    if (!selectedMemberId) return null
    const member = members.find((m) => m.id === selectedMemberId)
    if (!member) return null
    
    // Add override info
    const chamber = member.role === "Senator" ? "Senate" : "House"
    const key = `${member.name}-${chamber}`
    const override = overrides.get(key)
    
    return {
      ...member,
      hasOverride: !!override,
      overrideStance: override?.override_stance || "",
      userNotes: override?.user_notes || "",
      // Only use override stance if it's not empty, otherwise use original
      position: (override?.override_stance && override.override_stance !== "") 
        ? override.override_stance 
        : member.position,
    }
  }, [members, selectedMemberId, overrides])

  const getPositionColor = (position: string) => {
    switch (position) {
      case "ally":
        return "text-blue-400"
      case "normalizer":
        return "text-amber-400"
      case "neutral":
      default:
        return "text-zinc-400"
    }
  }

  const getPositionBg = (position: string) => {
    switch (position) {
      case "ally":
        return "bg-blue-500/20 border-blue-500/50"
      case "normalizer":
        return "bg-amber-500/20 border-amber-500/50"
      case "neutral":
      default:
        return "bg-zinc-500/20 border-zinc-700"
    }
  }

  const getPositionLabel = (position: string) => {
    switch (position) {
      case "ally":
        return "Ally"
      case "normalizer":
        return "Normalizer"
      case "neutral":
      default:
        return "Neutral"
    }
  }

  const statesWithData = useMemo(() => {
    const states = new Set<string>()
    for (const m of members) {
      const stateCode = getStateCode(m.state)
      if (stateCode) states.add(stateCode)
    }
    return states
  }, [members])

  // States that match the active stance/party filter
  const statesMatchingFilter = useMemo(() => {
    if (!stanceFilter && partyFilter === "all" && tagFilters.size === 0 && !committeeFilter) return null
    const states = new Set<string>()
    for (const m of filteredMembers) {
      const stateCode = getStateCode(m.state)
      if (stateCode) states.add(stateCode)
    }
    return states
  }, [filteredMembers, stanceFilter, partyFilter, tagFilters, committeeFilter])

  const getStateColorClass = (stateCode: string) => {
    // DC is always disabled
    if (stateCode === "DC") {
      return "bg-zinc-900/30 text-zinc-700 cursor-not-allowed"
    }

    const isSelected = selectedStates.has(stateCode)

    // When user has selected this state - bright/highlighted
    if (isSelected) {
      return "bg-white/80 text-black"
    }

    // When stance/party filter is active, dim states without matching members
    if (statesMatchingFilter) {
      if (statesMatchingFilter.has(stateCode)) {
        return "bg-zinc-500/60 text-white hover:bg-zinc-400/60 cursor-pointer"
      }
      return "bg-zinc-900/30 text-zinc-700"
    }

    const matchingState = searchQuery.trim() ? filteredMembers.some((m) => getStateCode(m.state) === stateCode) : false

    // When search matches this state
    if (matchingState) {
      return "bg-zinc-500/60 text-white"
    }

    // Default state - darker, all states available
    if (statesWithData.has(stateCode)) {
      return "bg-zinc-700/40 text-zinc-400 hover:bg-zinc-600/50 cursor-pointer"
    }

    // States without data - even darker
    return "bg-zinc-800/30 text-zinc-600"
  }

  const handleStateClick = (stateCode: string) => {
    // DC is disabled
    if (stateCode === "DC") return

    if (statesWithData.has(stateCode)) {
      setSelectedStates((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(stateCode)) {
          newSet.delete(stateCode)
        } else {
          newSet.add(stateCode)
        }
        return newSet
      })
      setSelectedMemberId(null)
    }
  }

  const clearSelectedStates = () => {
    setSelectedStates(new Set())
    setSelectedMemberId(null)
  }

  return (
    <div className="h-full flex flex-col gap-4 p-4 bg-black min-h-0 overflow-auto">
      {/* Header */}
      <div className="relative flex-shrink-0">
        {/* Top reflection line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] block mb-2">
              CONGRESSIONAL POSITIONS
            </span>
            <h2 className="text-2xl font-light tracking-tight text-white">Venezuela Stance Map</h2>
          </div>
          <div className="flex items-center gap-3">
            {lastRefresh && (
              <span className="text-[10px] font-mono text-zinc-600 tracking-wider">
                UPDATED: {new Date(lastRefresh).toLocaleDateString()}
              </span>
            )}
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="relative flex items-center gap-2 text-[10px] font-mono text-zinc-400 hover:text-white transition-colors px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 disabled:opacity-50 tracking-[0.2em] uppercase group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <RefreshCw className={`h-3 w-3 ${isAnalyzing ? "animate-spin" : ""}`} />
              {isAnalyzing ? `ANALYZING ${progress.current}/${progress.total}` : "REFRESH"}
            </button>
            <button
              onClick={exportToCSV}
              disabled={members.length === 0}
              className="relative flex items-center gap-2 text-[10px] font-mono text-zinc-400 hover:text-green-400 transition-colors px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-500/30 disabled:opacity-50 tracking-[0.2em] uppercase group"
            >
              <Download className="h-3 w-3" />
              EXPORT CSV
            </button>
            <button
              onClick={clearData}
              className="relative flex items-center gap-2 text-[10px] font-mono text-zinc-500 hover:text-red-400 transition-colors px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-red-500/30 tracking-[0.2em] uppercase"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Selected states indicator */}
        {selectedStates.size > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from(selectedStates)
                .slice(0, 8)
                .map((st) => null)}
              {selectedStates.size > 8 && (
                <span className="text-[9px] font-mono text-zinc-500">+{selectedStates.size - 8}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 flex-shrink-0">
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-4 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />

          <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white/50" />
            SENATE
          </h3>
          <div className="flex flex-wrap gap-4 text-[10px] font-mono tracking-wider">
            <button
              onClick={() => setStanceFilter(stanceFilter === "ally" ? null : "ally")}
              className={`flex items-center gap-2 transition-all ${stanceFilter === "ally" ? "ring-1 ring-blue-400/50 bg-blue-500/10 px-1.5 py-0.5 -mx-1.5 -my-0.5" : "hover:opacity-80"}`}
            >
              <div className="w-4 h-4 border-2 border-blue-400 bg-blue-400 flex items-center justify-center">
                <div className="w-2 h-2 bg-black" />
              </div>
              <span className="text-zinc-300">ALLY:</span>
              <span className="text-white">{stanceCounts.senate["ally"]}</span>
            </button>
            <button
              onClick={() => setStanceFilter(stanceFilter === "normalizer" ? null : "normalizer")}
              className={`flex items-center gap-2 transition-all ${stanceFilter === "normalizer" ? "ring-1 ring-amber-400/50 bg-amber-500/10 px-1.5 py-0.5 -mx-1.5 -my-0.5" : "hover:opacity-80"}`}
            >
              <div className="w-4 h-4 border-2 border-amber-400 bg-amber-400 flex items-center justify-center">
                <div className="w-2 h-2 bg-black" />
              </div>
              <span className="text-zinc-300">NORMALIZER:</span>
              <span className="text-white">{stanceCounts.senate["normalizer"]}</span>
            </button>
            <button
              onClick={() => setStanceFilter(stanceFilter === "neutral" ? null : "neutral")}
              className={`flex items-center gap-2 transition-all ${stanceFilter === "neutral" ? "ring-1 ring-zinc-400/50 bg-zinc-500/10 px-1.5 py-0.5 -mx-1.5 -my-0.5" : "hover:opacity-80"}`}
            >
              <div className="w-4 h-4 border-2 border-zinc-500 bg-zinc-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-black" />
              </div>
              <span className="text-zinc-300">NEUTRAL:</span>
              <span className="text-white">{stanceCounts.senate["neutral"]}</span>
            </button>
          </div>
        </div>

        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-4 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />

          <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white/50" />
            HOUSE
          </h3>
          <div className="flex flex-wrap gap-4 text-[10px] font-mono tracking-wider">
            <button
              onClick={() => setStanceFilter(stanceFilter === "ally" ? null : "ally")}
              className={`flex items-center gap-2 transition-all ${stanceFilter === "ally" ? "ring-1 ring-blue-400/50 bg-blue-500/10 px-1.5 py-0.5 -mx-1.5 -my-0.5" : "hover:opacity-80"}`}
            >
              <div className="w-4 h-4 border-2 border-blue-400 bg-blue-400 flex items-center justify-center">
                <div className="w-2 h-2 bg-black" />
              </div>
              <span className="text-zinc-300">ALLY:</span>
              <span className="text-white">{stanceCounts.house["ally"]}</span>
            </button>
            <button
              onClick={() => setStanceFilter(stanceFilter === "normalizer" ? null : "normalizer")}
              className={`flex items-center gap-2 transition-all ${stanceFilter === "normalizer" ? "ring-1 ring-amber-400/50 bg-amber-500/10 px-1.5 py-0.5 -mx-1.5 -my-0.5" : "hover:opacity-80"}`}
            >
              <div className="w-4 h-4 border-2 border-amber-400 bg-amber-400 flex items-center justify-center">
                <div className="w-2 h-2 bg-black" />
              </div>
              <span className="text-zinc-300">NORMALIZER:</span>
              <span className="text-white">{stanceCounts.house["normalizer"]}</span>
            </button>
            <button
              onClick={() => setStanceFilter(stanceFilter === "neutral" ? null : "neutral")}
              className={`flex items-center gap-2 transition-all ${stanceFilter === "neutral" ? "ring-1 ring-zinc-400/50 bg-zinc-500/10 px-1.5 py-0.5 -mx-1.5 -my-0.5" : "hover:opacity-80"}`}
            >
              <div className="w-4 h-4 border-2 border-zinc-500 bg-zinc-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-black" />
              </div>
              <span className="text-zinc-300">NEUTRAL:</span>
              <span className="text-white">{stanceCounts.house["neutral"]}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Bar */}
      {(stanceFilter || partyFilter !== "all" || tagFilters.size > 0 || committeeFilter) && (
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <span className="text-[9px] font-mono text-zinc-600 tracking-[0.2em] uppercase">FILTERS:</span>
          {stanceFilter && (
            <button
              onClick={() => setStanceFilter(null)}
              className={`flex items-center gap-1.5 px-2 py-1 text-[9px] font-mono tracking-wider border transition-all ${
                stanceFilter === "ally"
                  ? "text-blue-400 border-blue-400/30 bg-blue-500/10"
                  : stanceFilter === "normalizer"
                    ? "text-amber-400 border-amber-400/30 bg-amber-500/10"
                    : "text-zinc-400 border-zinc-600 bg-zinc-500/10"
              }`}
            >
              {getPositionLabel(stanceFilter).toUpperCase()}
              <X className="w-2.5 h-2.5" />
            </button>
          )}
          {partyFilter !== "all" && (
            <button
              onClick={() => setPartyFilter("all")}
              className={`flex items-center gap-1.5 px-2 py-1 text-[9px] font-mono tracking-wider border transition-all ${
                partyFilter === "R"
                  ? "text-red-400 border-red-400/30 bg-red-500/10"
                  : "text-blue-400 border-blue-400/30 bg-blue-500/10"
              }`}
            >
              {partyFilter === "R" ? "REPUBLICAN" : "DEMOCRAT"}
              <X className="w-2.5 h-2.5" />
            </button>
          )}
          {Array.from(tagFilters).map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTagFilter(tag)}
              className="flex items-center gap-1.5 px-2 py-1 text-[9px] font-mono tracking-wider border transition-all text-emerald-400 border-emerald-400/30 bg-emerald-500/10"
            >
              {tag.toUpperCase()}
              <X className="w-2.5 h-2.5" />
            </button>
          ))}
          {committeeFilter && (
            <button
              onClick={() => setCommitteeFilter(null)}
              className="flex items-center gap-1.5 px-2 py-1 text-[9px] font-mono tracking-wider border transition-all text-violet-400 border-violet-400/30 bg-violet-500/10"
            >
              {committeeFilter.toUpperCase()}
              <X className="w-2.5 h-2.5" />
            </button>
          )}
          <button
            onClick={() => { setStanceFilter(null); setPartyFilter("all"); setTagFilters(new Set()); setCommitteeFilter(null) }}
            className="text-[9px] font-mono text-zinc-600 hover:text-white tracking-wider transition-colors ml-1"
          >
            CLEAR ALL
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && members.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="flex gap-1">
            <div className="w-2 h-6 bg-white/20 skew-x-[-12deg] animate-pulse" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-6 bg-white/30 skew-x-[-12deg] animate-pulse" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-6 bg-white/20 skew-x-[-12deg] animate-pulse" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-[10px] font-mono text-zinc-500 tracking-[0.3em] uppercase">LOADING STANCES</span>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map - takes 2 of 3 columns */}
        <div className="lg:col-span-2 relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/20" />

          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
            {STATE_LAYOUT.flat().map((stateCode, idx) =>
              stateCode ? (
                <button
                  key={idx}
                  onClick={() => handleStateClick(stateCode)}
                  disabled={stateCode === "DC"}
                  className={`aspect-square flex items-center justify-center text-[8px] font-mono transition-all border ${getStateColorClass(stateCode)} ${
                    selectedStates.has(stateCode) ? "ring-1 ring-white border-white/40" : "border-zinc-700/50"
                  } ${stateCode === "DC" ? "cursor-not-allowed" : ""}`}
                  title={stateCode === "DC" ? "DC disabled" : STATE_CODE_TO_NAME[stateCode] || stateCode}
                >
                  {stateCode}
                </button>
              ) : (
                <div key={idx} className="aspect-square" />
              ),
            )}
          </div>
        </div>

        {/* Search Panel - takes 1 of 3 columns */}
        <div className="lg:col-span-1 relative bg-white/5 backdrop-blur-xl border border-white/10 p-4 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20" />

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">
              {selectedStates.size > 0
                ? `${selectedStates.size} STATE${selectedStates.size > 1 ? "S" : ""} SELECTED`
                : "MEMBER SEARCH"}
            </h3>
            {selectedStates.size > 0 && (
              <button
                onClick={clearSelectedStates}
                className="text-[10px] font-mono text-zinc-500 hover:text-white flex items-center gap-1 tracking-wider"
              >
                <X className="w-3 h-3" />
                CLEAR
              </button>
            )}
          </div>
          {selectedStates.size > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 mb-6">
              {Array.from(selectedStates).map((stateCode) => (
                <span
                  key={stateCode}
                  className="px-2 py-0.5 bg-white/10 border border-white/20 text-[10px] font-mono text-white tracking-wider"
                >
                  {stateCode}
                </span>
              ))}
            </div>
          )}

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..."
              className="w-full bg-black/30 border border-white/10 pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 font-mono tracking-wider"
            />
          </div>

          {/* Filters Toggle */}
          <div className="mb-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  FILTERS
                </span>
                {activeFilterCount > 0 && (
                  <span className="flex items-center justify-center min-w-[16px] h-4 px-1 text-[8px] font-mono bg-white/10 border border-white/20 text-white">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && !filtersOpen && (
                  <div className="flex items-center gap-1">
                    {chamberFilter !== "all" && (
                      <span className="px-1.5 py-0.5 text-[8px] font-mono tracking-wider bg-white/10 border border-white/20 text-zinc-300">
                        {chamberFilter === "senate" ? "SEN" : "HOUSE"}
                      </span>
                    )}
                    {partyFilter !== "all" && (
                      <span className={`px-1.5 py-0.5 text-[8px] font-mono tracking-wider border ${
                        partyFilter === "R"
                          ? "text-red-400 border-red-400/30 bg-red-500/10"
                          : "text-blue-400 border-blue-400/30 bg-blue-500/10"
                      }`}>
                        {partyFilter === "R" ? "GOP" : "DEM"}
                      </span>
                    )}
                    {stanceFilter && (
                      <span className={`px-1.5 py-0.5 text-[8px] font-mono tracking-wider border ${
                        stanceFilter === "ally"
                          ? "text-blue-400 border-blue-400/30 bg-blue-500/10"
                          : stanceFilter === "normalizer"
                            ? "text-amber-400 border-amber-400/30 bg-amber-500/10"
                            : "text-zinc-400 border-zinc-600 bg-zinc-500/10"
                      }`}>
                        {getPositionLabel(stanceFilter).toUpperCase()}
                      </span>
                    )}
                    {Array.from(tagFilters).map((tag) => (
                      <span key={tag} className="px-1.5 py-0.5 text-[8px] font-mono tracking-wider border text-emerald-400 border-emerald-400/30 bg-emerald-500/10">
                        {tag.toUpperCase()}
                      </span>
                    ))}
                    {committeeFilter && (
                      <span className="px-1.5 py-0.5 text-[8px] font-mono tracking-wider border text-violet-400 border-violet-400/30 bg-violet-500/10 max-w-[120px] truncate">
                        {committeeFilter.toUpperCase()}
                      </span>
                    )}
                  </div>
                )}
                <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform duration-200 ${filtersOpen ? "rotate-180" : ""}`} />
              </div>
            </button>

            {/* Collapsible Filter Content */}
            <div
              className={`overflow-hidden transition-all duration-200 ease-in-out ${
                filtersOpen ? "max-h-[450px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pt-2 space-y-2 border-x border-b border-white/10 px-3 pb-3">
                {/* Chamber Filter */}
                <div>
                  <span className="text-[8px] font-mono text-zinc-600 tracking-[0.2em] uppercase mb-1 block">CHAMBER</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setChamberFilter("all")}
                      className={`flex-1 px-2 py-1.5 text-[9px] font-mono tracking-[0.2em] uppercase transition-all border ${
                        chamberFilter === "all"
                          ? "bg-white/10 border-white/30 text-white"
                          : "bg-transparent border-white/10 text-zinc-500 hover:text-white hover:border-white/20"
                      }`}
                    >
                      ALL
                    </button>
                    <button
                      onClick={() => setChamberFilter("senate")}
                      className={`flex-1 px-2 py-1.5 text-[9px] font-mono tracking-[0.2em] uppercase transition-all border ${
                        chamberFilter === "senate"
                          ? "bg-white/10 border-white/30 text-white"
                          : "bg-transparent border-white/10 text-zinc-500 hover:text-white hover:border-white/20"
                      }`}
                    >
                      SENATE
                    </button>
                    <button
                      onClick={() => setChamberFilter("house")}
                      className={`flex-1 px-2 py-1.5 text-[9px] font-mono tracking-[0.2em] uppercase transition-all border ${
                        chamberFilter === "house"
                          ? "bg-white/10 border-white/30 text-white"
                          : "bg-transparent border-white/10 text-zinc-500 hover:text-white hover:border-white/20"
                      }`}
                    >
                      HOUSE
                    </button>
                  </div>
                </div>

                {/* Party Filter */}
                <div>
                  <span className="text-[8px] font-mono text-zinc-600 tracking-[0.2em] uppercase mb-1 block">PARTY</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPartyFilter("all")}
                      className={`flex-1 px-2 py-1.5 text-[9px] font-mono tracking-[0.2em] uppercase transition-all border ${
                        partyFilter === "all"
                          ? "bg-white/10 border-white/30 text-white"
                          : "bg-transparent border-white/10 text-zinc-500 hover:text-white hover:border-white/20"
                      }`}
                    >
                      ALL
                    </button>
                    <button
                      onClick={() => setPartyFilter("R")}
                      className={`flex-1 px-2 py-1.5 text-[9px] font-mono tracking-[0.2em] uppercase transition-all border ${
                        partyFilter === "R"
                          ? "bg-red-500/20 border-red-400/30 text-red-400"
                          : "bg-transparent border-white/10 text-zinc-500 hover:text-red-400 hover:border-red-400/20"
                      }`}
                    >
                      GOP
                    </button>
                    <button
                      onClick={() => setPartyFilter("D")}
                      className={`flex-1 px-2 py-1.5 text-[9px] font-mono tracking-[0.2em] uppercase transition-all border ${
                        partyFilter === "D"
                          ? "bg-blue-500/20 border-blue-400/30 text-blue-400"
                          : "bg-transparent border-white/10 text-zinc-500 hover:text-blue-400 hover:border-blue-400/20"
                      }`}
                    >
                      DEM
                    </button>
                  </div>
                </div>

                {/* Tags Filter */}
                {availableTags.length > 0 && (
                  <div>
                    <span className="text-[8px] font-mono text-zinc-600 tracking-[0.2em] uppercase mb-1 block">TAGS</span>
                    <div className="flex flex-wrap gap-1">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTagFilter(tag)}
                          className={`px-2 py-1.5 text-[9px] font-mono tracking-[0.15em] uppercase transition-all border ${
                            tagFilters.has(tag)
                              ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-400"
                              : "bg-transparent border-white/10 text-zinc-500 hover:text-emerald-400 hover:border-emerald-400/20"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Committee Filter */}
                {availableCommittees.length > 0 && (
                  <div>
                    <span className="text-[8px] font-mono text-zinc-600 tracking-[0.2em] uppercase mb-1 block">COMMITTEE</span>
                    <select
                      value={committeeFilter || ""}
                      onChange={(e) => setCommitteeFilter(e.target.value || null)}
                      className="w-full px-2 py-1.5 text-[9px] font-mono tracking-wider uppercase bg-transparent border border-white/10 text-zinc-300 appearance-none cursor-pointer hover:border-violet-400/30 focus:border-violet-400/50 focus:outline-none transition-all"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
                    >
                      <option value="" className="bg-zinc-900 text-zinc-300">ALL COMMITTEES</option>
                      {availableCommittees.map((c) => (
                        <option key={c} value={c} className="bg-zinc-900 text-zinc-300">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Clear all filters */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => { setChamberFilter("all"); setPartyFilter("all"); setStanceFilter(null); setTagFilters(new Set()); setCommitteeFilter(null) }}
                    className="w-full px-2 py-1.5 text-[8px] font-mono tracking-[0.2em] uppercase text-zinc-600 hover:text-white border border-white/5 hover:border-white/10 transition-all text-center"
                  >
                    CLEAR ALL FILTERS
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-0.5 max-h-[400px] overflow-y-auto">
            {filteredMembers.slice(0, 50).map((member, idx) => (
              <MemberListItem
                key={member.id}
                member={member}
                isSelected={selectedMemberId === member.id}
                isFirst={idx === 0}
                onSelect={() => setSelectedMemberId(selectedMemberId === member.id ? null : member.id)}
              />
            ))}
            {filteredMembers.length === 0 && (
              <p className="text-zinc-600 text-[10px] font-mono py-4 text-center tracking-wider">NO MEMBERS FOUND</p>
            )}
            {filteredMembers.length > 50 && (
              <p className="text-zinc-600 text-[10px] font-mono py-2 text-center tracking-wider">
                SHOWING 50 OF {filteredMembers.length}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Selected Member Detail Panel */}
      {selectedMember && (
        <div className="mt-6 relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20" />

          {/* White left border indicator */}
          <div className="absolute left-0 top-6 bottom-6 w-px bg-white/50" />

          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] block mb-1">
                MEMBER DETAILS
              </span>
              <h3 className="text-xl font-light text-white">{selectedMember.name}</h3>
            </div>
            <button
              onClick={() => setSelectedMemberId(null)}
              className="text-[10px] font-mono text-zinc-500 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 tracking-[0.2em] uppercase transition-colors"
            >
              CLOSE
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] block mb-2">
                  POSITION
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] px-2 py-1 border tracking-wider font-mono ${
                      selectedMember.party === "R"
                        ? "text-red-400 border-red-400/30 bg-red-500/10"
                        : selectedMember.party === "D"
                          ? "text-blue-400 border-blue-400/30 bg-blue-500/10"
                          : "text-zinc-400 border-zinc-700 bg-zinc-500/10"
                    }`}
                  >
                    {selectedMember.party}
                  </span>
                  <span className="text-white text-sm">
                    {selectedMember.role} - {STATE_CODE_TO_NAME[selectedMember.state] || selectedMember.state}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] block mb-2">
                  STANCE ON VENEZUELA
                </span>
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono tracking-wider border ${getPositionBg(selectedMember.position)} ${getPositionColor(selectedMember.position)}`}
                >
                  <div
                    className={`w-2 h-2 border ${selectedMember.position === "ally" ? "border-blue-400" : selectedMember.position === "normalizer" ? "border-amber-400" : "border-zinc-500"} flex items-center justify-center`}
                  >
                    <div
                      className={`w-1 h-1 ${selectedMember.position === "ally" ? "bg-blue-400" : selectedMember.position === "normalizer" ? "bg-amber-400" : "bg-zinc-500"}`}
                    />
                  </div>
                  {getPositionLabel(selectedMember.position).toUpperCase()}
                </span>
              </div>
              {selectedMember.committees && selectedMember.committees.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] block mb-2">
                    COMMITTEES
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedMember.committees.map((c) => (
                      <span
                        key={c}
                        className="text-[9px] font-mono tracking-wider px-2 py-1 border border-violet-400/20 bg-violet-500/10 text-violet-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedMember.confidence > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] block mb-2">
                    CONFIDENCE
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-white/50 transition-all"
                        style={{ width: `${selectedMember.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-white text-[10px] font-mono">
                      {Math.round(selectedMember.confidence * 100)}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Notes */}
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] block mb-2">
                ANALYSIS
              </span>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {selectedMember.analysisNotes || "No analysis notes available."}
              </p>
            </div>

            {/* Evidence */}
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] block mb-2">
                EVIDENCE
              </span>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {selectedMember.evidence.length > 0 ? (
                  selectedMember.evidence.map((e, i) => (
                    <div key={i} className="border-l border-white/20 pl-3 py-1">
                      <a
                        href={e.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-zinc-300 hover:text-white transition-colors block mb-1 font-mono tracking-wider"
                      >
                        {e.title || "SOURCE"}
                      </a>
                      <p className="text-[10px] text-zinc-600 line-clamp-2">{e.snippet}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-600 text-[10px] font-mono tracking-wider">NO EVIDENCE AVAILABLE</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes & Override Section */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">
                  NOTES & OVERRIDE
                </span>
                {selectedMember.hasOverride && selectedMember.overrideStance && !isEditingOverride && (
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 tracking-wider">
                    OVERRIDE ACTIVE
                  </span>
                )}
                {selectedMember.userNotes && !selectedMember.overrideStance && !isEditingOverride && (
                  <span className="text-[9px] font-mono px-2 py-0.5 bg-blue-500/20 border border-blue-500/40 text-blue-400 tracking-wider">
                    HAS NOTES
                  </span>
                )}
              </div>
              {!isEditingOverride ? (
                <button
                  onClick={() => startEditingOverride(selectedMember)}
                  className="text-[10px] font-mono text-zinc-500 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 tracking-[0.2em] uppercase transition-colors flex items-center gap-2"
                >
                  <Edit3 className="w-3 h-3" />
                  {selectedMember.hasOverride ? "EDIT" : "ADD NOTES"}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => saveOverride(selectedMember)}
                    disabled={isSavingOverride}
                    className="text-[10px] font-mono text-green-400 hover:text-green-300 border border-green-500/30 hover:border-green-500/50 px-3 py-1.5 tracking-[0.2em] uppercase transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-3 h-3" />
                    {isSavingOverride ? "SAVING..." : "SAVE"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingOverride(false)
                      setEditOverrideStance("")
                      setEditUserNotes("")
                    }}
                    className="text-[10px] font-mono text-zinc-500 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 tracking-[0.2em] uppercase transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-3 h-3" />
                    CANCEL
                  </button>
                </div>
              )}
            </div>

            {isEditingOverride ? (
              <div className="space-y-4">
                {/* Notes - always visible */}
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] block mb-2">
                    NOTES
                  </span>
                  <textarea
                    value={editUserNotes}
                    onChange={(e) => setEditUserNotes(e.target.value)}
                    placeholder="Add notes about this member's position on Venezuela..."
                    className="w-full bg-black/50 border border-white/20 px-3 py-2 text-xs text-white font-mono tracking-wider focus:outline-none focus:border-white/40 resize-none h-24"
                  />
                </div>
                
                {/* Override stance - optional */}
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] block mb-2">
                    OVERRIDE STANCE (OPTIONAL)
                  </span>
                  <select
                    value={editOverrideStance}
                    onChange={(e) => setEditOverrideStance(e.target.value)}
                    className="w-full bg-black/50 border border-white/20 px-3 py-2 text-xs text-white font-mono tracking-wider focus:outline-none focus:border-white/40"
                  >
                    <option value="">Use AI Analysis (No Override)</option>
                    <option value="ally">Ally</option>
                    <option value="normalizer">Normalizer</option>
                    <option value="neutral">Neutral</option>
                  </select>
                  <p className="text-[9px] text-zinc-600 mt-1 font-mono">
                    Leave as &quot;Use AI Analysis&quot; to keep the original stance and only add notes.
                  </p>
                </div>
                
                {selectedMember.hasOverride && (
                  <div>
                    <button
                      onClick={() => deleteOverride(selectedMember)}
                      className="text-[10px] font-mono text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 px-3 py-1.5 tracking-[0.2em] uppercase transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      REMOVE NOTES & OVERRIDE
                    </button>
                  </div>
                )}
              </div>
            ) : selectedMember.hasOverride ? (
              <div className="space-y-4">
                {selectedMember.overrideStance && (
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] block mb-2">
                      OVERRIDDEN STANCE
                    </span>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-mono tracking-wider border ${getPositionBg(selectedMember.overrideStance)} ${getPositionColor(selectedMember.overrideStance)}`}
                    >
                      {getPositionLabel(selectedMember.overrideStance).toUpperCase()}
                    </span>
                  </div>
                )}
                {selectedMember.userNotes && (
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] block mb-2">
                      USER NOTES
                    </span>
                    <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
                      {selectedMember.userNotes}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-zinc-600 text-[10px] font-mono tracking-wider">
                No notes or override set. Click &quot;ADD NOTES&quot; to add context or manually override this member&apos;s stance.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
