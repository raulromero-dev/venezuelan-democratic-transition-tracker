import { execFile } from "child_process"
import { mkdirSync, existsSync } from "fs"
import path from "path"
import { videoFilename } from "../types"
import type { CrawlOptions, VideoMeta } from "../types"

const DATA_DIR = path.join(__dirname, "..", "data")

function exec(cmd: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { maxBuffer: 50 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`${cmd} failed: ${error.message}\nstderr: ${stderr}`))
      } else {
        resolve(stdout)
      }
    })
  })
}

export async function checkYtDlp(): Promise<void> {
  try {
    const version = await exec("yt-dlp", ["--version"])
    console.log(`[press-freedom] yt-dlp version: ${version.trim()}`)
  } catch {
    throw new Error(
      "yt-dlp is not installed or not on PATH.\n" +
      "Install it with: brew install yt-dlp"
    )
  }
}

/**
 * List videos from a YouTube playlist or channel without downloading.
 * Uses yt-dlp --flat-playlist --dump-json to fetch metadata only.
 */
export async function listVideos(
  sourceId: string,
  sourceType: "playlist" | "channel",
  options: CrawlOptions
): Promise<VideoMeta[]> {
  const url = sourceType === "playlist"
    ? `https://www.youtube.com/playlist?list=${sourceId}`
    : `https://www.youtube.com/channel/${sourceId}/videos`

  const args = ["--dump-json", "--skip-download", "--no-warnings"]

  if (options.fromDate) {
    args.push("--dateafter", options.fromDate)
  }
  if (options.toDate) {
    args.push("--datebefore", options.toDate)
  }
  if (options.lastN) {
    args.push("--playlist-end", String(options.lastN))
  }

  args.push(url)

  console.log(`[press-freedom] Fetching video list from ${sourceType}: ${sourceId}`)
  const output = await exec("yt-dlp", args)

  const videos: VideoMeta[] = []
  for (const line of output.trim().split("\n")) {
    if (!line) continue
    try {
      const entry = JSON.parse(line)
      videos.push({
        videoId: entry.id,
        sourceId,
        title: entry.title || "Unknown",
        uploadDate: entry.upload_date || "",
        duration: entry.duration || 0,
      })
    } catch {
      // Skip malformed JSON lines
    }
  }

  console.log(`[press-freedom] Found ${videos.length} videos`)
  return videos
}

/**
 * Download audio from a YouTube video as MP3 (64kbps mono).
 * Filename format: {YYYYMMDD}_{slug}.mp3
 * Returns the path to the downloaded audio file.
 */
export async function downloadAudio(video: VideoMeta): Promise<string> {
  const outputDir = path.join(DATA_DIR, "audio", video.sourceId)
  mkdirSync(outputDir, { recursive: true })

  const baseName = videoFilename(video)
  const outputTemplate = path.join(outputDir, `${baseName}.%(ext)s`)
  const expectedPath = path.join(outputDir, `${baseName}.mp3`)

  // Skip if already downloaded
  if (existsSync(expectedPath)) {
    console.log(`[press-freedom] Audio already exists: ${baseName}`)
    return expectedPath
  }

  const url = `https://www.youtube.com/watch?v=${video.videoId}`
  const args = [
    "-x",
    "--audio-format", "mp3",
    "--audio-quality", "64K",
    "--postprocessor-args", "ffmpeg:-ac 1",
    "-o", outputTemplate,
    "--no-warnings",
    "--no-playlist",
    url,
  ]

  console.log(`[press-freedom] Downloading audio: ${baseName}`)
  await exec("yt-dlp", args)

  if (!existsSync(expectedPath)) {
    throw new Error(`Audio file not found after download: ${expectedPath}`)
  }

  console.log(`[press-freedom] Downloaded: ${expectedPath}`)
  return expectedPath
}
