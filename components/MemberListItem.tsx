"use client"

import { cn } from "@/lib/utils"

type Position = "ally" | "neutral" | "normalizer"
type Party = "R" | "D" | "I"
type Role = "Senator" | "Representative"

interface CongressMember {
  id: string
  name: string
  role: Role
  party: Party
  state: string
  district?: string
  position: Position
  confidence: number
}

interface MemberListItemProps {
  member: CongressMember
  isSelected?: boolean
  isFirst?: boolean
  onSelect: () => void
}

const getPosColor = (pos: Position): string => {
  switch (pos) {
    case "ally":
      return "border-blue-400"
    case "normalizer":
      return "border-amber-400"
    case "neutral":
    default:
      return "border-zinc-500"
  }
}

const getPosBgColor = (pos: Position): string => {
  switch (pos) {
    case "ally":
      return "bg-blue-400"
    case "normalizer":
      return "bg-amber-400"
    case "neutral":
    default:
      return "bg-zinc-500"
  }
}

const getPosTextColor = (pos: Position): string => {
  switch (pos) {
    case "ally":
      return "text-blue-400"
    case "normalizer":
      return "text-amber-400"
    case "neutral":
    default:
      return "text-zinc-500"
  }
}

const getPosLabel = (pos: Position): string => {
  switch (pos) {
    case "ally":
      return "ALLY"
    case "normalizer":
      return "NORM"
    case "neutral":
    default:
      return "NEUTRAL"
  }
}

const getPosHexColor = (pos: Position): string => {
  switch (pos) {
    case "ally":
      return "#60a5fa" // blue-400
    case "normalizer":
      return "#fbbf24" // amber-400
    case "neutral":
    default:
      return "#71717a" // zinc-500
  }
}

export function MemberListItem({ member, isSelected, isFirst, onSelect }: MemberListItemProps) {
  const positionColor = getPosHexColor(member.position as Position)

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-3 p-3 transition-all text-left group relative",
        // White left border for selected item
        isSelected ? "border-l-2 border-l-white bg-white/5" : "border-l-2 border-l-transparent hover:bg-white/5",
      )}
    >
      <div
        className="w-5 h-5 flex items-center justify-center flex-shrink-0"
        style={{
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: positionColor,
          backgroundColor: positionColor,
        }}
      >
        <div className="w-2.5 h-2.5 bg-black" />
      </div>

      {/* Member info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white font-medium truncate">{member.name}</span>
          {/* Party badge */}
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.5 border font-mono tracking-wider flex-shrink-0",
              member.party === "R"
                ? "text-red-400 border-red-400/30 bg-red-500/10"
                : member.party === "D"
                  ? "text-blue-400 border-blue-400/30 bg-blue-500/10"
                  : "text-zinc-400 border-zinc-700 bg-zinc-500/10",
            )}
          >
            {member.party}
          </span>
        </div>
        <div className="text-[11px] text-zinc-500 font-mono mt-0.5 tracking-wider">
          {member.role === "Senator" ? "SEN" : "REP"} · {member.state}
          {member.district && ` · D${member.district}`}
        </div>
      </div>

      <span
        className={cn(
          "text-[10px] uppercase tracking-[0.15em] font-mono px-1.5 py-0.5 flex-shrink-0",
          getPosTextColor(member.position as Position),
        )}
      >
        {getPosLabel(member.position as Position)}
      </span>
    </button>
  )
}
