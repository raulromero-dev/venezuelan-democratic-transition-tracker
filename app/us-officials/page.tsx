"use client"

import { useState } from "react"
import { TrumpAdminFeed } from "@/components/trump-admin-feed"
import { CongressionalMap } from "@/components/congressional-map"
import { SenatorFeed } from "@/components/senator-feed"
import { HouseFeed } from "@/components/house-feed"
import { TopNav } from "@/components/top-nav"
import { Footer } from "@/components/footer"

export default function UsOfficialsPage() {
  const [activeView, setActiveView] = useState<"executive" | "congressional" | "senator-feed" | "house-feed">(
    "executive",
  )

  const tabs = [
    { id: "executive", label: "EXECUTIVE BRANCH" },
    { id: "congressional", label: "CONGRESSIONAL POSITIONS" },
    { id: "senator-feed", label: "SENATE X FEED" },
    { id: "house-feed", label: "HOUSE X FEED" },
  ] as const

  return (
    <div className="min-h-screen bg-black text-white">
      <TopNav />

      {/* Grain overlay */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <main className="pt-24 pb-8 px-6 w-full space-y-6 bg-black relative z-10">
        <div className="relative bg-zinc-950/70 backdrop-blur-xl border border-white/10 p-6 overflow-hidden">
          {/* Top reflection */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          {/* Corner gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />

          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-12 h-12">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-white/30 to-transparent" />
            <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-white/30 to-transparent" />
          </div>
          <div className="absolute bottom-0 right-0 w-12 h-12">
            <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-white/30 to-transparent" />
            <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-t from-white/30 to-transparent" />
          </div>

          <div className="relative z-10">
            <p className="text-[10px] font-mono text-zinc-500 tracking-[0.3em] uppercase mb-2">GOVERNMENT ANALYSIS</p>
            <h1 className="text-3xl font-light tracking-tight text-white">US Officials</h1>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className="relative cursor-pointer group whitespace-nowrap"
            >
              <span
                className={`text-[11px] font-mono tracking-[0.15em] transition-colors ${
                  activeView === tab.id ? "text-white" : "text-zinc-600 group-hover:text-zinc-400"
                }`}
              >
                {tab.label}
              </span>
              {activeView === tab.id && (
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-white skew-x-[-12deg] shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              )}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="min-h-[800px]">
          {activeView === "executive" ? (
            <TrumpAdminFeed />
          ) : activeView === "congressional" ? (
            <CongressionalMap />
          ) : activeView === "senator-feed" ? (
            <SenatorFeed />
          ) : (
            <HouseFeed />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
