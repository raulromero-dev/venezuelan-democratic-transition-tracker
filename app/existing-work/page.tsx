"use client"

import { useState } from "react"
import { TopNav } from "@/components/top-nav"
import { Footer } from "@/components/footer"
import { CongressionalMap } from "@/components/congressional-map"
import { TrumpAdminFeed } from "@/components/trump-admin-feed"
import { SenatorFeed } from "@/components/senator-feed"
import { HouseFeed } from "@/components/house-feed"

const tabs = [
  { id: "executive", label: "EXECUTIVE" },
  { id: "congressional", label: "CONGRESSIONAL" },
  { id: "senate-feed", label: "SENATE X" },
  { id: "house-feed", label: "HOUSE X" },
] as const

type TabId = (typeof tabs)[number]["id"]

export default function ExistingWorkPage() {
  const [activeTab, setActiveTab] = useState<TabId>("executive")

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopNav />

      <main className="flex-1 pt-24 pb-12 px-6 w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-8 md:gap-16">
            <p className="text-sm text-muted-foreground">
              Previous work
            </p>
            <div>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight font-sans mb-2">Existing Work</h1>
              <p className="text-sm text-muted-foreground">OSINT infrastructure shared with Venezuelan opposition leadership to understand US government figures and monitor positions of different members of congress</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-[10px] font-display tracking-[0.15em] uppercase rounded-full border transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-foreground text-background border-foreground"
                    : "text-muted-foreground border-border hover:border-foreground/30"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto min-h-[800px] bg-white/60 dark:bg-zinc-950 p-6 rounded-2xl border border-black/[0.06] dark:border-white/[0.06]">
          {activeTab === "executive" && <TrumpAdminFeed />}
          {activeTab === "congressional" && <CongressionalMap />}
          {activeTab === "senate-feed" && <SenatorFeed />}
          {activeTab === "house-feed" && <HouseFeed />}
        </div>
      </main>

      <Footer />
    </div>
  )
}
