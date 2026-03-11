import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Transparent Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-[2px] tricolor-line" />
            <span className="text-[10px] font-display tracking-[0.3em] uppercase text-muted-foreground">
              MIRANDA CENTER
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/existing-work"
              className="px-5 py-2.5 bg-foreground text-background text-[11px] font-display tracking-[0.15em] uppercase hover:bg-foreground/90 transition-colors"
            >
              Enter
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        {/* Hero Text */}
        <div className="text-center max-w-4xl mb-12">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight mb-8 font-serif text-balance leading-[0.95]">
            Venezuelan
            <br />
            Transition Tracker.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-lg mx-auto leading-relaxed">
            Open intelligence for democracy.
          </p>
        </div>

        {/* Macaw Image - Main Element */}
        <div className="relative w-72 h-48 md:w-96 md:h-64 lg:w-[500px] lg:h-[320px]">
          <Image
            src="/images/macaw_2.png"
            alt="Macaw - Symbol of Venezuelan freedom"
            fill
            className="object-contain"
            priority
          />
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
