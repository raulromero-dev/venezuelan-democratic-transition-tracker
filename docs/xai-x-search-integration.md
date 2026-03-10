# xAI Grok X Search Integration - Technical Documentation

## Objective

Build a real-time social media intelligence feed for a Venezuela OSINT dashboard that:

1. Fetches recent posts (12-hour lookback) from specific US Government official X/Twitter accounts
2. Displays posts in a unified feed with avatar, handle, content, timestamp, and engagement metrics
3. Allows incremental refresh to add new posts without duplicates
4. Stores posts locally for history viewing

## Target Accounts

We have a curated list of 41 US Government official accounts organized into categories:

### White House & Executive
- `@WhiteHouse`, `@POTUS`, `@VP`, `@FLOTUS`, `@PressSec`

### National Security Council
- `@SecDef`, `@PentagonPresSec`

### State Department
- `@StateDept`, `@StateDeputySpox`, `@StateDeptSpox`, `@Aboriguez`

### Diplomats & Envoys
- `@USAmbOAS`, `@USAmbVenezuela`

### Southern Command
- `@Aboriguez`, `@Aboriguez` (Note: appears to be duplicated in source)

### Department of Defense
- `@DeptofDefense`, `@SecDef`, `@PentagonPresSec`

### Department of Homeland Security
- `@DHSgov`, `@SecMayorkas`

### Treasury / Sanctions
- `@USTreasury`, `@TreasuryDepSec`, `@FinCENgov`, `@OFACnews`

## Current Implementation Approach

### API Route: `/api/us-gov-feed/route.ts`

We're using the xAI `/v1/responses` endpoint with the `x_search` tool.

#### Request Structure

\`\`\`typescript
const requestBody = {
  model: "grok-4-1-fast-non-reasoning",
  tools: [
    {
      type: "x_search",
      x_search: {
        allowed_x_handles: ["WhiteHouse", "POTUS", "VP", ...], // 41 handles without @
      },
    },
  ],
  tool_choice: "required",
  messages: [
    {
      role: "user",
      content: `Search X/Twitter for the most recent posts from these specific accounts: @WhiteHouse, @POTUS, @VP, ...
      
Return the results as a JSON array with this structure:
[
  {
    "id": "unique_id",
    "handle": "@handle",
    "name": "Display Name",
    "content": "Tweet text",
    "timestamp": "ISO date",
    "likes": number,
    "retweets": number,
    "replies": number,
    "avatar": "url or null",
    "image": "url or null",
    "isVerified": boolean
  }
]

Only include posts from the last 12 hours. Return up to 20 posts, sorted by most recent first.`,
    },
  ],
};
\`\`\`

#### API Call

\`\`\`typescript
const response = await fetch("https://api.x.ai/v1/responses", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.XAI_API_KEY}`,
  },
  body: JSON.stringify(requestBody),
});
\`\`\`

## Problems Encountered

### 1. Model Ignores `allowed_x_handles`

Despite providing a specific list of handles in the `x_search` tool configuration, Grok generates its own search queries with different accounts:

**Expected behavior:** Only search the 41 accounts we specified

**Actual behavior:** Grok creates queries like:
\`\`\`
from:SpeakerJohnson OR from:LeaderMcConnell OR from:SenSchumer OR from:SecBlinken
\`\`\`

These accounts (SenSchumer, SecBlinken, etc.) are NOT in our `allowed_x_handles` list.

### 2. Empty Response Text

The API returns successfully, tool calls complete, but:
- `output_text` or `text` content is often empty
- The actual search results seem to be in tool call outputs but format is unclear

**Example response structure we're receiving:**

\`\`\`json
{
  "id": "resp_...",
  "output": [
    {
      "type": "tool_use",
      "id": "tool_call_...",
      "name": "x_search",
      "input": "{\"query\":\"from:SpeakerJohnson OR from:...\",\"limit\":15,\"mode\":\"Latest\"}"
    },
    {
      "type": "tool_result",
      "tool_use_id": "tool_call_...",
      "content": "..." // What format is this?
    },
    {
      "type": "output_text",
      "text": "" // Empty
    }
  ]
}
\`\`\`

### 3. Citations vs. Direct Results

We've tried extracting data from `response.citations` but unclear if this contains the actual tweet data or just source URLs.

## Questions for xAI Team

1. **How do we enforce `allowed_x_handles`?**
   - Is this configuration supposed to restrict the model's search queries?
   - Or is it just for filtering results after the search?

2. **What is the correct response parsing approach?**
   - Should we look at `tool_result` content?
   - Is the data in `citations`?
   - Why is `output_text` empty when tool calls succeed?

3. **Is there a better endpoint/approach for this use case?**
   - We need structured tweet data (handle, content, timestamp, metrics)
   - We have a fixed list of accounts to monitor
   - We need this to be reliable and parseable

4. **What model should we use?**
   - Currently using `grok-4-1-fast-non-reasoning`
   - Would a different model variant work better with x_search?

## Desired End State

A reliable API call that returns structured JSON with recent tweets from our specified accounts, including:
- Tweet ID
- Author handle and display name  
- Tweet content
- Timestamp
- Engagement metrics (likes, retweets, replies)
- Media URLs if present
- Verification status

## Environment

- Next.js 15 App Router
- Server-side API route
- `XAI_API_KEY` environment variable configured
- Direct fetch to xAI API (not using AI SDK due to version compatibility issues)
