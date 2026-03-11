import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Transparent Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-[2px] tricolor-line" />
            <span className="text-[10px] font-display tracking-[0.3em] uppercase text-muted-foreground">
              MIRANDA CENTER
            </span>
          </div>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Link
              href="/existing-work"
              className="text-[11px] font-display tracking-[0.2em] uppercase text-foreground hover:text-muted-foreground transition-colors flex items-center gap-2"
            >
              Enter
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Macaw Image */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8">
          <Image
            src="/images/macaw.png"
            alt="Macaw - Symbol of Venezuelan freedom"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Hero Text */}
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6 font-display text-balance">
            Venezuelan
            <br />
            <span className="text-muted-foreground">Transition Tracker</span>
          </h1>

          <p className="text-sm md:text-base text-muted-foreground font-light max-w-md mx-auto leading-relaxed mb-10">
            Open intelligence tracking Venezuela's path to democracy.
          </p>

          {/* CTA Button */}
          <Link
            href="/existing-work"
            className="inline-flex items-center gap-3 px-8 py-4 border border-foreground/20 hover:border-foreground/40 hover:bg-foreground/5 transition-all duration-300 group"
          >
            <span className="text-[11px] font-display tracking-[0.25em] uppercase">
              View Intelligence
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Footer attribution */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-[9px] font-display text-muted-foreground/40 tracking-[0.2em] uppercase">
            Mofeta &amp; The Miranda Center
          </p>
        </div>
      </main>
    </div>
  )
}
