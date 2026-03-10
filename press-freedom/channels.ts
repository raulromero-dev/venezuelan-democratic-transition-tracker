export interface YouTubeSource {
  id: string
  name: string
  description: string
  category: "state-media" | "independent" | "international"
  type: "playlist" | "channel"
}

// To find a channel ID: go to the channel page, view source, search for "channelId"
// To find a playlist ID: go to the playlist page, copy from the URL after "list="
export const YOUTUBE_SOURCES: YouTubeSource[] = [
  {
    id: "PLyhdNAFV1DMJATESD8ItT1bgy8QlIXDQA",
    name: "Venezuelan TV Playlist",
    description: "Curated playlist of Venezuelan TV broadcasts",
    category: "state-media",
    type: "playlist",
  },
]
