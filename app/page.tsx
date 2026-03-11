import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { Newspaper, Users, TrendingUp } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-full px-5 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-[2px] tricolor-line rounded-full" />
              <span className="text-[10px] font-display tracking-[0.25em] uppercase text-muted-foreground">
                Miranda Center
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                href="/demo"
                className="px-4 py-2 bg-foreground text-background text-[10px] font-display tracking-[0.15em] uppercase hover:bg-foreground/90 transition-colors duration-300 rounded-full"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Video Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/video/mofeta-miranda.mp4" type="video/mp4" />
        </video>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-light tracking-tight font-sans text-white leading-[1.05]">
            Venezuelan
            <br />
            Transition
            <br />
            Tracker
          </h1>
        </div>
      </section>

      {/* Why This Exists - Asymmetric Layout */}
      <section id="about" className="px-6 py-32 md:py-48 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-8 md:gap-16">
            <p className="text-sm text-muted-foreground">
              Why this exists
            </p>
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-sans leading-[1.15] mb-6">
                Tracking Venezuela's democratic transition through measurable indices.
              </h2>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
                Leveraging human data and artificial intelligence to create transparent, reproducible metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars - Card Style like world.org */}
      <section className="px-6 py-24 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-8 md:gap-16">
            <p className="text-sm text-muted-foreground">
              Three pillars
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pillar 1 */}
              <div className="bg-background p-8 md:p-10 rounded-2xl border border-border">
                <Newspaper className="w-6 h-6 text-muted-foreground mb-16" strokeWidth={1.5} />
                <h3 className="text-2xl md:text-3xl font-light font-sans mb-4">
                  Freedom of the Press
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Track criticism of the regime and presence of opposition leaders in Venezuelan media.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="bg-background p-8 md:p-10 rounded-2xl border border-border">
                <Users className="w-6 h-6 text-muted-foreground mb-16" strokeWidth={1.5} />
                <h3 className="text-2xl md:text-3xl font-light font-sans mb-4">
                  Freedom of Assembly
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Track protests and government response to opposition gatherings.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-background p-8 md:p-10 rounded-2xl border border-border md:col-span-1">
                <TrendingUp className="w-6 h-6 text-muted-foreground mb-16" strokeWidth={1.5} />
                <h3 className="text-2xl md:text-3xl font-light font-sans mb-4">
                  Economic Development
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Inflation, economic growth, and oil industry development monitoring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Indices - Full Width Images */}
      <section className="px-6 py-32 md:py-48">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-8 md:gap-16 mb-16">
            <p className="text-sm text-muted-foreground">
              The indices
            </p>
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-sans leading-[1.15]">
                Measurable progress toward democracy.
              </h2>
            </div>
          </div>

          {/* Images Row */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="/images/pillar-1.jpg"
                alt="Press freedom monitoring"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="/images/pillar-2.jpg"
                alt="Assembly tracking"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="/images/pillar-3.jpg"
                alt="Economic indicators"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Previous Work - Asymmetric */}
      <section className="px-6 py-32 md:py-48 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-8 md:gap-16">
            <p className="text-sm text-muted-foreground">
              Previous work
            </p>
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-sans leading-[1.15] mb-6 max-w-2xl">
                Built on real-world impact.
              </h2>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-xl mb-12">
                The Miranda Center's OSINT dashboard was shared with Venezuelan opposition leadership, informing engagements with US diplomatic and intelligence personnel.
              </p>

              {/* Single Card */}
              <Link 
                href="/existing-work"
                className="group inline-flex items-center gap-4 p-6 md:p-8 bg-muted/50 rounded-2xl transition-all duration-300 hover:bg-muted"
              >
                <div>
                  <h3 className="text-lg md:text-xl font-light font-sans mb-1">
                    Mofeta OSINT Dashboard
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    View the intelligence infrastructure
                  </p>
                </div>
                <svg 
                  className="w-5 h-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

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
            Mofeta &amp; The Miranda Center
          </p>
        </div>
      </footer>
    </div>
  )
}
