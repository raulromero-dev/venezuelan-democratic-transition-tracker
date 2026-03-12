// Patterns that indicate a segment boundary when found at the start of a line
const START_PATTERNS = [
  // Topic transition phrases
  /Bien,?\s+(cambiamos de tema|tenemos más información|vamos a cambiar|ahora vamos)/i,
  /Bueno,?\s+(y\s+)?(con esto|ahora|vamos a|es momento|hacemos una pausa|hacemos nuestra pausa)/i,
  // Section names
  /(Visión Tech|Comunidad en Acción|Visión Deportiva)/i,
  // Segment transitions with geographic indicators
  /Desde el estado\s+/i,
  // "Les contamos" / "Ahora les" pattern (new topic start)
  /(Les contamos|Ahora les|Y ahora,|Seguimos con|Continuamos con|Vamos ahora|Pasamos ahora)/i,
]

// Patterns that can appear anywhere in a line and indicate a boundary AFTER the match
const END_PATTERNS = [
  // Reporter sign-offs (end of a segment)
  /Noticias\s+(?:de\s+)?(?:Bene|Vene)visi[oó]n\.?/i,
  // Explicit break markers
  /con\s+(estas|esta)\s+informaci[oó]n(es)?\s+(finalizamos|terminamos|cerramos|nos despedimos)/i,
]

// Patterns that indicate a boundary when found mid-line (for normalized subtitle text)
const MID_LINE_BOUNDARY_PATTERNS = [
  // Reporter introductions (start of a new segment)
  /(?:nos|le)\s+(ofrece|amplía|tiene|da|trae)\s+(?:más\s+)?(?:detalles|los detalles|la información|el reporte|toda la información)/i,
]

// Noise pattern (Whisper hallucinations during silence/music)
const NOISE_PATTERN = /^(Gracias\.?\s*){3,}$/

function isNoise(text: string): boolean {
  return NOISE_PATTERN.test(text.trim())
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length
}

function splitLongParagraphsAtBoundaries(text: string): string[] {
  // For normalized subtitle text where each "line" may be a huge paragraph,
  // try to find boundary patterns within the text and split there
  const sentences = text.split(/(?<=\.)\s+/)
  const segments: string[] = []
  let current: string[] = []

  for (const sentence of sentences) {
    // Check if this sentence contains a boundary marker
    const hasStartBoundary = START_PATTERNS.some((p) => p.test(sentence))
    const hasEndBoundary = END_PATTERNS.some((p) => p.test(sentence))
    const hasMidBoundary = MID_LINE_BOUNDARY_PATTERNS.some((p) => p.test(sentence))

    if (hasStartBoundary || hasMidBoundary) {
      // Start boundary: flush current, start new segment
      if (current.length > 0) {
        segments.push(current.join(" "))
      }
      current = [sentence]
    } else if (hasEndBoundary) {
      // End boundary: include this sentence, then flush
      current.push(sentence)
      segments.push(current.join(" "))
      current = []
    } else {
      current.push(sentence)
    }
  }
  if (current.length > 0) {
    segments.push(current.join(" "))
  }

  return segments
}

export function chunk(normalizedText: string): string[] {
  const lines = normalizedText.split("\n")

  // First pass: split at line-level boundaries
  const segments: string[] = []
  let currentLines: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Skip noise lines
    if (isNoise(line)) continue
    if (line.length === 0) continue

    let isStartBoundary = START_PATTERNS.some((p) => p.test(line))
    let isEndBoundary = END_PATTERNS.some((p) => p.test(line))

    if (isStartBoundary) {
      if (currentLines.length > 0) {
        segments.push(currentLines.join("\n"))
      }
      currentLines = [line]
    } else if (isEndBoundary) {
      currentLines.push(line)
      segments.push(currentLines.join("\n"))
      currentLines = []
    } else {
      currentLines.push(line)
    }
  }
  if (currentLines.length > 0) {
    segments.push(currentLines.join("\n"))
  }

  // Second pass: for very long segments (from normalized subtitle text),
  // try sentence-level boundary detection
  const MAX_WORDS = 800
  const MIN_WORDS = 50
  let refined: string[] = []

  for (const seg of segments) {
    if (wordCount(seg) > MAX_WORDS) {
      const subSegments = splitLongParagraphsAtBoundaries(seg)
      // If splitting didn't help much, do size-based splitting
      for (const sub of subSegments) {
        if (wordCount(sub) > MAX_WORDS) {
          // Split by sentence groups of ~500 words
          const sentences = sub.split(/(?<=\.)\s+/)
          let current: string[] = []
          let currentWc = 0
          for (const s of sentences) {
            const wc = wordCount(s)
            if (currentWc + wc > 500 && current.length > 0) {
              refined.push(current.join(" "))
              current = [s]
              currentWc = wc
            } else {
              current.push(s)
              currentWc += wc
            }
          }
          if (current.length > 0) {
            refined.push(current.join(" "))
          }
        } else {
          refined.push(sub)
        }
      }
    } else {
      refined.push(seg)
    }
  }

  // Third pass: merge tiny chunks
  const merged: string[] = []
  for (let i = 0; i < refined.length; i++) {
    const text = refined[i].trim()
    if (isNoise(text) || text.length === 0) continue

    if (wordCount(text) < MIN_WORDS && merged.length > 0) {
      merged[merged.length - 1] += "\n" + text
    } else if (wordCount(text) < MIN_WORDS && i + 1 < refined.length) {
      refined[i + 1] = text + "\n" + refined[i + 1]
    } else {
      merged.push(text)
    }
  }

  // Filter out pure noise chunks
  const clean = merged.filter((c) => !isNoise(c.trim()) && wordCount(c) >= 20)

  return clean.length > 0 ? clean : [normalizedText]
}
