"use client"

import { useState } from "react"
import { TopNav } from "@/components/top-nav"
import { Footer } from "@/components/footer"
import { CongressionalMap } from "@/components/congressional-map"
import { TrumpAdminFeed } from "@/components/trump-admin-feed"
import { SenatorFeed } from "@/components/senator-feed"
import { HouseFeed } from "@/components/house-feed"
import { GlobalIntelFeed } from "@/components/global-intel-feed"
import { OsintFeedX } from "@/components/osint-feed-x"

const tabs = [
  { id: "us-officials", label: "US OFFICIALS" },
  { id: "global", label: "GLOBAL INTEL" },
  { id: "osint", label: "OSINT FEEDS" },
] as const

type TabId = (typeof tabs)[number]["id"]

const usOfficialsTabs = [
  { id: "executive", label: "EXECUTIVE" },
  { id: "congressional", label: "CONGRESSIONAL" },
  { id: "senate-feed", label: "SENATE X" },
  { id: "house-feed", label: "HOUSE X" },
] as const

type UsSubTab = (typeof usOfficialsTabs)[number]["id"]

export default function ExistingWorkPage() {
  const [activeTab, setActiveTab] = useState<TabId>("us-officials")
  const [usSubTab, setUsSubTab] = useState<UsSubTab>("executive")

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopNav />

      <main className="flex-1 pt-28 pb-12 px-6 w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] gap-8 md:gap-16">
            <p className="text-sm text-muted-foreground">
              Previous work
            </p>
            <div>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight font-sans mb-2">Existing Work</h1>
              <p className="text-sm text-muted-foreground">OSINT infrastructure shared with Venezuelan opposition leadership</p>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
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

        {/* Content — feed components are dark-mode only, so we force dark context */}
        <div className="max-w-7xl mx-auto min-h-[800px] dark bg-black text-white p-6 rounded-2xl border border-white/[0.06]">
          {activeTab === "us-officials" && (
            <div className="space-y-4">
              {/* Sub-tabs */}
              <div className="flex gap-3 overflow-x-auto">
                {usOfficialsTabs.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setUsSubTab(sub.id)}
                    className={`text-[10px] font-display tracking-[0.15em] uppercase px-4 py-2 rounded-full border transition-all cursor-pointer ${
                      usSubTab === sub.id
                        ? "text-black bg-white border-white"
                        : "text-zinc-400 border-white/10 hover:border-white/30"
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {usSubTab === "executive" && <TrumpAdminFeed />}
              {usSubTab === "congressional" && <CongressionalMap />}
              {usSubTab === "senate-feed" && <SenatorFeed />}
              {usSubTab === "house-feed" && <HouseFeed />}
            </div>
          )}

          {activeTab === "global" && (
            <div className="w-full max-w-7xl mx-auto">
              <GlobalIntelFeed />
            </div>
          )}

          {activeTab === "osint" && <OsintFeedX />}
        </div>
      </main>

      <Footer />
    </div>
  )
}
