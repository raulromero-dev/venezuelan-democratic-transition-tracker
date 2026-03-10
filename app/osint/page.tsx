import { TopNav } from "@/components/top-nav"
import { OsintFeedX } from "@/components/osint-feed-x"

export default function OsintPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <TopNav />
      <main className="pt-24 pb-16 w-full px-6">
        <OsintFeedX />
      </main>
    </div>
  )
}
