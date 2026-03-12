import "dotenv/config"
import * as fs from "fs"
import * as path from "path"
import { normalize } from "./lib/analyzer/normalize.js"
import { chunk } from "./lib/analyzer/chunker.js"
import { classifyChunk } from "./lib/analyzer/classifier.js"
import {
  aggregateDailySentiment,
  aggregateDailyMentions,
  aggregateDailyUsRelations,
  clusterTopics,
} from "./lib/analyzer/aggregator.js"
import { FileAnalysis, PipelineMetadata, parseBroadcastDate, parseShowType } from "./lib/analyzer/types.js"

const TRANSCRIPT_DIR = path.join(__dirname, "data/transcripts/PLyhdNAFV1DMJATESD8ItT1bgy8QlIXDQA")
const OUTPUT_DIR = path.join(__dirname, "data/analysis")
const CHUNKS_DIR = path.join(OUTPUT_DIR, "chunks")

interface CliOptions {
  force: boolean
  skipClassify: boolean
  fileFilter?: string
  delayMs: number
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2)
  const options: CliOptions = { force: false, skipClassify: false, delayMs: 1200 }

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--force":
        options.force = true
        break
      case "--skip-classify":
        options.skipClassify = true
        break
      case "--file":
        options.fileFilter = args[++i]
        break
      case "--delay":
        options.delayMs = parseInt(args[++i], 10)
        break
    }
  }
  return options
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const options = parseArgs()
  const startTime = Date.now()

  if (!process.env.ANTHROPIC_API_KEY && !options.skipClassify) {
    console.error("Error: ANTHROPIC_API_KEY environment variable is required")
    process.exit(1)
  }

  // Ensure output directories exist
  fs.mkdirSync(CHUNKS_DIR, { recursive: true })

  // Discover transcript files
  let files = fs.readdirSync(TRANSCRIPT_DIR).filter((f) => f.endsWith(".txt")).sort()
  if (options.fileFilter) {
    const filter = options.fileFilter.toLowerCase()
    files = files.filter((f) => f.toLowerCase().includes(filter))
  }

  console.log(`\n📊 Pillar 1 Analysis Pipeline`)
  console.log(`   Found ${files.length} transcript files`)
  console.log(`   Output: ${OUTPUT_DIR}\n`)

  const allFileAnalyses: FileAnalysis[] = []
  let totalApiCalls = 0

  if (!options.skipClassify) {
    // Phase 1: Classify each file
    for (let fi = 0; fi < files.length; fi++) {
      const filename = files[fi]
      const basename = filename.replace(".txt", "")
      const outputPath = path.join(CHUNKS_DIR, `${basename}.json`)

      // Checkpoint: skip if already processed
      if (!options.force && fs.existsSync(outputPath)) {
        console.log(`[${fi + 1}/${files.length}] Skipping ${filename} (already processed)`)
        const existing = JSON.parse(fs.readFileSync(outputPath, "utf-8")) as FileAnalysis
        allFileAnalyses.push(existing)
        continue
      }

      const date = parseBroadcastDate(filename)
      const showType = parseShowType(filename)

      console.log(`[${fi + 1}/${files.length}] Processing ${filename}`)
      console.log(`           Date: ${date}, Show: ${showType}`)

      // Read, normalize, chunk
      const raw = fs.readFileSync(path.join(TRANSCRIPT_DIR, filename), "utf-8")
      const normalized = normalize(raw)
      const chunks = chunk(normalized)

      console.log(`           ${chunks.length} chunks detected`)

      // Classify each chunk
      const chunkResults = []
      for (let ci = 0; ci < chunks.length; ci++) {
        const chunkId = `${basename}_${ci}`
        process.stdout.write(`           Classifying chunk ${ci + 1}/${chunks.length}...\r`)

        const result = await classifyChunk(chunks[ci], chunkId, ci, date, showType)
        chunkResults.push(result)
        totalApiCalls++

        // Rate limiting delay between API calls
        if (ci < chunks.length - 1) {
          await sleep(options.delayMs)
        }
      }

      const politicalCount = chunkResults.filter((c) => c.isPoliticallyRelevant && !c.error).length
      console.log(`           ${politicalCount}/${chunks.length} chunks politically relevant`)

      const fileAnalysis: FileAnalysis = {
        filename,
        date,
        showType,
        totalChunks: chunks.length,
        politicalChunks: politicalCount,
        chunks: chunkResults,
      }

      // Write checkpoint
      fs.writeFileSync(outputPath, JSON.stringify(fileAnalysis, null, 2))
      allFileAnalyses.push(fileAnalysis)
    }
  } else {
    // Load existing chunk files
    console.log("Skipping classification, loading existing chunk data...")
    for (const filename of files) {
      const basename = filename.replace(".txt", "")
      const outputPath = path.join(CHUNKS_DIR, `${basename}.json`)
      if (fs.existsSync(outputPath)) {
        allFileAnalyses.push(JSON.parse(fs.readFileSync(outputPath, "utf-8")))
      } else {
        console.warn(`  Warning: No chunk data for ${filename}`)
      }
    }
  }

  // Phase 2: Aggregate
  console.log(`\n📈 Aggregating results across ${allFileAnalyses.length} files...`)

  const dailySentiment = aggregateDailySentiment(allFileAnalyses)
  fs.writeFileSync(path.join(OUTPUT_DIR, "daily-sentiment.json"), JSON.stringify(dailySentiment, null, 2))
  console.log(`   daily-sentiment.json: ${dailySentiment.length} days`)

  const dailyMentions = aggregateDailyMentions(allFileAnalyses)
  fs.writeFileSync(path.join(OUTPUT_DIR, "daily-mentions.json"), JSON.stringify(dailyMentions, null, 2))
  console.log(`   daily-mentions.json: ${dailyMentions.length} days`)

  const dailyUsRelations = aggregateDailyUsRelations(allFileAnalyses)
  fs.writeFileSync(path.join(OUTPUT_DIR, "daily-us-relations.json"), JSON.stringify(dailyUsRelations, null, 2))
  console.log(`   daily-us-relations.json: ${dailyUsRelations.length} days`)

  // Topic clustering (requires LLM calls)
  if (!options.skipClassify) {
    console.log("   Clustering topics (3 LLM calls)...")
    const topicClusters = await clusterTopics(allFileAnalyses)
    fs.writeFileSync(path.join(OUTPUT_DIR, "topic-clusters.json"), JSON.stringify(topicClusters, null, 2))
    totalApiCalls += 3
    console.log(`   topic-clusters.json: ${topicClusters.reduce((s, c) => s + c.topics.length, 0)} sub-topics`)
  }

  // Metadata
  const duration = Date.now() - startTime
  const metadata: PipelineMetadata = {
    runAt: new Date().toISOString(),
    totalFiles: allFileAnalyses.length,
    totalChunks: allFileAnalyses.reduce((s, f) => s + f.totalChunks, 0),
    politicalChunks: allFileAnalyses.reduce((s, f) => s + f.politicalChunks, 0),
    apiCalls: totalApiCalls,
    durationMs: duration,
  }
  fs.writeFileSync(path.join(OUTPUT_DIR, "metadata.json"), JSON.stringify(metadata, null, 2))

  // Summary
  console.log(`\n✅ Pipeline complete!`)
  console.log(`   Total files: ${metadata.totalFiles}`)
  console.log(`   Total chunks: ${metadata.totalChunks}`)
  console.log(`   Political chunks: ${metadata.politicalChunks}`)
  console.log(`   API calls: ${metadata.apiCalls}`)
  console.log(`   Duration: ${(duration / 1000).toFixed(1)}s`)
  console.log(`   Estimated cost: ~$${(totalApiCalls * 0.002).toFixed(2)}`)
}

main().catch((err) => {
  console.error("Pipeline failed:", err)
  process.exit(1)
})
