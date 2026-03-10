"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useAuth } from "@/components/auth-check" // Updated import

const mainNav = [
  { name: "Flights & Maritime", href: "/flights" },
  { name: "US Officials", href: "/us-officials" },
  { name: "Global", href: "/global" },
  { name: "Media", href: "/media" },
  { name: "OSINT", href: "/osint" },
]

const moreNav = [
  { name: "Regime X", href: "/regime-x" },
  { name: "Flight Intel", href: "/flight-intel" },
]

export function TopNav() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const isMoreActive = moreNav.some((item) => pathname === item.href)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
      {/* Top reflection gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Corner accents */}
      <div className="absolute top-2 right-4 flex gap-1">
        <div className="w-1 h-1 bg-white/40" />
        <div className="w-1 h-1 bg-white/20" />
      </div>

      <div className="w-full px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/miranda-center-logo.png"
            alt="Miranda Center"
            className="h-10 w-auto transition-opacity group-hover:opacity-80"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {mainNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-xs font-medium tracking-wide transition-all",
                  isActive ? "text-zinc-100" : "text-zinc-400 hover:text-zinc-200",
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 skew-x-[-6deg]" />
                )}
                <span className="relative z-10">{item.name}</span>
              </Link>
            )
          })}

          {/* MORE dropdown */}
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              onMouseEnter={() => setMoreOpen(true)}
              className={cn(
                "relative px-4 py-2 text-xs font-medium tracking-wide transition-all flex items-center gap-1",
                isMoreActive ? "text-zinc-100" : "text-zinc-400 hover:text-zinc-200",
              )}
            >
              {isMoreActive && (
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm border border-white/20 skew-x-[-6deg]" />
              )}
              <span className="relative z-10">More</span>
              <ChevronDown className={cn("relative z-10 w-3 h-3 transition-transform", moreOpen && "rotate-180")} />
            </button>

            {/* Dropdown menu */}
            {moreOpen && (
              <div
                className="absolute top-full left-0 mt-1 bg-zinc-950/95 backdrop-blur-xl border border-white/10 min-w-[160px]"
                onMouseLeave={() => setMoreOpen(false)}
              >
                {/* Top reflection */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {moreNav.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "block px-4 py-2.5 text-xs font-medium tracking-wide transition-all border-l-2",
                        isActive
                          ? "text-zinc-100 bg-white/10 border-l-zinc-200"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border-l-transparent hover:border-l-zinc-500",
                      )}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/10 px-3 tracking-wide"
            onClick={logout}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
