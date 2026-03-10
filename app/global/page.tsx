"use client"
import { TopNav } from "@/components/top-nav"
import { GlobalIntelFeed } from "@/components/global-intel-feed"

export default function GlobalPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <TopNav />
      <main className="flex-1 pt-24 pb-16 w-full px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <GlobalIntelFeed />
        </div>
      </main>
    </div>
  )
}
