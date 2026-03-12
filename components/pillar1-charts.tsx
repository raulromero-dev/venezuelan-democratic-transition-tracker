"use client"

import dailySentiment from "@/press-freedom/data/analysis/daily-sentiment.json"
import dailyMentions from "@/press-freedom/data/analysis/daily-mentions.json"
import dailyUsRelations from "@/press-freedom/data/analysis/daily-us-relations.json"

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso + "T12:00:00")
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function lerp(min: number, max: number, t: number) {
  return min + (max - min) * t
}

// ─── Sentiment Time Series ──────────────────────────────────────────────────

export function SentimentChart() {
  const data = dailySentiment as Array<{
    date: string
    aggregated: { avgGovernmentSentiment: number; avgOppositionSentiment: number; totalPoliticalChunks: number }
  }>

  const yMin = -0.1
  const yMax = 0.5
  const w = 800
  const h = 300
  const padL = 50
  const padR = 20
  const padT = 20
  const padB = 40
  const chartW = w - padL - padR
  const chartH = h - padT - padB

  function toX(i: number) {
    return padL + (i / (data.length - 1)) * chartW
  }
  function toY(v: number) {
    return padT + chartH - ((v - yMin) / (yMax - yMin)) * chartH
  }

  const govLine = data.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(d.aggregated.avgGovernmentSentiment)}`).join(" ")
  const oppLine = data.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(d.aggregated.avgOppositionSentiment)}`).join(" ")

  const yTicks = [-0.1, 0, 0.1, 0.2, 0.3, 0.4, 0.5]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="w-3 h-[2px] bg-foreground inline-block" />
          Government
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-[2px] bg-foreground/30 inline-block" />
          Opposition
        </span>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={padL} y1={toY(tick)} x2={w - padR} y2={toY(tick)} stroke="currentColor" strokeOpacity={tick === 0 ? 0.3 : 0.08} strokeDasharray={tick === 0 ? "none" : "4 4"} />
            <text x={padL - 8} y={toY(tick) + 4} textAnchor="end" fill="currentColor" fillOpacity={0.4} fontSize={10} fontFamily="var(--font-display)">
              {tick.toFixed(1)}
            </text>
          </g>
        ))}

        {/* X axis labels */}
        {data.map((d, i) => (
          <text key={d.date} x={toX(i)} y={h - 8} textAnchor="middle" fill="currentColor" fillOpacity={0.4} fontSize={9} fontFamily="var(--font-display)">
            {formatDate(d.date)}
          </text>
        ))}

        {/* Opposition line */}
        <path d={oppLine} fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={2} />

        {/* Government line */}
        <path d={govLine} fill="none" stroke="currentColor" strokeOpacity={0.8} strokeWidth={2} />

        {/* Data points */}
        {data.map((d, i) => (
          <g key={d.date}>
            <circle cx={toX(i)} cy={toY(d.aggregated.avgGovernmentSentiment)} r={3} fill="currentColor" fillOpacity={0.8} />
            <circle cx={toX(i)} cy={toY(d.aggregated.avgOppositionSentiment)} r={3} fill="currentColor" fillOpacity={0.2} />
          </g>
        ))}
      </svg>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Daily average sentiment scores across all Venevisi&oacute;n broadcasts. Scores range from -1 (most negative) to +1 (most positive). Government coverage trends positive (0.06&ndash;0.40), while opposition coverage remains near neutral (0.00&ndash;0.08), suggesting limited substantive opposition coverage.
      </p>
    </div>
  )
}

// ─── Mentions Bar Chart ─────────────────────────────────────────────────────

const ENTITY_LABELS: Record<string, string> = {
  donaldTrump: "Donald Trump",
  lauraDogu: "Laura Dogu",
  juanPabloGuanipa: "Juan Pablo Guanipa",
  mariaCorinaMachado: "Mar\u00eda Corina Machado",
  edmundoGonzalez: "Edmundo Gonz\u00e1lez",
}

const TRACKED_ENTITIES = ["donaldTrump", "lauraDogu", "juanPabloGuanipa", "mariaCorinaMachado", "edmundoGonzalez"] as const

