import { execFile } from "child_process"
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "fs"
import path from "path"
import { videoFilename } from "../types"
import type { VideoMeta } from "../types"

const DATA_DIR = path.join(__dirname, "..", "data")
const MODEL = "mlx-community/whisper-large-v3-turbo"

// Resolve mlx_whisper binary — conda/pip may install it outside Node's default PATH
const CONDA_BIN = "/opt/miniconda3/bin"
const MLX_WHISPER_PATHS = ["mlx_whisper", `${CONDA_BIN}/mlx_whisper`]

let resolvedMlxWhisper: string = "mlx_whisper"

function exec(cmd: string, args: string[], timeoutMs = 30 * 60 * 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(
      cmd,
      args,
      { maxBuffer: 10 * 1024 * 1024, timeout: timeoutMs },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`${cmd} failed: ${error.message}\nstderr: ${stderr}`))
        } else {
          resolve(stdout)
        }
      }
    )
  })
}

export async function checkMlxWhisper(): Promise<void> {
  for (const candidate of MLX_WHISPER_PATHS) {
    try {
      await exec(candidate, ["--help"], 10_000)
      resolvedMlxWhisper = candidate
      console.log(`[press-freedom] mlx_whisper found at: ${candidate}`)
      return
    } catch {
      // try next candidate
    }
  }
  throw new Error(
    "mlx_whisper is not installed or not on PATH.\n" +
    "Install it with: pip install mlx-whisper\n" +
    `Searched: ${MLX_WHISPER_PATHS.join(", ")}`
  )
}

/**
 * Transcribe an audio file using mlx-whisper (local, Apple Silicon).
 * Filename format: {YYYYMMDD}_{slug}.txt
 * Returns the path to the saved transcript file.
 */
export async function transcribeAudio(
  audioPath: string,
  video: VideoMeta
): Promise<string> {
  const outputDir = path.join(DATA_DIR, "transcripts", video.sourceId)
  mkdirSync(outputDir, { recursive: true })

  const baseName = videoFilename(video)
  const transcriptPath = path.join(outputDir, `${baseName}.txt`)

  // Skip if already transcribed
  if (existsSync(transcriptPath)) {
    const content = readFileSync(transcriptPath, "utf-8")
    if (content.trim().length > 0) {
      console.log(`[press-freedom] Transcript already exists: ${baseName}`)
      return transcriptPath
    }
  }

  const args = [
    audioPath,
    "--model", MODEL,
    "--language", "es",
    "--output-dir", outputDir,
    "--output-format", "txt",
  ]

  console.log(`[press-freedom] Transcribing: ${baseName} (this may take a while...)`)
  await exec(resolvedMlxWhisper, args)

  // mlx_whisper names output based on the input filename — which already uses our baseName
  const mlxOutputPath = path.join(outputDir, `${path.basename(audioPath, path.extname(audioPath))}.txt`)

  // Rename if mlx_whisper output doesn't match our expected path
  if (mlxOutputPath !== transcriptPath && existsSync(mlxOutputPath)) {
    const content = readFileSync(mlxOutputPath, "utf-8")
    writeFileSync(transcriptPath, content, "utf-8")
  }

  if (!existsSync(transcriptPath)) {
    throw new Error(`Transcript file not found after transcription: ${transcriptPath}`)
  }

  console.log(`[press-freedom] Transcribed: ${transcriptPath}`)
  return transcriptPath
}
