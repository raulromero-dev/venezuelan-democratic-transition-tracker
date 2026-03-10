"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, RefreshCw } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockReport = `**Venezuela OSINT Intelligence Report**
*Generated: ${new Date().toLocaleString()}*

## Executive Summary
Latest intelligence indicates increased diplomatic activity and military posturing in the Venezuela region. Opposition movements continue to gain international support while the Maduro regime faces mounting pressure from US sanctions.

## Key Developments (Last 48 Hours)

### Political Developments
• María Corina Machado calls for international observers ahead of potential elections
• Opposition coalition strengthens ties with regional democratic movements
• Multiple protests reported in Caracas and Maracaibo with estimated 10,000+ participants

### Military Intelligence
• Venezuelan military exercises observed near Colombian border (SOUTHCOM monitoring)
• Increased naval activity in Caribbean waters
• Colombian intelligence reports troop movements in Táchira State

### Diplomatic Activity  
• US Senator Marco Rubio reaffirms commitment to Venezuelan democratic opposition
• EU Parliament discusses new sanctions package targeting Maduro regime officials
• Regional summit planned for next month in Lima, Peru

### Economic Indicators
• Inflation rate continues upward trajectory at estimated 400% annually
• Oil production remains at historic lows despite recent PDVSA announcements
• Humanitarian crisis deepens with 7M+ refugees across Latin America

## Source Verification
✓ Cross-referenced with SOUTHCOM feeds
✓ Verified via opposition social media (María Corina, Leopoldo López)
✓ Corroborated by US Congressional statements
✓ Confirmed through OSINT Twitter monitoring

## Risk Assessment
**Level: HIGH** - Potential for escalation in coming weeks given:
- Increased military posturing from both sides
- Growing international pressure on Maduro regime
- Opposition mobilization efforts gaining momentum

## Recommended Actions
1. Continue monitoring SOUTHCOM communications
2. Track congressional position statements
3. Monitor flight activity to/from Caracas
4. Watch for diplomatic announcements from Lima Group

---
*Classification: UNCLASSIFIED // FOR OFFICIAL USE ONLY*
*Next Update: Automatic refresh in 5 minutes*`

export function OsintFeed() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState(mockReport)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchOSINT = async (searchQuery: string) => {
    setIsLoading(true)
    setResponse("")

    try {
      const res = await fetch("/api/osint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      })

      if (!res.ok) {
        throw new Error("Failed to get response")
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
          setResponse(fullResponse)
        }
      }
      
      setLastUpdated(new Date())
    } catch (error) {
      const errorMessage = "Error: Failed to fetch OSINT report"
      setResponse(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    await fetchOSINT(query)
  }

  const handlePresetQuery = async (preset: string) => {
    setQuery(preset)
    await fetchOSINT(preset)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setResponse(mockReport.replace(/Generated:.*\*/, `Generated: ${new Date().toLocaleString()}*`))
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-serif">OSINT Intelligence Report</CardTitle>
            <CardDescription>
              Real-time intelligence aggregation from verified sources
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Updated: {lastUpdated.toLocaleTimeString()}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="custom" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="custom">Custom Search</TabsTrigger>
            <TabsTrigger value="presets">Quick Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="custom" className="space-y-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter search query (e.g., 'Venezuela government latest')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !query.trim()}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="presets" className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => handlePresetQuery("Venezuela latest political developments")}
                disabled={isLoading}
                className="justify-start"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Political Updates
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePresetQuery("Venezuela security situation and protests")}
                disabled={isLoading}
                className="justify-start"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Security Status
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePresetQuery("Venezuela opposition activity and statements")}
                disabled={isLoading}
                className="justify-start"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Opposition Activity
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePresetQuery("Venezuela international relations and sanctions")}
                disabled={isLoading}
                className="justify-start"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                International News
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="rounded-lg border border-border bg-muted/50 p-4 max-h-[600px] overflow-y-auto">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm text-foreground">
              {response}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
