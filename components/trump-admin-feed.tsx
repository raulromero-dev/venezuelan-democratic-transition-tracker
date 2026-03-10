"use client"

export function TrumpAdminFeed() {
  return (
    <div className="relative backdrop-blur-xl border p-6 overflow-hidden
      dark:bg-zinc-950/70 dark:border-white/10
      bg-white/80 border-black/[0.06]"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent dark:via-white/20 via-black/[0.06] to-transparent" />
      <div className="relative z-10 text-center py-12">
        <p className="text-[10px] font-display text-muted-foreground tracking-[0.3em] uppercase mb-4">EXECUTIVE BRANCH</p>
        <p className="text-muted-foreground text-sm">Executive branch feed coming soon.</p>
      </div>
    </div>
  )
}
