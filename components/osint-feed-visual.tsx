"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, AlertCircle, TrendingUp, Users, Radio } from 'lucide-react'
import { VenezuelaMap } from "./venezuela-map"

interface OsintReport {
  id: string
  category: 'political' | 'security' | 'opposition' | 'international'
  title: string
  content: string
  time: string
  source: string
  priority: 'high' | 'medium' | 'low'
}

export function OsintFeedVisual() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [reports, setReports] = useState<OsintReport[]>([])
  const [streamingReport, setStreamingReport] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchOSINT = async (searchQuery: string, category: string) => {
    setIsLoading(true)
    setStreamingReport("")

    try {
      const res = await fetch("/api/osint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: `${searchQuery} - Format as a concise intelligence brief with key points` }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || "Failed to get response")
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          fullResponse += chunk
          setStreamingReport(fullResponse)
        }
      }
      
      // Add to reports
      const newReport: OsintReport = {
        id: Date.now().toString(),
        category: category as any,
        title: searchQuery,
        content: fullResponse,
        time: new Date().toLocaleTimeString(),
        source: 'Grok AI',
        priority: 'medium'
      }
      
      setReports(prev => [newReport, ...prev])
      setLastUpdated(new Date())
    } catch (error) {
      console.error("[v0] OSINT fetch error:", error)
      const errorMessage = `Error: ${error instanceof Error ? error.message : 'Failed to fetch OSINT report'}`
      setStreamingReport(errorMessage)
    } finally {
      setIsLoading(false)
      setTimeout(() => setStreamingReport(""), 2000)
    }
  }

  const handlePresetQuery = async (preset: string, category: string) => {
    setQuery(preset)
    await fetchOSINT(preset, category)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'political': return <TrendingUp className="h-4 w-4" />
      case 'security': return <AlertCircle className="h-4 w-4" />
      case 'opposition': return <Users className="h-4 w-4" />
      case 'international': return <Radio className="h-4 w-4" />
      default: return <Search className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'political': return 'bg-chart-1/10 text-chart-1 border-chart-1/20'
      case 'security': return 'bg-chart-4/10 text-chart-4 border-chart-4/20'
      case 'opposition': return 'bg-chart-2/10 text-chart-2 border-chart-2/20'
      case 'international': return 'bg-chart-3/10 text-chart-3 border-chart-3/20'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">OSINT Intelligence Feed</CardTitle>
            <CardDescription className="mt-2">
              Real-time monitoring powered by Grok AI
            </CardDescription>
          </div>
          {lastUpdated && (
            <Badge variant="outline" className="text-xs">
              Last update: {lastUpdated.toLocaleTimeString()}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            onClick={() => handlePresetQuery("Venezuela latest political developments and government statements", "political")}
            disabled={isLoading}
            className="h-auto flex-col items-start p-4 gap-2"
          >
            <TrendingUp className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold text-sm">Political</div>
              <div className="text-xs text-muted-foreground">Updates</div>
            </div>
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePresetQuery("Venezuela security situation, protests, and law enforcement activity", "security")}
            disabled={isLoading}
            className="h-auto flex-col items-start p-4 gap-2"
          >
            <AlertCircle className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold text-sm">Security</div>
              <div className="text-xs text-muted-foreground">Status</div>
            </div>
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePresetQuery("Venezuela opposition activity, statements, and organization", "opposition")}
            disabled={isLoading}
            className="h-auto flex-col items-start p-4 gap-2"
          >
            <Users className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold text-sm">Opposition</div>
              <div className="text-xs text-muted-foreground">Activity</div>
            </div>
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePresetQuery("Venezuela international relations, sanctions, and diplomatic developments", "international")}
            disabled={isLoading}
            className="h-auto flex-col items-start p-4 gap-2"
          >
            <Radio className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold text-sm">International</div>
              <div className="text-xs text-muted-foreground">Relations</div>
            </div>
          </Button>
        </div>

        {/* Map visualization */}
        <div>
          <h3 className="font-semibold mb-3 text-sm">Activity Map</h3>
          <VenezuelaMap />
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg border border-border">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div>
              <div className="font-medium text-sm">Analyzing intelligence sources...</div>
              <div className="text-xs text-muted-foreground mt-1">Querying X/Twitter via Grok AI</div>
            </div>
          </div>
        )}

        {/* Streaming report */}
        {streamingReport && (
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="font-medium text-sm">Live Report</span>
            </div>
            <div className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
              {streamingReport}
            </div>
          </div>
        )}

        {/* Reports feed */}
        {reports.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Recent Reports</h3>
            {reports.map((report) => (
              <div key={report.id} className="rounded-lg border border-border bg-card p-4 hover:bg-accent/5 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded ${getCategoryColor(report.category)} border`}>
                    {getCategoryIcon(report.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-sm">{report.title}</h4>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {report.time}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
                      {report.content}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline" className="text-xs">
                        {report.source}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {report.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !streamingReport && reports.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-sm">
              Select a category above to start monitoring
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
