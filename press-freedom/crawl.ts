import "dotenv/config"
import { YOUTUBE_SOURCES } from "./channels"
import type { CrawlOptions, VideoMeta } from "./types"
import { checkYtDlp, listVideos, downloadAudio } from "./lib/youtube-downloader"
import { checkMlxWhisper, transcribeAudio } from "./lib/transcriber"
import { getProcessedVideoIds, upsertVideo, isDbAvailable } from "./lib/db"

function parseArgs(): CrawlOptions {
  const args = process.argv.slice(2)
  const options: CrawlOptions = {}

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--from":
        options.fromDate = args[++i]
        break
      case "--to":
        options.toDate = args[++i]
        break
      case "--last":
        options.lastN = parseInt(args[++i], 10)
        break
      case "--source":
      case "--channel":
        if (!options.sourceIds) options.sourceIds = []
        options.sourceIds.push(args[++i])
        break
      case "--skip-download":
        options.skipDownload = true
        break
      case "--skip-transcribe":
        options.skipTranscribe = true
        break
      case "--help":
        printHelp()
        process.exit(0)
      default:
        console.error(`Unknown argument: ${args[i]}`)
        printHelp()
        process.exit(1)
    }
  }

  return options
}

function printHelp() {
  console.log(`
Usage: npx tsx press-freedom/crawl.ts [options]

Options:
  --last N              Process last N videos per source
  --from YYYYMMDD       Process videos uploaded after this date
  --to YYYYMMDD         Process videos uploaded before this date
  --source ID           Only process this source (can be repeated)
  --channel ID          Alias for --source
  --skip-download       Only transcribe existing audio files
  --skip-transcribe     Only download audio (no transcription)
  --help                Show this help message

Examples:
  npx tsx press-freedom/crawl.ts --last 5
  npx tsx press-freedom/crawl.ts --from 20260101 --to 20260301
  npx tsx press-freedom/crawl.ts --source PLyhdNAFV1DMJATESD8ItT1bgy8QlIXDQA --last 3
`)
}

async function main() {
  const options = parseArgs()
  console.log("[press-freedom] Starting crawl pipeline")
  console.log("[press-freedom] Options:", JSON.stringify(options, null, 2))

  // Check system dependencies
  await checkYtDlp()
  if (!options.skipTranscribe) {
    await checkMlxWhisper()
  }

  if (isDbAvailable()) {
    console.log("[press-freedom] Supabase tracking: enabled")
  } else {
    console.log("[press-freedom] Supabase tracking: disabled (no env vars, using local files only)")
  }

  // Determine which sources to process
  const sources = options.sourceIds
    ? YOUTUBE_SOURCES.filter(s => options.sourceIds!.includes(s.id))
    : YOUTUBE_SOURCES

  if (sources.length === 0) {
    console.error("[press-freedom] No matching sources found")
    process.exit(1)
  }

  let totalDownloaded = 0
  let totalTranscribed = 0
  let totalErrors = 0

  for (const source of sources) {
    console.log(`\n[press-freedom] === Processing: ${source.name} (${source.id}) ===`)

    // Step 1: Get video list
    let videos: VideoMeta[]
    try {
      videos = await listVideos(source.id, source.type, options)
    } catch (err) {
      console.error(`[press-freedom] Failed to list videos for ${source.name}:`, err)
      totalErrors++
      continue
    }

    if (videos.length === 0) {
      console.log("[press-freedom] No videos found for this source")
      continue
    }

    // Step 2: Filter out already-processed videos
    const processed = await getProcessedVideoIds(source.id)
    const toProcess = videos.filter(v => {
      const status = processed.get(v.videoId)
      if (options.skipDownload) return status === "downloaded"
      return !status || status === "pending" || status === "error"
    })

    console.log(`[press-freedom] ${toProcess.length} videos to process (${videos.length - toProcess.length} already done)`)

    // Step 3: Process each video
    for (const video of toProcess) {
      console.log(`\n[press-freedom] --- ${video.title} (${video.videoId}) ---`)

      // Download audio
      if (!options.skipDownload) {
        try {
          video.audioPath = await downloadAudio(video)
          await upsertVideo(video, "downloaded")
          totalDownloaded++
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          console.error(`[press-freedom] Download failed: ${msg}`)
          await upsertVideo(video, "error", msg)
          totalErrors++
          continue
        }
      }

      // Transcribe audio
      if (!options.skipTranscribe) {
        const audioPath = video.audioPath
        if (!audioPath) {
          console.error(`[press-freedom] No audio path for ${video.videoId}, skipping transcription`)
          continue
        }
        try {
          video.transcriptPath = await transcribeAudio(audioPath, video)
          await upsertVideo(video, "transcribed")
          totalTranscribed++
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          console.error(`[press-freedom] Transcription failed: ${msg}`)
          await upsertVideo(video, "error", msg)
          totalErrors++
        }
      }
    }
  }

  console.log(`\n[press-freedom] === Summary ===`)
  console.log(`[press-freedom] Downloaded: ${totalDownloaded}`)
  console.log(`[press-freedom] Transcribed: ${totalTranscribed}`)
  console.log(`[press-freedom] Errors: ${totalErrors}`)
}

main().catch(err => {
  console.error("[press-freedom] Fatal error:", err)
  process.exit(1)
})
