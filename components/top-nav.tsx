"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const mainNav = [
  { name: "US Officials", href: "/us-officials" },
  { name: "Global", href: "/global" },
  { name: "OSINT", href: "/osint" },
]

export function TopNav() {
  const pathname = usePathname()

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
          <span className="text-sm font-light tracking-tight text-white group-hover:text-zinc-300 transition-colors">
            Miranda Center
          </span>
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
        </nav>
      </div>
    </header>
  )
}
