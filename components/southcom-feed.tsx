"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RefreshCw, ExternalLink, Heart, MessageCircle, Repeat2, Twitter, Instagram } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SocialPost {
  id: string
  platform: "twitter" | "instagram"
  content: string
  timestamp: string
  timeAgo: string
  likes: number
  retweets?: number
  replies?: number
  url: string
  media?: string
}

const twitterPosts: SocialPost[] = [
  {
    id: "1",
    platform: "twitter",
    content: "US Southern Command remains committed to supporting democracy and security throughout Latin America. Our partnerships with regional allies are stronger than ever.",
    timestamp: "2024-01-15T14:30:00Z",
    timeAgo: "2h ago",
    likes: 1243,
    retweets: 345,
    replies: 89,
    url: "https://twitter.com/Southcom/status/1",
  },
  {
    id: "2",
    platform: "twitter",
    content: "Monitoring regional developments closely. We stand ready to support humanitarian efforts and democratic institutions across the hemisphere.",
    timestamp: "2024-01-15T10:15:00Z",
    timeAgo: "6h ago",
    likes: 892,
    retweets: 234,
    replies: 56,
    url: "https://twitter.com/Southcom/status/2",
  },
  {
    id: "3",
    platform: "twitter",
    content: "Training exercise completed with partner nations. Strengthening cooperation for regional security and stability. #PartnershipForProsperity",
    timestamp: "2024-01-14T16:45:00Z",
    timeAgo: "1d ago",
    likes: 2145,
    retweets: 567,
    replies: 123,
    url: "https://twitter.com/Southcom/status/3",
    media: "/military-training-exercise.jpg"
  },
  {
    id: "4",
    platform: "twitter",
    content: "General Richardson meets with regional defense leaders to discuss security cooperation and shared challenges in the Western Hemisphere.",
    timestamp: "2024-01-14T09:20:00Z",
    timeAgo: "1d ago",
    likes: 1567,
    retweets: 423,
    replies: 78,
    url: "https://twitter.com/Southcom/status/4",
  }
]

const instagramPosts: SocialPost[] = [
  {
    id: "ig1",
    platform: "instagram",
    content: "Standing with our partners across Latin America and the Caribbean. Together, we build a safer, more prosperous hemisphere.",
    timestamp: "2024-01-15T12:00:00Z",
    timeAgo: "4h ago",
    likes: 3421,
    url: "https://instagram.com/p/southcom1",
    media: "/us-military-personnel-with-regional-partners.jpg"
  },
  {
    id: "ig2",
    platform: "instagram",
    content: "Humanitarian assistance delivery to communities in need. Our mission: security, stability, and prosperity for all. 🇺🇸",
    timestamp: "2024-01-14T15:30:00Z",
    timeAgo: "1d ago",
    likes: 5234,
    url: "https://instagram.com/p/southcom2",
    media: "/humanitarian-aid-delivery.jpg"
  }
]

export function SouthcomFeed() {
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setLastUpdate(new Date())
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="US Southern Command" />
              <AvatarFallback className="bg-primary text-primary-foreground">SC</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-serif">US Southern Command</CardTitle>
              <CardDescription>@Southcom - Latest posts</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {lastUpdate.toLocaleTimeString()}
            </Badge>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="twitter" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="twitter" className="gap-2">
              <Twitter className="h-4 w-4" />
              Twitter
            </TabsTrigger>
            <TabsTrigger value="instagram" className="gap-2">
              <Instagram className="h-4 w-4" />
              Instagram
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="twitter" className="space-y-4 mt-4">
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {twitterPosts.map((post) => (
                <TwitterPost key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="instagram" className="space-y-4 mt-4">
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {instagramPosts.map((post) => (
                <InstagramPost key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Following @Southcom for real-time updates
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href="https://twitter.com/Southcom" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4 mr-2" />
                Follow on X
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="https://instagram.com/Southcom" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-4 w-4 mr-2" />
                Follow on IG
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TwitterPost({ post }: { post: SocialPost }) {
  return (
    <div className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Southcom" />
          <AvatarFallback className="bg-primary text-primary-foreground">SC</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">US Southern Command</span>
            <Badge variant="outline" className="text-xs">@Southcom</Badge>
            <span className="text-xs text-muted-foreground">• {post.timeAgo}</span>
          </div>
          
          <p className="text-sm text-foreground mb-3 leading-relaxed">
            {post.content}
          </p>
          
          {post.media && (
            <div className="mb-3 rounded-lg overflow-hidden border border-border">
              <img 
                src={post.media || "/placeholder.svg"} 
                alt="Post media" 
                className="w-full h-auto"
              />
            </div>
          )}
          
          <div className="flex items-center gap-6 text-muted-foreground">
            <button className="flex items-center gap-2 hover:text-primary transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{post.replies}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-primary transition-colors">
              <Repeat2 className="h-4 w-4" />
              <span className="text-xs">{post.retweets}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-primary transition-colors">
              <Heart className="h-4 w-4" />
              <span className="text-xs">{post.likes}</span>
            </button>
            <Button variant="ghost" size="sm" className="ml-auto h-8" asChild>
              <a href={post.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function InstagramPost({ post }: { post: SocialPost }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow">
      {post.media && (
        <div className="aspect-square bg-muted">
          <img 
            src={post.media || "/placeholder.svg"} 
            alt="Instagram post" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Southcom" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">SC</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">southcom</span>
              <span className="text-xs text-muted-foreground">• {post.timeAgo}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <a href={post.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
        
        <p className="text-sm text-foreground mb-3 leading-relaxed">
          {post.content}
        </p>
        
        <div className="flex items-center gap-4 text-muted-foreground">
          <button className="flex items-center gap-2 hover:text-primary transition-colors">
            <Heart className="h-5 w-5" />
            <span className="text-sm font-medium">{post.likes.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
