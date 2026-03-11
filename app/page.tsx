import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-full px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-[2px] tricolor-line rounded-full" />
              <span className="text-[10px] font-display tracking-[0.3em] uppercase text-muted-foreground">
                MIRANDA CENTER
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/demo"
                className="px-5 py-2 bg-foreground text-background text-[11px] font-display tracking-[0.15em] uppercase hover:bg-foreground/90 transition-colors duration-300 rounded-full"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        {/* Hero Text */}
        <div className="text-center max-w-4xl mb-12">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight mb-8 font-sans text-balance leading-[0.95]">
            Venezuelan
            <br />
            Transition Tracker.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-lg mx-auto leading-relaxed">
            Open intelligence for democracy.
          </p>
        </div>

        {/* Macaw Image - Main Element */}
        <div className="relative w-72 h-48 md:w-96 md:h-64 lg:w-[500px] lg:h-[320px] transition-transform duration-500 hover:scale-[1.02]">
          <Image
            src="/images/macaw.svg"
            alt="Macaw - Symbol of Venezuelan freedom"
            fill
            className="object-contain"
            priority
          />
        </div>
      </section>

      {/* Pillars Section */}
      <section className="px-6 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          {/* Section Description */}
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto text-center mb-20">
            Tracking Venezuela's democratic transition through measurable indices, leveraging human data and artificial intelligence.
          </p>

          {/* Three Pillars */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Pillar 1: Freedom of the Press */}
            <div className="group">
              <div className="relative aspect-[4/5] mb-6 rounded-3xl overflow-hidden bg-muted">
                <Image
                  src="/images/pillar-1.jpg"
                  alt="Freedom of the Press - Journalist running with camera equipment"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-light font-sans mb-3">
                Freedom of the Press
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track criticism of the regime and presence of opposition leaders in Venezuelan media.
              </p>
            </div>

            {/* Pillar 2: Freedom of Assembly */}
            <div className="group">
              <div className="relative aspect-[4/5] mb-6 rounded-3xl overflow-hidden bg-muted">
                <Image
                  src="/images/pillar-2.jpg"
                  alt="Freedom of Assembly - Protest response"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-light font-sans mb-3">
                Freedom of Assembly
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track protests and government response to opposition gatherings.
              </p>
            </div>

            {/* Pillar 3: Economic Development */}
            <div className="group">
              <div className="relative aspect-[4/5] mb-6 rounded-3xl overflow-hidden bg-muted">
                <Image
                  src="/images/pillar-3.jpg"
                  alt="Economic Development - Oil refinery"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl md:text-2xl font-light font-sans mb-3">
                Economic Development
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Inflation, economic growth, and oil industry development monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Previous Work Section */}
      <section className="px-6 py-24 md:py-32 border-t border-border">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <p className="text-[10px] font-display tracking-[0.3em] uppercase text-muted-foreground mb-6 text-center">
            Previous Work
          </p>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-sans text-center mb-6 text-balance leading-tight">
            Built on real-world impact.
          </h2>
          
          <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed text-center max-w-2xl mx-auto mb-16">
            The Miranda Center's OSINT dashboard was shared with Venezuelan opposition leadership during Operation Southern Spear, informing engagements with US diplomatic and intelligence personnel.
          </p>

          {/* Single Card Link */}
          <Link 
            href="/existing-work"
            className="group block max-w-2xl mx-auto"
          >
            <div className="relative p-8 md:p-12 border border-border rounded-3xl transition-all duration-300 hover:border-foreground/20 hover:bg-foreground/[0.02] overflow-hidden">
              {/* Abstract Dashboard Representation */}
              <div className="flex gap-3 mb-8">
                <div className="h-2 w-16 bg-muted-foreground/20 rounded-full" />
                <div className="h-2 w-24 bg-muted-foreground/10 rounded-full" />
                <div className="h-2 w-12 bg-muted-foreground/15 rounded-full" />
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="aspect-video bg-muted rounded-xl" />
                <div className="aspect-video bg-muted rounded-xl" />
                <div className="aspect-video bg-muted rounded-xl" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg md:text-xl font-light font-sans mb-1">
                    Mofeta OSINT Dashboard
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Intelligence infrastructure for the Venezuelan transition
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all duration-300 group-hover:border-foreground/30 group-hover:bg-foreground/5">
                  <svg 
                    className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5" 
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
      <footer className="px-6 py-8 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[9px] font-display text-muted-foreground/40 tracking-[0.2em] uppercase">
            Mofeta &amp; The Miranda Center
          </p>
        </div>
      </footer>
    </div>
  )
}
