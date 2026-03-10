# Venezuelan Democratic Transition Tracker

## Project Objective

This application is a specialized intelligence dashboard designed to monitor, track, and analyze developments related to Venezuela's democratic transition. It aggregates data from multiple open-source intelligence (OSINT) channels — including U.S. congressional activity, social media feeds, global diplomatic signals, and media coverage — to provide a comprehensive, real-time picture of the political landscape surrounding Venezuela.

---

## Feature Modules

### 1. Congressional Mapping & Tracker (US Officials)

**Objective:** Track U.S. congressional members' stances and legislative activity related to Venezuela's democratic transition. Provide a visual geographic map of support/opposition across Congress and surface real-time feeds from senators and House representatives.

**Key capabilities:**
- Interactive congressional map showing stance distribution (supportive, opposed, neutral)
- Individual member stance analysis powered by AI (xAI/Grok)
- Manual stance overrides for editorial correction
- Real-time X/Twitter feeds from Senate and House members discussing Venezuela
- Committee filtering and member detail views

**Key files:**
- `components/congressional-map.tsx` — Interactive stance map visualization
- `components/congressional-tracker.tsx` — Tracker panel with member list and filters
- `components/MemberListItem.tsx` — Individual congress member display
- `components/senator-feed.tsx` — Senate X feed
- `components/house-feed.tsx` — House X feed
- `app/us-officials/page.tsx` — US Officials page
- `app/api/congress-stance/` — Stance CRUD + AI analysis APIs
- `app/api/senator-feed/route.ts` — Senator feed API
- `app/api/house-feed/route.ts` — House feed API
- `lib/congress-members.ts` — Senate member data
- `lib/house-members.ts` — House member data
- `lib/congressional-stance-types.ts` — Type definitions
- `lib/db/congressional-stances.ts` — Database operations

### 2. X Feeds — OSINT, Congress & Senate

**Objective:** Aggregate and display real-time social media intelligence from curated X/Twitter accounts relevant to Venezuela — including OSINT analysts, U.S. government officials, military/SOUTHCOM accounts, and regime-linked accounts. Uses xAI's X search API for live data retrieval.

**Key capabilities:**
- Multi-source OSINT feed with keyword filtering (Venezuela-specific terms)
- Visual tweet display with engagement metrics
- Semantic relevance scoring to surface the most pertinent posts
- Separate feeds for OSINT community, congressional, and SOUTHCOM sources
- Integration with xAI/Grok for X platform search

**Key files:**
- `components/osint-feed.tsx` — Main OSINT feed component
- `components/osint-feed-x.tsx` — X-integrated OSINT feed
- `components/osint-feed-visual.tsx` — Visual/card-based feed layout
- `components/southcom-feed.tsx` — SOUTHCOM-specific feed
- `app/osint/page.tsx` — OSINT page
- `app/api/osint-feed/route.ts` — OSINT feed API
- `app/api/osint/route.ts` — xAI X search integration
- `lib/osint-accounts.ts` — Curated OSINT X account list
- `lib/us-gov-accounts.ts` — US government X accounts
- `lib/venezuela-keywords.ts` — Search keyword definitions
- `lib/semantic-relevance.ts` — Relevance scoring logic
- `docs/xai-x-search-integration.md` — Integration documentation

### 3. Global / International Monitoring

**Objective:** Monitor international diplomatic activity and statements from foreign governments, ministers, and international organizations regarding Venezuela. Track global sentiment and diplomatic positioning in real time.

**Key capabilities:**
- Global intelligence feed aggregating international diplomatic signals
- Foreign minister X feed tracking
- Global statements API for official declarations
- International account monitoring across multiple countries and organizations

**Key files:**
- `components/global-intel-feed.tsx` — Global intelligence feed display
- `app/global/page.tsx` — Global monitoring page
- `app/api/global-intel/route.ts` — Global intel API
- `app/api/global-statements/route.ts` — Global statements API
- `app/api/foreign-minister-feed/route.ts` — Foreign minister feed API
- `lib/foreign-ministers-accounts.ts` — Foreign minister X accounts
- `lib/db/global-intel.ts` — Database operations for global intel
- `public/config/global-accounts.md` — Configurable account list

### 4. Media Monitoring (Media Outlets)

**Objective:** Aggregate and display news coverage about Venezuela from major media outlets, using both RSS feeds (Google News) and web intelligence APIs (Webz.io). Provide a curated view of how the democratic transition is being covered in the press.

**Key capabilities:**
- Media article aggregation from multiple outlet types
- Google News RSS integration for real-time article discovery
- Webz.io news API integration for broader web coverage
- Article categorization and media outlet tracking
- Recent articles timeline view

**Key files:**
- `components/media-feed.tsx` — Main media feed component
- `components/webz-media-feed.tsx` — Webz.io-powered media feed
- `components/media-links.tsx` — Media outlet links/directory
- `components/recent-articles.tsx` — Recent articles timeline
- `app/api/media-articles/route.ts` — Media articles API
- `app/api/webz-news/route.ts` — Webz.io news API
- `lib/media-outlets.ts` — Media outlet definitions
- `lib/db/media-articles.ts` — Database operations
- `lib/rss/google-news.ts` — Google News RSS parser

---

## Shared Infrastructure

### Database
- **Supabase** (PostgreSQL) for persistence — see `lib/supabase/` for client setup
- `lib/db/tweets.ts` — Shared tweet caching layer used across all X feed modules
- SQL migration scripts in `scripts/` for schema setup

### External APIs
- **xAI/Grok** — X/Twitter search and AI-powered stance analysis
- **Webz.io** — Web news intelligence
- **Google News RSS** — News article aggregation

### UI Framework
- **Next.js 16** with App Router
- **shadcn/ui** components in `components/ui/`
- **Tailwind CSS v4** for styling
- **Vercel** for deployment

---

## Development Notes

- This project was extracted from a larger Venezuela OSINT dashboard. Some configuration files (e.g., `package.json`) may contain dependencies from the parent project that are not used here. Consider pruning unused dependencies.
- Environment variables required: Supabase URL/keys, xAI API key, Webz.io API key, and any authentication secrets referenced in `auth-check.tsx`.
- The `lib/mofeta-design-system.ts` file contains the project's design system tokens and conventions.
