"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, ExternalLink, MapPin, ThumbsUp, ThumbsDown, Minus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Position = "supportive" | "critical" | "neutral" | "unknown"

interface CongressMember {
  name: string
  party: "R" | "D" | "I"
  state: string
  chamber: "Senate" | "House"
  position: Position
  lastStatement?: string
  statementDate?: string
  twitter?: string
  avatar: string
}

const senators: CongressMember[] = [
  {
    name: "Marco Rubio",
    party: "R",
    state: "Florida",
    chamber: "Senate",
    position: "supportive",
    lastStatement: "Strongly supporting democratic transition in Venezuela. Sanctions must remain.",
    statementDate: "2024-01-15",
    twitter: "@marcorubio",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    name: "Bob Menendez",
    party: "D",
    state: "New Jersey",
    chamber: "Senate",
    position: "supportive",
    lastStatement: "The Venezuelan people deserve free and fair elections.",
    statementDate: "2024-01-12",
    twitter: "@SenatorMenendez",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    name: "Rick Scott",
    party: "R",
    state: "Florida",
    chamber: "Senate",
    position: "supportive",
    lastStatement: "We must hold Maduro accountable for human rights violations.",
    statementDate: "2024-01-10",
    twitter: "@SenRickScott",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    name: "Bernie Sanders",
    party: "I",
    state: "Vermont",
    chamber: "Senate",
    position: "critical",
    lastStatement: "We should not support regime change operations in Latin America.",
    statementDate: "2023-12-20",
    twitter: "@SenSanders",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    name: "Ted Cruz",
    party: "R",
    state: "Texas",
    chamber: "Senate",
    position: "supportive",
    lastStatement: "Maximum pressure on the Maduro regime must continue.",
    statementDate: "2024-01-08",
    twitter: "@SenTedCruz",
    avatar: "/placeholder.svg?height=40&width=40"
  }
]

const representatives: CongressMember[] = [
  {
    name: "Maria Elvira Salazar",
    party: "R",
    state: "Florida",
    chamber: "House",
    position: "supportive",
    lastStatement: "Leading efforts to support Venezuelan democracy in the House.",
    statementDate: "2024-01-14",
    twitter: "@MaElviraSalazar",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    name: "Debbie Wasserman Schultz",
    party: "D",
    state: "Florida",
    chamber: "House",
    position: "supportive",
    lastStatement: "Supporting humanitarian aid and democratic opposition.",
    statementDate: "2024-01-11",
    twitter: "@DWStweets",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    name: "Alexandria Ocasio-Cortez",
    party: "D",
    state: "New York",
    chamber: "House",
    position: "critical",
    lastStatement: "Sanctions hurt ordinary Venezuelans. We need diplomatic solutions.",
    statementDate: "2023-12-18",
    twitter: "@AOC",
    avatar: "/placeholder.svg?height=40&width=40"
  }
]

const stateData = [
  { state: "Florida", supportive: 4, critical: 0, neutral: 1 },
  { state: "Texas", supportive: 3, critical: 1, neutral: 0 },
  { state: "California", supportive: 2, critical: 2, neutral: 1 },
  { state: "New York", supportive: 1, critical: 2, neutral: 1 },
  { state: "New Jersey", supportive: 2, critical: 0, neutral: 1 }
]

