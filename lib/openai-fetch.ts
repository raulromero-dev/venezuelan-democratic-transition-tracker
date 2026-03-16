const PRIMARY_MODEL = "gpt-5.2"
const FALLBACK_MODEL = "gpt-5.1"

interface OpenAIRequestBody {
  instructions: string
  input: string
  tools?: unknown[]
  tool_choice?: string
  temperature?: number
}

export async function callOpenAI(
  apiKey: string,
  body: OpenAIRequestBody,
): Promise<{ responseText: string; model: string }> {
  const attempt = async (model: string) =>
    fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, ...body }),
    })

  let response = await attempt(PRIMARY_MODEL)

  if (!response.ok) {
    console.warn(`[openai] ${PRIMARY_MODEL} failed (${response.status}), falling back to ${FALLBACK_MODEL}`)
    response = await attempt(FALLBACK_MODEL)
  }

  const responseText = await response.text()

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} - ${responseText}`)
  }

  return { responseText, model: response.ok ? PRIMARY_MODEL : FALLBACK_MODEL }
}
