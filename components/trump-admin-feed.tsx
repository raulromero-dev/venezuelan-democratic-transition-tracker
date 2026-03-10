"use client"

export function TrumpAdminFeed() {
  return (
    <div className="relative bg-zinc-950/70 backdrop-blur-xl border border-white/10 p-6 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 text-center py-12">
        <p className="text-[10px] font-mono text-zinc-500 tracking-[0.3em] uppercase mb-4">EXECUTIVE BRANCH</p>
        <p className="text-zinc-400 text-sm font-mono">Executive branch feed coming soon.</p>
      </div>
    </div>
  )
}
