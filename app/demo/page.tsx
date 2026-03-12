import Link from "next/link"
import { ArrowLeft, Newspaper, Users, TrendingUp } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { SentimentChart, MentionsChart, UsRelationsChart } from "@/components/pillar1-charts"

const pillars = [
  {
    icon: Newspaper,
    label: "Freedom of the Press",
    description: "Media Criticism Index measuring critical-to-supportive coverage ratio and topic emergence in Venezuelan media.",
  },
  {
    icon: Users,
    label: "Freedom of Assembly",
    description: "Assembly Freedom Index tracking protest activity with automated fact-checking and contextual enrichment.",
  },
  {
    icon: TrendingUp,
    label: "Economic Development",
    description: "Nightlight economic proxy, oil industry trajectory monitoring, and independent inflation tracking.",
  },
]

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-full px-5 py-2.5 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-[10px] font-display tracking-[0.15em] uppercase"
            >
              <ArrowLeft className="w-3 h-3" />
              Back
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-24 px-6">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-8 md:gap-16">
            <p className="text-sm text-muted-foreground">
              Demo
            </p>
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light font-sans leading-[1.15] mb-6">
                Three-pillar measurement system.
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
                The transition tracker will independently measure Venezuela&apos;s democratic and economic trajectory. This demo is under active development.
              </p>
            </div>
          </div>
        </div>

        {/* Pillar Cards */}
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-8 md:gap-16">
            <p className="text-sm text-muted-foreground">
              Pillars
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pillars.map((pillar) => (
                <div
                  key={pillar.label}
                  className="bg-muted/30 p-8 rounded-2xl border border-border relative"
                >
                  <pillar.icon className="w-6 h-6 text-muted-foreground mb-12" strokeWidth={1.5} />
                  <h3 className="text-xl md:text-2xl font-light font-sans mb-3">
                    {pillar.label}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                  <span className="absolute top-6 right-6 text-[9px] font-display tracking-[0.15em] uppercase text-muted-foreground/50 border border-border px-2 py-1 rounded-full">
                    In Progress
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pillar 1: Freedom of the Press */}
        <div className="max-w-7xl mx-auto mt-32 mb-24">
          <div className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-8 md:gap-16">
            <p className="text-sm text-muted-foreground">
              Pillar 1
            </p>
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-light font-sans leading-[1.15] mb-4">
                Freedom of the Press
              </h2>
              <p className="text-base text-muted-foreground font-light leading-relaxed">
                Analysis of 28 Venevisi&oacute;n broadcasts (Feb 25&ndash;Mar 10, 2026) processed through automated transcript classification. 530 news segments scored for political sentiment, entity coverage, and narrative framing.
              </p>
            </div>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-8 md:gap-16">
            <div>
              <p className="text-[10px] font-display tracking-[0.15em] uppercase text-muted-foreground mb-2">
                01
              </p>
              <p className="text-sm text-muted-foreground">
                Sentiment
              </p>
            </div>
            <div className="bg-muted/30 p-8 md:p-10 rounded-2xl border border-border">
              <h3 className="text-xl md:text-2xl font-light font-sans mb-2">
                Government vs. Opposition Coverage Tone
              </h3>
              <p className="text-sm text-muted-foreground mb-8">
                Daily average sentiment scores across all broadcasts. Government coverage consistently trends positive while opposition coverage remains near neutral.
              </p>
              <SentimentChart />
            </div>
          </div>
        </div>

        {/* Mentions Tracker */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-8 md:gap-16">
            <div>
              <p className="text-[10px] font-display tracking-[0.15em] uppercase text-muted-foreground mb-2">
                02
              </p>
              <p className="text-sm text-muted-foreground">
                Mentions
              </p>
            </div>
            <div className="bg-muted/30 p-8 md:p-10 rounded-2xl border border-border">
              <h3 className="text-xl md:text-2xl font-light font-sans mb-2">
                Political Figure Mention Frequency
              </h3>
              <p className="text-sm text-muted-foreground mb-8">
                Tracking how often key political figures appear across Venevisi&oacute;n&apos;s daily programming.
              </p>
              <MentionsChart />
            </div>
          </div>
        </div>

        {/* US Relations */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-8 md:gap-16">
            <div>
              <p className="text-[10px] font-display tracking-[0.15em] uppercase text-muted-foreground mb-2">
                03
              </p>
              <p className="text-sm text-muted-foreground">
                US Relations
              </p>
            </div>
            <div className="bg-muted/30 p-8 md:p-10 rounded-2xl border border-border">
              <h3 className="text-xl md:text-2xl font-light font-sans mb-2">
                US-Venezuela Coverage Narrative
              </h3>
              <p className="text-sm text-muted-foreground mb-8">
                Tone analysis of US-Venezuela relations coverage, with key narrative segments highlighted.
              </p>
              <UsRelationsChart />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-5 h-[2px] tricolor-line rounded-full" />
            <span className="text-[10px] font-display tracking-[0.25em] uppercase text-muted-foreground">
              Miranda Center
            </span>
          </div>
          <p className="text-xs text-muted-foreground/50">
            &copy; {new Date().getFullYear()} Miranda Center
          </p>
        </div>
      </footer>
    </div>
  )
}
