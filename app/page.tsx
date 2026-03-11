import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-5">
        <div className="max-w-6xl mx-auto">
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

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-5xl">
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6 font-sans text-balance leading-[1]">
            Venezuelan Transition Tracker
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-md mx-auto leading-relaxed mb-16">
            Open intelligence for democracy.
          </p>

          {/* Macaw */}
          <div className="relative w-64 h-44 md:w-80 md:h-56 lg:w-[420px] lg:h-[280px] mx-auto">
            <Image
              src="/images/macaw.svg"
              alt="Macaw - Symbol of Venezuelan freedom"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 bg-border relative overflow-hidden">
            <div className="w-full h-4 bg-foreground/30 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="px-6 py-32 md:py-40">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl md:text-3xl lg:text-4xl font-light font-sans leading-snug text-balance">
            Tracking Venezuela's democratic transition through measurable indices, leveraging human data and artificial intelligence.
          </p>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="px-6 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          {/* Section Label */}
          <p className="text-[10px] font-display tracking-[0.3em] uppercase text-muted-foreground mb-16 text-center">
            Three Pillars
          </p>

          {/* Pillars Grid */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* Pillar 1 */}
            <div className="group">
              <div className="relative aspect-[3/4] mb-8 rounded-2xl overflow-hidden bg-muted">
                <Image
                  src="/images/pillar-1.jpg"
                  alt="Freedom of the Press"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg md:text-xl font-light font-sans mb-2">
                Freedom of the Press
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track criticism of the regime and presence of opposition leaders in Venezuelan media.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="group">
              <div className="relative aspect-[3/4] mb-8 rounded-2xl overflow-hidden bg-muted">
                <Image
                  src="/images/pillar-2.jpg"
                  alt="Freedom of Assembly"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg md:text-xl font-light font-sans mb-2">
                Freedom of Assembly
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track protests and government response to opposition gatherings.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="group">
              <div className="relative aspect-[3/4] mb-8 rounded-2xl overflow-hidden bg-muted">
                <Image
                  src="/images/pillar-3.jpg"
                  alt="Economic Development"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg md:text-xl font-light font-sans mb-2">
                Economic Development
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Inflation, economic growth, and oil industry development monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Previous Work */}
      <section className="px-6 py-32 md:py-40">
        <div className="max-w-4xl mx-auto">
          {/* Section Label */}
          <p className="text-[10px] font-display tracking-[0.3em] uppercase text-muted-foreground mb-6 text-center">
            Previous Work
          </p>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-sans text-center mb-6 text-balance leading-tight">
            Built on real-world impact.
          </h2>

          {/* Description */}
          <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed text-center max-w-2xl mx-auto mb-20">
            The Miranda Center's OSINT dashboard was shared with Venezuelan opposition leadership during Operation Southern Spear, informing engagements with US diplomatic and intelligence personnel.
          </p>

          {/* Card */}
          <Link 
            href="/existing-work"
            className="group block max-w-xl mx-auto"
          >
            <div className="relative p-8 md:p-10 border border-border rounded-2xl transition-all duration-500 hover:border-foreground/15 hover:shadow-lg hover:shadow-foreground/[0.03]">
              {/* Mini Dashboard Preview */}
              <div className="mb-8 space-y-3">
                <div className="flex gap-2">
                  <div className="h-1.5 w-12 bg-foreground/10 rounded-full" />
                  <div className="h-1.5 w-20 bg-foreground/5 rounded-full" />
                  <div className="h-1.5 w-8 bg-foreground/8 rounded-full" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="aspect-[4/3] bg-muted rounded-lg" />
                  <div className="aspect-[4/3] bg-muted rounded-lg" />
                  <div className="aspect-[4/3] bg-muted rounded-lg" />
                </div>
              </div>

              {/* Card Content */}
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-base md:text-lg font-light font-sans mb-1">
                    Mofeta OSINT Dashboard
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Intelligence infrastructure for the Venezuelan transition
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full border border-border flex items-center justify-center shrink-0 transition-all duration-300 group-hover:border-foreground/20 group-hover:bg-foreground/[0.03]">
                  <svg 
                    className="w-3.5 h-3.5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-5 h-[2px] tricolor-line rounded-full" />
            <span className="text-[10px] font-display tracking-[0.25em] uppercase text-muted-foreground">
              Miranda Center
            </span>
          </div>
          <p className="text-[10px] font-display text-muted-foreground/50 tracking-[0.15em] uppercase">
            Mofeta &amp; The Miranda Center
          </p>
        </div>
      </footer>
    </div>
  )
}
