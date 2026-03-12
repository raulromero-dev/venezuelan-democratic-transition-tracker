export function normalize(raw: string): string {
  const lines = raw.split("\n")

  // Detect format: subtitle-style has short lines
  const nonEmptyLengths = lines.filter((l) => l.trim().length > 0).map((l) => l.trim().length)
  nonEmptyLengths.sort((a, b) => a - b)
  const median = nonEmptyLengths[Math.floor(nonEmptyLengths.length / 2)] || 0

  if (median >= 50) {
    // Long-line format (estelar): already full sentences, just clean up
    return lines
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .join("\n")
  }

  // Subtitle-style format (matutina, a-esta-hora): join short lines
  const paragraphs: string[] = []
  let current: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.length === 0) {
      if (current.length > 0) {
        paragraphs.push(current.join(" "))
        current = []
      }
    } else {
      current.push(trimmed)
    }
  }
  if (current.length > 0) {
    paragraphs.push(current.join(" "))
  }

  return paragraphs.join("\n")
}
