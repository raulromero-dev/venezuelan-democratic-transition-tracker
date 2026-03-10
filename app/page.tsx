import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const sections = [
  {
    label: "EXISTING WORK",
    href: "/existing-work",
    description: "Congressional stance mapping, global intelligence monitoring, and real-time OSINT feeds built during Operation Southern Spear.",
    tags: ["US OFFICIALS", "GLOBAL INTEL", "OSINT FEEDS"],
    status: "LIVE",
  },
  {
    label: "DEMO",
    href: "/demo",
    description: "Preview of the three-pillar measurement system: press freedom index, protest monitoring, and economic activity tracking.",
    tags: ["PRESS FREEDOM", "PROTESTS", "ECONOMIC INDEX"],
    status: "COMING SOON",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Tricolor accent line at very top */}
      <div className="fixed top-0 left-0 right-0 h-[2px] tricolor-line z-50 opacity-60" />

      {/* Theme toggle */}
      <div className="fixed top-4 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Grain overlay — dark only */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-40 dark:block hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Scan line animation — dark only */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden dark:block hidden">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent animate-scan" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24">
        {/* Hero */}
        <div className="text-center mb-16 max-w-3xl">
          <p className="text-[10px] font-display text-muted-foreground tracking-[0.4em] uppercase mb-4">
            DEMOCRATIC &amp; ECONOMIC DEVELOPMENT
          </p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4 font-display">
            Venezuelan Transition
            <br />
            <span className="text-muted-foreground">Tracker</span>
          </h1>

          {/* Tricolor divider */}
          <div className="w-32 h-px tricolor-line mx-auto mb-6 opacity-40" />

          <p className="text-sm text-muted-foreground font-light max-w-lg mx-auto leading-relaxed">
            Open intelligence platform measuring democratic and economic progress across freedom of the press, liberty to organize, and economic activity.
          </p>
        </div>

        {/* Section Cards */}
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group relative overflow-hidden transition-all duration-300 backdrop-blur-xl border
                dark:bg-white/[0.03] dark:border-white/[0.08] dark:hover:bg-white/[0.06] dark:hover:border-white/[0.15] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]
                bg-white/80 border-black/[0.06] hover:bg-white hover:border-black/[0.12] hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
            >
              {/* Top reflection */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent dark:via-white/20 via-black/[0.06] to-transparent" />

              {/* Tricolor glow on hover */}
              <div className="absolute inset-x-0 top-0 h-24 tricolor-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-10 h-10">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r dark:from-white/20 from-black/10 to-transparent" />
                <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b dark:from-white/20 from-black/10 to-transparent" />
              </div>
              <div className="absolute bottom-0 right-0 w-10 h-10">
                <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l dark:from-white/20 from-black/10 to-transparent" />
                <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-t dark:from-white/20 from-black/10 to-transparent" />
              </div>

              <div className="relative z-10 p-8 flex flex-col h-full min-h-[260px]">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-display text-muted-foreground tracking-[0.3em] uppercase">
                    {section.label}
                  </p>
                  <span className={`text-[8px] font-display tracking-[0.2em] uppercase px-2 py-0.5 border ${
                    section.status === "LIVE"
                      ? "dark:text-emerald-400 dark:border-emerald-400/20 text-emerald-600 border-emerald-600/20"
                      : "text-muted-foreground dark:border-white/10 border-black/10"
                  }`}>
                    {section.status}
                  </span>
                </div>

                <p className="text-[13px] text-muted-foreground font-light leading-relaxed mb-8 flex-1">
                  {section.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {section.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-display tracking-[0.15em] text-muted-foreground/60 border dark:border-white/[0.06] border-black/[0.06] px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Enter link */}
                <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                  <div className="h-px flex-1 dark:bg-white/[0.06] bg-black/[0.06] dark:group-hover:bg-white/[0.12] group-hover:bg-black/[0.12] transition-colors" />
                  <span className="text-[10px] font-display tracking-[0.2em] uppercase">Enter</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer attribution */}
        <div className="mt-20 text-center">
          <div className="w-16 h-px tricolor-line mx-auto mb-4 opacity-30" />
          <p className="text-[9px] font-display text-muted-foreground/50 tracking-[0.2em] uppercase">
            Built by Mofeta &amp; The Miranda Center
          </p>
          <p className="text-[9px] font-display text-muted-foreground/30 mt-1">
            &copy; {new Date().getFullYear()} Miranda Center
          </p>
        </div>
      </main>
    </div>
  )
}
