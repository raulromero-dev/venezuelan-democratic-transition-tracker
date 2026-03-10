export function Footer() {
  return (
    <footer className="relative border-t dark:border-zinc-800 border-zinc-200 bg-background py-6 px-6">
      {/* Top tricolor line */}
      <div className="absolute inset-x-0 top-0 h-px tricolor-line opacity-20" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 dark:bg-white/30 bg-black/20" />
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">Powered by Mofeta</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-[10px] font-display text-muted-foreground/40">&copy; {new Date().getFullYear()} Miranda Center</span>
        </div>
      </div>
    </footer>
  )
}
