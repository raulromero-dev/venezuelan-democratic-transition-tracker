import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const pillars = [
  {
    number: "01",
    label: "FREEDOM OF THE PRESS",
    description: "Media Criticism Index measuring critical-to-supportive coverage ratio and topic emergence in Venezuelan media.",
  },
  {
    number: "02",
    label: "PROTESTS & LIBERTY TO ORGANIZE",
    description: "Assembly Freedom Index tracking protest activity with automated fact-checking and contextual enrichment.",
  },
  {
    number: "03",
    label: "ECONOMIC ACTIVITY & INFLATION",
    description: "Nightlight economic proxy, oil industry trajectory monitoring, and independent inflation tracking.",
  },
]

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Tricolor accent line */}
      <div className="fixed top-0 left-0 right-0 h-[2px] tricolor-line z-50 opacity-60" />

      {/* Theme toggle */}
      <div className="fixed top-4 right-6 z-50">
        <ThemeToggle />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24">
        {/* Back link */}
        <div className="w-full max-w-2xl mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-xs font-display tracking-wide"
          >
            <ArrowLeft className="w-3 h-3" />
            BACK
          </Link>
        </div>

        <div className="text-center mb-16 max-w-2xl">
          <p className="text-[10px] font-display text-muted-foreground tracking-[0.4em] uppercase mb-4">
            THREE-PILLAR MEASUREMENT SYSTEM
          </p>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-4 font-display">
            Demo
          </h1>
          <div className="w-32 h-px tricolor-line mx-auto mb-6 opacity-40" />
          <p className="text-sm text-muted-foreground font-light leading-relaxed">
            The transition tracker will independently measure Venezuela&apos;s democratic and economic trajectory across three pillars. This demo is under active development.
          </p>
        </div>

        {/* Pillar Cards */}
        <div className="w-full max-w-2xl space-y-4">
          {pillars.map((pillar) => (
            <div
              key={pillar.number}
              className="relative overflow-hidden backdrop-blur-xl border p-6
                dark:bg-white/[0.02] dark:border-white/[0.06]
                bg-white/60 border-black/[0.04]"
            >
              {/* Top reflection */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent dark:via-white/10 via-black/[0.04] to-transparent" />

              <div className="flex items-start gap-6">
                <span className="text-2xl font-light text-muted-foreground/30 font-display">{pillar.number}</span>
                <div>
                  <p className="text-[10px] font-display text-muted-foreground tracking-[0.3em] uppercase mb-2">
                    {pillar.label}
                  </p>
                  <p className="text-[13px] text-muted-foreground/70 font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>

              {/* Coming soon overlay */}
              <div className="absolute top-4 right-4">
                <span className="text-[8px] font-display tracking-[0.2em] uppercase text-muted-foreground/40 border dark:border-white/[0.06] border-black/[0.06] px-2 py-0.5">
                  IN PROGRESS
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="w-16 h-px tricolor-line mx-auto mb-4 opacity-30" />
          <p className="text-[9px] font-display text-muted-foreground/30 tracking-[0.2em] uppercase">
            &copy; {new Date().getFullYear()} Miranda Center
          </p>
        </div>
      </main>
    </div>
  )
}