export function CongressionalTracker() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedState, setSelectedState] = useState<string | null>(null)

  const allMembers = [...senators, ...representatives]
  
  const filteredMembers = allMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.state.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesState = !selectedState || member.state === selectedState
    return matchesSearch && matchesState
  })

  const positionCounts = {
    supportive: allMembers.filter(m => m.position === "supportive").length,
    critical: allMembers.filter(m => m.position === "critical").length,
    neutral: allMembers.filter(m => m.position === "neutral").length,
    unknown: allMembers.filter(m => m.position === "unknown").length
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">Congressional Tracker</CardTitle>
        <CardDescription>
          Position mapping of US Congress members on Venezuela
        </CardDescription>
        
        <div className="flex flex-wrap gap-2 pt-4">
          <Badge variant="default" className="bg-primary text-primary-foreground">
            <ThumbsUp className="h-3 w-3 mr-1" />
            Supportive: {positionCounts.supportive}
          </Badge>
          <Badge variant="destructive">
            <ThumbsDown className="h-3 w-3 mr-1" />
            Critical: {positionCounts.critical}
          </Badge>
          <Badge variant="secondary">
            <Minus className="h-3 w-3 mr-1" />
            Neutral: {positionCounts.neutral}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="states">By State</TabsTrigger>
          </TabsList>
          
          <TabsContent value="members" className="space-y-4 mt-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {filteredMembers.map((member) => (
                <MemberCard key={`${member.name}-${member.chamber}`} member={member} />
              ))}
              {filteredMembers.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">
                  No members found matching your search.
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="states" className="space-y-3 mt-4">
            <div className="space-y-2">
              {stateData.map((state) => (
                <div
                  key={state.state}
                  className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedState(state.state)
                    // Switch to members tab to show filtered results
                    const membersTab = document.querySelector('[value="members"]') as HTMLElement
                    membersTab?.click()
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{state.state}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {state.supportive + state.critical + state.neutral} members
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="default" className="text-xs bg-primary">
                      {state.supportive} Supportive
                    </Badge>
                    <Badge variant="destructive" className="text-xs">
                      {state.critical} Critical
                    </Badge>
                    {state.neutral > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {state.neutral} Neutral
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function MemberCard({ member }: { member: CongressMember }) {
  const positionConfig = {
    supportive: {
      icon: ThumbsUp,
      color: "bg-primary text-primary-foreground",
      label: "Supportive"
    },
    critical: {
      icon: ThumbsDown,
      color: "bg-destructive text-destructive-foreground",
      label: "Critical"
    },
    neutral: {
      icon: Minus,
      color: "bg-secondary text-secondary-foreground",
      label: "Neutral"
    },
    unknown: {
      icon: Minus,
      color: "bg-muted text-muted-foreground",
      label: "Unknown"
    }
  }

  const config = positionConfig[member.position]
  const Icon = config.icon

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{member.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {member.party}
                  </Badge>
                </div>
                <Badge className={`${config.color} text-xs`}>
                  <Icon className="h-3 w-3 mr-1" />
                  {config.label}
                </Badge>
              </div>
              
              <div className="text-xs text-muted-foreground mb-1">
                {member.chamber} • {member.state}
              </div>
              
              {member.lastStatement && (
                <p className="text-xs text-muted-foreground line-clamp-1 mt-2">
                  "{member.lastStatement}"
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif">{member.name}</DialogTitle>
          <DialogDescription>
            {member.chamber} • {member.state} • {member.party}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Position on Venezuela:</h4>
            <Badge className={config.color}>
              <Icon className="h-4 w-4 mr-2" />
              {config.label}
            </Badge>
          </div>
          
          {member.lastStatement && (
            <div>
              <h4 className="text-sm font-medium mb-2">Latest Statement:</h4>
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm text-foreground mb-2">"{member.lastStatement}"</p>
                {member.statementDate && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(member.statementDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                )}
              </div>
            </div>
          )}
          
          {member.twitter && (
            <div>
              <h4 className="text-sm font-medium mb-2">Social Media:</h4>
              <Button variant="outline" size="sm" asChild>
                <a href={`https://twitter.com/${member.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {member.twitter}
                </a>
              </Button>
            </div>
          )}
          
          <div>
            <h4 className="text-sm font-medium mb-2">Analysis:</h4>
            <p className="text-sm text-muted-foreground">
              {member.position === "supportive" && 
                "This member has consistently supported democratic opposition in Venezuela and favors maintaining pressure on the Maduro regime through sanctions and diplomatic means."}
              {member.position === "critical" && 
                "This member has expressed concerns about US intervention policy and the impact of sanctions on Venezuelan civilians, favoring diplomatic solutions over pressure tactics."}
              {member.position === "neutral" && 
                "This member has taken a balanced approach, supporting humanitarian aid while expressing caution about intervention."}
              {member.position === "unknown" && 
                "This member has not made significant public statements on Venezuela policy."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
