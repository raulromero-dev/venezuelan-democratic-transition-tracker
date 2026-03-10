import Link from "next/link"
import { ArrowRight } from "lucide-react"

const modules = [
  {
    label: "US OFFICIALS",
    href: "/us-officials",
    description: "Congressional stance mapping, executive branch monitoring, and real-time Senate & House X feeds.",
    tags: ["CONGRESSIONAL MAP", "STANCE ANALYSIS", "X FEEDS"],
  },
  {
    label: "GLOBAL INTELLIGENCE",
    href: "/global",
    description: "International diplomatic signals, foreign minister monitoring, and global statement tracking across 80+ nations.",
    tags: ["FOREIGN MINISTERS", "DIPLOMATIC SIGNALS", "RSS INTEL"],
  },
  {
    label: "OSINT FEEDS",
    href: "/osint",
    description: "Real-time open-source intelligence from think tanks, analysts, government sources, and influencer networks.",
    tags: ["THINK TANKS", "INFLUENCERS", "GOV SOURCES"],
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Grain overlay */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Scan line animation */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent animate-scan" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24">
        {/* Hero */}
        <div className="text-center mb-16 max-w-3xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/miranda-center-logo.png"
              alt="Miranda Center"
              className="h-16 w-auto opacity-90"
            />
          </div>

          <p className="text-[10px] font-mono text-zinc-500 tracking-[0.4em] uppercase mb-4">
            DEMOCRATIC &amp; ECONOMIC DEVELOPMENT
          </p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-4">
            Venezuelan Transition
            <br />
            <span className="text-zinc-400">Tracker</span>
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-6" />
          <p className="text-sm text-zinc-500 font-light max-w-lg mx-auto leading-relaxed">
            Open intelligence platform measuring democratic and economic progress across freedom of the press, liberty to organize, and economic activity.
          </p>
        </div>

        {/* Module Cards */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] overflow-hidden transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.15] hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]"
            >
              {/* Top reflection */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Corner gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-white/20 to-transparent" />
                <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-white/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8">
                <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-white/20 to-transparent" />
                <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-t from-white/20 to-transparent" />
              </div>

              <div className="relative z-10 p-6 flex flex-col h-full min-h-[220px]">
                <p className="text-[10px] font-mono text-zinc-500 tracking-[0.3em] uppercase mb-3">
                  {mod.label}
                </p>

                <p className="text-[13px] text-zinc-400 font-light leading-relaxed mb-6 flex-1">
                  {mod.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {mod.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-mono tracking-[0.15em] text-zinc-600 border border-white/[0.06] px-2 py-0.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Enter link */}
                <div className="flex items-center gap-2 text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  <div className="h-px flex-1 bg-white/[0.06] group-hover:bg-white/[0.12] transition-colors" />
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase">Enter</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer attribution */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/10" />
            <img
              src="/images/image.png"
              alt="Mofeta"
              className="h-5 w-auto opacity-40"
            />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/10" />
          </div>
          <p className="text-[9px] font-mono text-zinc-700 tracking-[0.2em] uppercase">
            Built by Mofeta &amp; The Miranda Center
          </p>
          <p className="text-[9px] font-mono text-zinc-800 mt-1">
            &copy; {new Date().getFullYear()} Miranda Center
          </p>
        </div>
      </main>
    </div>
  )
}