export function MentionsChart() {
  const data = dailyMentions as Array<{
    date: string
    entities: Record<string, { total: number; byShow: Record<string, number> }>
  }>

  // Aggregate totals across all days for each entity
  const totals = TRACKED_ENTITIES.map((key) => ({
    key,
    label: ENTITY_LABELS[key],
    total: data.reduce((sum, d) => sum + (d.entities[key]?.total ?? 0), 0),
  })).sort((a, b) => b.total - a.total)

  const maxTotal = Math.max(...totals.map((t) => t.total), 1)

  return (
    <div className="space-y-6">
      {/* Totals summary */}
      <div className="space-y-4">
        {totals.map((entity) => (
          <div key={entity.key} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className={entity.total > 0 ? "text-foreground" : "text-muted-foreground"}>{entity.label}</span>
              <span className="text-muted-foreground font-display text-xs">{entity.total}</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground/60 rounded-full transition-all"
                style={{ width: `${(entity.total / maxTotal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Daily breakdown table */}
      <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-normal font-display">Date</th>
              <th className="text-right py-2 px-2 text-muted-foreground font-normal font-display">Trump</th>
              <th className="text-right py-2 px-2 text-muted-foreground font-normal font-display">Dogu</th>
              <th className="text-right py-2 px-2 text-muted-foreground font-normal font-display">Guanipa</th>
              <th className="text-right py-2 px-2 text-muted-foreground font-normal font-display">Machado</th>
              <th className="text-right py-2 pl-2 text-muted-foreground font-normal font-display">Gonz&aacute;lez</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.date} className="border-b border-border/50">
                <td className="py-2 pr-4 text-muted-foreground font-display">{formatDate(d.date)}</td>
                <td className="py-2 px-2 text-right font-display">{d.entities.donaldTrump?.total || <span className="text-muted-foreground/30">&mdash;</span>}</td>
                <td className="py-2 px-2 text-right font-display">{d.entities.lauraDogu?.total || <span className="text-muted-foreground/30">&mdash;</span>}</td>
                <td className="py-2 px-2 text-right font-display">{d.entities.juanPabloGuanipa?.total || <span className="text-muted-foreground/30">&mdash;</span>}</td>
                <td className="py-2 px-2 text-right font-display">{d.entities.mariaCorinaMachado?.total || <span className="text-muted-foreground/30">&mdash;</span>}</td>
                <td className="py-2 pl-2 text-right font-display">{d.entities.edmundoGonzalez?.total || <span className="text-muted-foreground/30">&mdash;</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Daily mention counts across all broadcasts. Trump dominates coverage (144 total mentions), reflecting the centrality of US-Venezuela relations. Opposition leaders Machado and Gonz&aacute;lez are notably absent from Venevisi&oacute;n&apos;s coverage, a significant signal for press freedom measurement.
      </p>
    </div>
  )
}

// ─── US Relations Narrative ─────────────────────────────────────────────────

export function UsRelationsChart() {
  const data = dailyUsRelations as Array<{
    date: string
    avgTone: number | null
    relevantChunkCount: number
    topSegments: Array<{ summary: string; tone: number }>
  }>

  const w = 800
  const h = 260
  const padL = 50
  const padR = 20
  const padT = 20
  const padB = 40
  const chartW = w - padL - padR
  const chartH = h - padT - padB

  const yMin = -0.3
  const yMax = 0.6

  function toX(i: number) {
    return padL + (i / (data.length - 1)) * chartW
  }
  function toY(v: number) {
    return padT + chartH - ((v - yMin) / (yMax - yMin)) * chartH
  }

  const yTicks = [-0.2, 0, 0.2, 0.4, 0.6]
  const validData = data.filter((d) => d.avgTone !== null)

  // Build line path and area fill
  const linePath = data.map((d, i) => {
    if (d.avgTone === null) return ""
    return `${i === 0 || data[i - 1]?.avgTone === null ? "M" : "L"}${toX(i)},${toY(d.avgTone)}`
  }).join(" ")

  // Build area path (fill to zero line)
  const areaSegments: string[] = []
  let segStart = -1
  for (let i = 0; i <= data.length; i++) {
    const tone = i < data.length ? data[i].avgTone : null
    if (tone !== null && segStart === -1) segStart = i
    if ((tone === null || i === data.length) && segStart !== -1) {
      const end = i - 1
      let path = `M${toX(segStart)},${toY(0)}`
      for (let j = segStart; j <= end; j++) path += ` L${toX(j)},${toY(data[j].avgTone!)}`
      path += ` L${toX(end)},${toY(0)} Z`
      areaSegments.push(path)
      segStart = -1
    }
  }

  return (
    <div className="space-y-6">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid */}
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={padL} y1={toY(tick)} x2={w - padR} y2={toY(tick)} stroke="currentColor" strokeOpacity={tick === 0 ? 0.3 : 0.08} strokeDasharray={tick === 0 ? "none" : "4 4"} />
            <text x={padL - 8} y={toY(tick) + 4} textAnchor="end" fill="currentColor" fillOpacity={0.4} fontSize={10} fontFamily="var(--font-display)">
              {tick.toFixed(1)}
            </text>
          </g>
        ))}

        {/* X axis */}
        {data.map((d, i) => (
          <text key={d.date} x={toX(i)} y={h - 8} textAnchor="middle" fill="currentColor" fillOpacity={0.4} fontSize={9} fontFamily="var(--font-display)">
            {formatDate(d.date)}
          </text>
        ))}

        {/* Area fill */}
        {areaSegments.map((seg, i) => (
          <path key={i} d={seg} fill="currentColor" fillOpacity={0.06} />
        ))}

        {/* Line */}
        <path d={linePath} fill="none" stroke="currentColor" strokeOpacity={0.6} strokeWidth={2} />

        {/* Points with size by chunk count */}
        {data.map((d, i) =>
          d.avgTone !== null ? (
            <circle
              key={d.date}
              cx={toX(i)}
              cy={toY(d.avgTone)}
              r={Math.max(3, Math.min(7, d.relevantChunkCount / 3))}
              fill="currentColor"
              fillOpacity={0.5}
            />
          ) : null
        )}
      </svg>

      {/* Key segments timeline */}
      <div className="space-y-3">
        {data
          .filter((d) => d.topSegments.length > 0)
          .slice(-4)
          .map((d) => (
            <div key={d.date} className="border-l-2 border-border pl-4 py-1">
              <p className="text-[10px] font-display tracking-[0.1em] uppercase text-muted-foreground mb-1">
                {formatDate(d.date)} &middot; Tone: {d.avgTone?.toFixed(2)} &middot; {d.relevantChunkCount} segments
              </p>
              <p className="text-xs text-muted-foreground/80 leading-relaxed">
                {d.topSegments[0]?.summary}
              </p>
            </div>
          ))}
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        US-Venezuela relations coverage tone over time. Point size reflects segment count. Coverage shifted sharply positive around March 4&ndash;6 during Secretary Burgum&apos;s visit and the embassy reopening announcement, with tone peaking at +0.50.
      </p>
    </div>
  )
}
