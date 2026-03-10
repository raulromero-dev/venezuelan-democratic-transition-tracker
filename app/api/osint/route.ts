import { streamText } from "ai"

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query) {
      return new Response("Query is required", { status: 400 })
    }

    const result = streamText({
      model: "xai/grok-2-1212",
      prompt: `You are an OSINT analyst monitoring the situation in Venezuela. Search for and summarize the latest reports, news, and developments related to: ${query}. 

Focus on:
- Recent political developments
- Security situations
- Government and opposition activities
- International reactions
- Humanitarian concerns
- Economic conditions

Provide factual, sourced information with timestamps when available. Format your response as a structured report with bullet points.`,
      system:
        "You are a professional OSINT analyst providing real-time intelligence briefings on Venezuela. Be factual, concise, and cite sources when possible.",
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Error generating OSINT report:", error)
    return new Response(`Failed to generate OSINT report: ${error}`, { status: 500 })
  }
}
