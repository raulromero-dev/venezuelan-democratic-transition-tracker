"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

const mainNav = [
  { name: "Existing Work", href: "/existing-work" },
  { name: "Demo", href: "/demo" },
]

export function TopNav() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b
      dark:bg-white/5 dark:border-white/10
      bg-white/70 border-black/[0.06]"
    >
      {/* Tricolor line at very top */}
      <div className="absolute inset-x-0 top-0 h-[2px] tricolor-line opacity-60" />

      <div className="w-full px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-sm font-light tracking-tight font-display group-hover:text-muted-foreground transition-colors">
            Miranda Center
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {mainNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-xs font-medium tracking-wide transition-all",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/70",
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 dark:bg-white/10 bg-black/[0.04] backdrop-blur-sm border dark:border-white/20 border-black/10 skew-x-[-6deg]" />
                )}
                <span className="relative z-10">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  )
}
