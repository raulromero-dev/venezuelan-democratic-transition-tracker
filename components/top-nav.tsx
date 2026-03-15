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
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-5">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-full px-5 py-2.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-5 h-[2px] tricolor-line rounded-full" />
            <span className="text-[10px] font-display tracking-[0.25em] uppercase text-foreground/80">
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
                    "px-4 py-1.5 text-[10px] font-display tracking-[0.15em] uppercase rounded-full transition-colors",
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
