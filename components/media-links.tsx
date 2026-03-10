"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Radio, Play } from 'lucide-react'

interface MediaLink {
  name: string
  url: string
  type: "opposition" | "government" | "international"
  status: "live" | "offline"
  viewers?: number
  description?: string
}

const mediaLinks: MediaLink[] = [
  {
    name: "VPI TV (Live)",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    type: "opposition",
    status: "live",
    viewers: 12400,
    description: "Venezuelan opposition news channel"
  },
  {
    name: "CNN en Español - Venezuela Coverage",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    type: "international",
    status: "live",
    viewers: 45000,
    description: "24/7 Venezuela news coverage"
  },
  {
    name: "NTN24 Venezuela",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    type: "opposition",
    status: "live",
    viewers: 8900,
    description: "Colombian news network covering Venezuela"
  },
  {
    name: "VTV (Venezolana de Televisión)",
    url: "https://vtv.gob.ve",
    type: "government",
    status: "live",
    viewers: 5200,
    description: "State-run television"
  },
  {
    name: "EVTV Miami",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    type: "opposition",
    status: "live",
    viewers: 18500,
    description: "Venezuelan diaspora news channel"
  }
]

export function MediaLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-lg">Live Media Feeds</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">Real-time video streams</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {mediaLinks.map((link) => (
          <div
            key={link.name}
            className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3 flex-1">
                <div className="relative">
                  {link.status === 'live' ? (
                    <Radio className="h-5 w-5 text-destructive animate-pulse" />
                  ) : (
                    <Play className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm mb-1">{link.name}</div>
                  {link.description && (
                    <p className="text-xs text-muted-foreground mb-2">{link.description}</p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={link.type === "opposition" ? "default" : link.type === "government" ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {link.type}
                    </Badge>
                    {link.status === 'live' && link.viewers && (
                      <Badge variant="destructive" className="text-xs">
                        🔴 {link.viewers.toLocaleString()} viewers
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="shrink-0"
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
