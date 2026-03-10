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
      {/* Tricolor accent line */}
      <div className="fixed top-0 left-0 right-0 h-[2px] tricolor-line z-[60] opacity-60" />

      <TopNav />

      {/* Grain overlay — dark only */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-40 dark:block hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <main className="flex-1 pt-24 pb-8 px-6 w-full space-y-6 relative z-10">
        {/* Header */}
        <div className="relative overflow-hidden backdrop-blur-xl border
          dark:bg-zinc-950/70 dark:border-white/10
          bg-white/80 border-black/[0.06]
          p-6"
        >
          {/* Top reflection */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent dark:via-white/20 via-black/[0.06] to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br dark:from-white/5 from-black/[0.01] via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10">
            <p className="text-[10px] font-display text-muted-foreground tracking-[0.3em] uppercase mb-2">EXISTING INFRASTRUCTURE</p>
            <h1 className="text-3xl font-light tracking-tight font-display">Existing Work</h1>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="flex gap-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative cursor-pointer group whitespace-nowrap"
            >
              <span
                className={`text-[11px] font-display tracking-[0.15em] transition-colors ${
                  activeTab === tab.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/70"
                }`}
              >
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 tricolor-line opacity-60 skew-x-[-12deg]" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-[800px]">
          {activeTab === "us-officials" && (
            <div className="space-y-4">
              {/* Sub-tabs */}
              <div className="flex gap-4 overflow-x-auto">
                {usOfficialsTabs.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setUsSubTab(sub.id)}
                    className={`text-[10px] font-display tracking-[0.15em] uppercase px-3 py-1.5 border transition-all cursor-pointer ${
                      usSubTab === sub.id
                        ? "text-foreground dark:bg-white/10 bg-black/[0.04] dark:border-white/20 border-black/10"
                        : "text-muted-foreground dark:border-white/[0.06] border-black/[0.06] hover:text-foreground/70"
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
