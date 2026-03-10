export function Footer() {
  return (
    <footer className="relative border-t border-zinc-800 bg-black py-6 px-6">
      {/* Top reflection line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-white/30" />
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">Powered by Mofeta</span>
        </div>

        {/* Copyright */}
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-mono text-zinc-700">&copy; {new Date().getFullYear()} Miranda Center</span>
        </div>
      </div>
    </footer>
  )
}
