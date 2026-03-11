import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
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
            src="/images/macaw_hero.png"
            alt="Macaw - Symbol of Venezuelan freedom"
            fill
            className="object-contain macaw-adaptive"
            priority
          />
        </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
            Transparent and reproducible indices measuring Venezuela's democratic and economic trajectory across three pillars: freedom of the press, freedom to organize, and economic activity.
          </p>
        </div>

        {/* Two Panels */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Demo Panel */}
          <Link 
            href="/demo" 
            className="group p-8 md:p-10 border border-border hover:border-foreground/30 transition-all duration-300 hover:bg-foreground/[0.02] rounded-3xl"
          >
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-xs font-display tracking-[0.2em] uppercase text-muted-foreground">
                Demo
              </h3>
              <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
            </div>
            <h2 className="text-2xl md:text-3xl font-light font-sans mb-4">
              Explore the Tracker
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Interactive demonstration of the three pillars: media criticism index, assembly freedom tracking, and economic indicators.
            </p>
          </Link>

          {/* Existing Work Panel */}
          <Link 
            href="/existing-work" 
            className="group p-8 md:p-10 border border-border hover:border-foreground/30 transition-all duration-300 hover:bg-foreground/[0.02] rounded-3xl"
          >
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-xs font-display tracking-[0.2em] uppercase text-muted-foreground">
                Previous Work
              </h3>
              <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
            </div>
            <h2 className="text-2xl md:text-3xl font-light font-sans mb-4">
              OSINT Dashboard
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The intelligence dashboard shared with Venezuelan opposition leadership during Operation Southern Spear.
            </p>
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
