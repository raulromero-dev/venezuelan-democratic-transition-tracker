"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Newspaper } from 'lucide-react'

interface Article {
  title: string
  source: string
  url: string
  timeAgo: string
  category: "politics" | "security" | "economy" | "international"
}

const articles: Article[] = [
  {
    title: "Opposition Leaders Call for International Observers",
    source: "Reuters",
    url: "https://reuters.com",
    timeAgo: "3h ago",
    category: "politics"
  },
  {
    title: "US Sanctions Update on Venezuelan Officials",
    source: "Bloomberg",
    url: "https://bloomberg.com",
    timeAgo: "6h ago",
    category: "international"
  },
  {
    title: "Caracas Security Situation Analysis",
    source: "AP News",
    url: "https://apnews.com",
    timeAgo: "9h ago",
    category: "security"
  },
  {
    title: "Economic Indicators Show Continued Decline",
    source: "Financial Times",
    url: "https://ft.com",
    timeAgo: "12h ago",
    category: "economy"
  },
  {
    title: "Regional Leaders Meet to Discuss Venezuela",
    source: "BBC",
    url: "https://bbc.com",
    timeAgo: "18h ago",
    category: "international"
  }
]

const categoryColors = {
  politics: "bg-primary/10 text-primary",
  security: "bg-destructive/10 text-destructive",
  economy: "bg-accent/10 text-accent",
  international: "bg-secondary/10 text-secondary"
}

export function RecentArticles() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-lg">Recent Articles</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {articles.map((article, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start gap-2 mb-2">
              <Newspaper className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium leading-tight line-clamp-2 mb-1">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">{article.source}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{article.timeAgo}</span>
                  <Badge variant="outline" className={`text-xs ${categoryColors[article.category]}`}>
                    {article.category}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                asChild
              >
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
