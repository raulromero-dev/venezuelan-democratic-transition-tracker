# Venezuelan Transition Tracker

**Democratic and Economic Development — Open Intelligence Platform**

An open-source intelligence platform that independently measures democratic and economic progress in Venezuela across three axes: **freedom of the press**, **freedom to organize**, and **economic activity**. Built by the Miranda Center.

---

## Table of Contents

- [Mission](#mission)
- [Why This Matters](#why-this-matters)
- [The Three Pillars](#the-three-pillars)
  - [Pillar 1: Freedom of the Press Index](#pillar-1-freedom-of-the-press-index)
  - [Pillar 2: Protests & Liberty to Organize](#pillar-2-protests--liberty-to-organize)
  - [Pillar 3: Economic Activity & Inflation](#pillar-3-economic-activity--inflation)
- [Previous Work: Mofeta OSINT Dashboard](#previous-work-mofeta-osint-dashboard)
- [Technical Approach](#technical-approach)
- [Dissemination & Open Source Strategy](#dissemination--open-source-strategy)
- [Getting Started (Development)](#getting-started-development)
- [Contributing](#contributing)
- [License](#license)

---

## Mission

Venezuela's regime has long been opaque to external scrutiny. It claims to uphold democratic freedoms while imprisoning hundreds of journalists. It has nominally opened its economy to private enterprise, yet no credible independent measurement of that opening exists. Official statistics are either unreliable or simply absent.

The Venezuelan Transition Tracker changes that. By combining media monitoring, social media analysis, satellite imagery, surveys, web scraping, audio transcription, and large language models, we produce **transparent and reproducible indices** that Venezuelan civil society and the international community can trust when evaluating the country's transition.

We are building **measurement infrastructure**, the kind that has historically required large institutional budgets and years of fieldwork, and making it automated, open-source, and resilient to the very censorship it is designed to expose.

## Why This Matters

The Miranda Center previously created an OSINT dashboard shared with Nobel Peace Prize winner and Venezuelan opposition leader María Corina Machado and her team, within the context of Operation Southern Spear and Absolute Resolve. That dashboard helped drive military and intelligence insights that led to negotiations and engagements with US representatives (diplomatic, congressional, and intelligence personnel) and members of the Venezuelan transitional government.

The Transition Tracker extends this track record into systematic, longitudinal measurement of Venezuela's democratic and economic trajectory.

---

## The Three Pillars

### Pillar 1: Freedom of the Press Index

**Goal:** Produce a continuously updated, automated index that measures the degree of press freedom in Venezuela by analyzing what media outlets actually publish and broadcast.

#### What We Measure

A weekly **Media Criticism Index**: the ratio of critical-to-supportive coverage of the interim government, tracked over time. A rising index signals increasing press freedom. We also detect the emergence of previously taboo topics in state media, which serves as a measurable proxy for press freedom expansion.

#### How It Works

1. **Daily Media Corpus Collection.** Scrape headlines and full articles from Venezuelan newspapers and TV channel transcripts from 24-hour programming.
2. **LLM-Powered Classification.** Each piece or segment is classified along multiple dimensions:
   - Critical / neutral / supportive toward the Rodríguez government
   - Topic category (corruption, elections, economy, human rights, economic development, oil & minerals)
   - Whether the source is state-affiliated or independent
3. **Topic Emergence Detection.** All articles are embedded using text embeddings and clustered to detect the appearance of previously censored topics (e.g., discussion of free elections, criticism of PSUV, mention of María Corina Machado).
4. **Weekly Index Generation.** Aggregate scores into the Media Criticism Index with temporal granularity.

#### Innovation

Combines established LLM sentiment classification with a novel application: using topic emergence detection as a proxy for press freedom expansion. The appearance of previously censored topics in state media is a measurable signal that no existing methodology captures at this granularity. This approach automates and adds temporal resolution beyond what expert-survey-based indices currently provide.

#### Key Technical Components

- **LLM pipeline** using Claude (Haiku for bulk sentiment/topic tagging, Sonnet for nuanced editorial analysis)
- **YouTube scraping** for Venezuelan TV channel transcripts (5–10 channels)
- **Web scraping** of Venezuelan newspapers (headlines, full articles, and editorial content)
- **Text embeddings** (OpenAI) for topic clustering and emergence detection
- **Supabase** (PostgreSQL) for storage

#### Data Sources

| Source Type | Description |
|---|---|
| Venezuelan TV channels | Daily programming transcripts via YouTube scraping |
| Venezuelan newspapers | Web scraping of headlines and full articles |
| Note | Social media is explicitly excluded from this pillar because it is more unregulated and tends to include journalists who are not in Venezuela |

#### Pillar 1 Architecture

```
Venezuelan Media Sources
        │
        ├── TV Channels (YouTube) ──→ Apify Scraping ──→ Raw Transcripts
        └── Newspapers ──────────────→ Web Scraping ───→ Raw Articles
                                                              │
                                                              ▼
                                                    ┌─────────────────┐
                                                    │ Claude Haiku     │
                                                    │ Bulk Processing  │
                                                    │                  │
                                                    │ • Sentiment      │
                                                    │ • Topic Category │
                                                    │ • Source Type    │
                                                    └────────┬────────┘
                                                             │
                                              ┌──────────────┼──────────────┐
                                              ▼              ▼              ▼
                                     ┌──────────────┐ ┌───────────┐ ┌──────────────┐
                                     │ Embedding +   │ │ Claude    │ │ Weekly Index  │
                                     │ Topic         │ │ Sonnet    │ │ Aggregation   │
                                     │ Clustering    │ │ Editorial │ │               │
                                     │               │ │ Analysis  │ │               │
                                     └──────┬───────┘ └─────┬─────┘ └──────┬───────┘
                                            │               │              │
                                            ▼               ▼              ▼
                                     ┌─────────────────────────────────────────────┐
                                     │              Supabase (PostgreSQL)           │
                                     │  • Raw articles + transcripts                │
                                     │  • Sentiment scores per segment              │
                                     │  • Topic clusters + emergence signals        │
                                     │  • Weekly Media Criticism Index values        │
                                     └─────────────────────────────────────────────┘
```

---

### Pillar 2: Protests & Liberty to Organize

**Goal:** Produce an independent, government-proof measurement of protest activity across Venezuela with built-in fact-checking to ensure data integrity.

#### What We Measure

A weekly **Assembly Freedom Index**: the number, size, geographic spread, and government response type for all detected protests across Venezuela.

#### How It Works

1. **Social Media Ingestion.** LLM agents monitor X/Twitter for protest-related content, geolocate posts, and classify by size estimate and protest type.
2. **Fact-Checking Pipeline.** Before any event enters the index:
   - Reverse image search detects recycled or misattributed protest imagery
   - Manipulated or out-of-context media is flagged and excluded
3. **Contextual Enrichment.** Verified events are enriched with additional context from trusted civil society organizations (Foro Penal, PROVEA, Espacio Público, ACLED) to provide deeper background on detention patterns, human rights conditions, and historical protest data in each region.
3. **Government Response Classification.** Each protest event is tagged with the type of government response (peaceful dispersal, tear gas, arrests, etc.)
4. **Weekly Index Generation.** Events are aggregated into the Assembly Freedom Index with geographic and temporal breakdowns.

#### Innovation

By adding LLM agents that perform reverse image search and source verification before events enter the index, we produce a higher-fidelity signal than any existing automated system. The fact-checking pipeline is where we think the real contribution lies. Protest researchers have long called for human-in-the-loop verification, but nobody has built an automated version of it. We're using tool-use agents to do exactly that: give the system the ability to question its own inputs, verify imagery authenticity, and reject anything it can't confirm. On top of that, verified events get enriched with context from organizations like Foro Penal and PROVEA, not as a gatekeeping step, but to add the kind of on-the-ground detail that makes the data actually useful. That's the piece that turns a social media scraper into something closer to an actual measurement instrument.

#### Key Technical Components

- **LLM pipeline** (Claude API: Haiku for bulk classification, Sonnet for fact-checking reasoning)
- **X API** (Basic tier) for monitoring protest-related keywords, hashtags, and accounts in Venezuelan geo-context
- **Google Cloud Vision API** for reverse image search on protest imagery (~2K–5K queries/month)
- **OpenAI embeddings** for clustering verified protest events and detecting geographic/temporal patterns
- **Google Maps API** for geocoding protest locations and rendering maps
- **Supabase** (shared instance with Pillar 1) for storage

#### Contextual Enrichment Sources

| Organization | Focus Area |
|---|---|
| Foro Penal | Political prisoners and detentions |
| PROVEA | Human rights documentation |
| Espacio Público | Freedom of expression monitoring |
| ACLED | Armed conflict and protest event data |

#### Pillar 2 Architecture

```
X/Twitter (Protest Monitoring)
        │
        ├── Text Posts ────────────→ LLM Classification ──→ Protest Event Candidate
        └── Image Posts ───────────→ LLM Description ──────→ Protest Event Candidate
                                                                    │
                                                                    ▼
                                                    ┌───────────────────────────┐
                                                    │    FACT-CHECKING PIPELINE  │
                                                    │                            │
                                                    │ 1. Reverse Image Search    │
                                                    │    (Google Cloud Vision)    │
                                                    │                            │
                                                    │ 2. Manipulated Media       │
                                                    │    Detection               │
                                                    │                            │
                                                    │ 3. Geolocation             │
                                                    │    Verification            │
                                                    └─────────────┬─────────────┘
                                                                  │
                                                          ┌───────▼───────┐
                                                          │  VERIFIED      │
                                                          │  PROTEST EVENT │
                                                          └───────┬───────┘
                                                                  │
                                                                  ▼
                                                    ┌───────────────────────────┐
                                                    │  CONTEXTUAL ENRICHMENT    │
                                                    │                            │
                                                    │  • Foro Penal              │
                                                    │  • PROVEA                  │
                                                    │  • Espacio Público         │
                                                    │  • ACLED                   │
                                                    │                            │
                                                    │  Adds detention context,   │
                                                    │  human rights background,  │
                                                    │  historical protest data   │
                                                    └─────────────┬─────────────┘
                                                                  │
                                                          ┌───────▼───────┐
                                                          │  ENRICHED      │
                                                          │  PROTEST EVENT │
                                                          │                │
                                                          │ • Location     │
                                                          │ • Size Est.    │
                                                          │ • Type         │
                                                          │ • Gov Response │
                                                          │ • Context      │
                                                          └───────┬───────┘
                                                                  │
                                                                  ▼
                                                    ┌──────────────────────────┐
                                                    │ Weekly Assembly Freedom  │
                                                    │ Index Aggregation        │
                                                    └──────────────────────────┘
```

---

### Pillar 3: Economic Activity & Inflation

**Goal:** Produce independent economic indicators for Venezuela using satellite imagery, maritime tracking, surveys, and web scraping, since official statistics are unreliable or nonexistent.

This pillar contains three sub-components:

#### 3A: Nightlight Economic Activity Index

**What:** Independent GDP proxy for Venezuela using nighttime lights, based on the Henderson et al. (2012, American Economic Review) methodology. This is the foundational paper proving nightlights are a reliable GDP proxy, especially for countries with low-quality data. Venezuela is a textbook case.

**How:**
1. Ingest VIIRS Day/Night Band composites monthly for all of Venezuela at subnational level (states, municipalities)
2. Apply the Henderson et al. panel regression of nightlight intensity against economic activity
3. Enhance with more recent methodological advances
4. Track changes at the city level: which regions are recovering first? Is Caracas recovering while Bolívar state (mining region) stagnates?
5. Generate a monthly **Economic Light Index** for each Venezuelan state

**Data Sources:**
- VIIRS Day/Night Band monthly composites (NOAA EOG, free)
- Sentinel-2 supplementary daytime imagery at 10m resolution (ESA Copernicus, free)
- High-resolution daytime imagery for targeted areas of interest (PlanetScope / SkyFi / SPOT)

**Innovation:** First systematic application of nightlight-GDP methodology to Venezuelan transition monitoring. The combination of VIIRS nightlights + Sentinel-2 daytime + other low-resolution satellite imagery for surface classification of a transition economy is novel.

#### 3B: Oil Industry Monitoring

**What:** Independent observation and verification of the Venezuelan oil industry's trajectory during the study period (whether it is growing, stagnating, or declining) using multiple independent remote-sensing methodologies. The goal is not to produce a production estimate, but to observe and vet the actual state of oil industry activity against official claims and track how it evolves during the transition.

**How:**
1. **Gas Flare Detection.** Use VIIRS NightFire algorithm (Elvidge et al., Remote Sensing 2021) to detect and quantify gas flaring at known Venezuelan oil fields (Orinoco Belt, Lake Maracaibo, Paraguaná). Changes in flaring patterns over time signal shifts in extraction activity.
2. **Methane Emissions.** Leverage NASA EMIT satellite methane detection data (already showing massive emissions from Venezuelan infrastructure, per Bloomberg Jan 2026). Tracking methane trends provides an independent signal of operational intensity.
3. **Maritime AIS Tracking.** Monitor tanker traffic at Venezuelan ports (José, Amuay, Puerto La Cruz). Track vessel call frequency, vessel class composition, and AIS gaps indicating dark fleet activity over time.
4. **Facility Verification.** High-resolution imagery from oil production facilities for surface change detection, tank monitoring, and infrastructure activity.

**Data Sources:**
- VIIRS NightFire for flare detection (NOAA EOG)
- NASA EMIT methane data (NASA Earthdata)
- AIS maritime tracking (MarineTraffic)
- High-res daytime imagery for oil facilities (PlanetScope / SkyFi / SPOT)

**Innovation:** Fusion of four independent remote-sensing methodologies (flaring, methane, maritime AIS, high-res satellite imagery) to observe oil industry trajectory. Cross-referencing these signals against PDVSA's official claims produces a longitudinal record of whether the regime's economic narrative matches observable reality.

#### 3C: Inflation Tracking

**What:** Independent estimate of inflation through surveys and web scraping, following a CPI-like methodology using a basket of goods and services that ordinary Venezuelan citizens consume monthly.

**How:**
1. **Individual Surveys.** Survey individuals about their typical share of monthly expenditures across urban and rural areas, minimizing selection bias. Results inform the construction of a consumption-weighted index. These surveys are conducted manually to ensure quality and reduce selection bias.
2. **Web Scraping.** Monitor multiple sites that cite general costs associated with Venezuelan consumption: food, utilities, and other essentials. Price data collection is automated via scraping tools.
3. **CPI Index Calculation.** Calculate month-over-month CPI changes with detailed reporting.

#### Pillar 3 Key Technical Components

- **Satellite processing** (Google Earth Engine / compute) for VIIRS composites, Henderson et al. regression models, NDVI calculations, and image change detection
- **Claude API** (Sonnet) for cross-referencing official claims against satellite/AIS signals and generating analysis reports
- **MarineTraffic** for AIS maritime tracking
- **Google Maps / Mapbox API** for visualization of nightlight index, flare maps, tanker routes, and economic dashboards
- **Survey infrastructure** for monthly individual consumption tracking
- **BrowserBase / LLM scraping** for price monitoring

#### Pillar 3 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SATELLITE & REMOTE SENSING                   │
│                                                                 │
│  VIIRS Nightlights ──→ Henderson Regression ──→ Economic Light  │
│  (Monthly)              (State Level)            Index          │
│                                                                 │
│  VIIRS NightFire ────→ Flare Trend Analysis ─┐                  │
│  NASA EMIT ──────────→ Methane Trend ────────┤                  │
│  AIS Maritime ───────→ Tanker Traffic ───────┼──→ Oil Industry  │
│  High-Res Imagery ───→ Facility Monitoring ──┘    Trajectory    │
│                                                   Monitoring    │
│                                                                 │
│  Claude Sonnet ──────→ Cross-reference official claims vs       │
│                         satellite/AIS signals over time         │
│                         → Longitudinal verification repors      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      INFLATION TRACKING                         │
│                                                                 │
│  Individual Surveys ──→ Expenditure Shares ──→ Basket Weights   │
│  (~30 individuals/mo)                                           │
│                                                                 │
│  Web Scraping ────────→ Price Data ──────────→ CPI Calculation  │
│  (Food, Utilities,                               (MoM changes)  │
│   Consumer Goods)                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Previous Work: Mofeta OSINT Dashboard

This repository inherits substantial infrastructure from the **Mofeta OSINT Dashboard**, a specialized intelligence platform built to monitor Venezuela's democratic transition. The existing codebase provides a foundation of methodologies, data pipelines, and UI patterns that the Transition Tracker will extend.

### Existing Modules

#### Congressional Mapping & Tracker
Tracks U.S. congressional members' stances on Venezuela's democratic transition. Includes an interactive geographic map of support/opposition, AI-powered stance analysis (via GPT web search), manual override capabilities, CSV export, and committee/tag filtering. Stances are refreshed daily via Vercel Cron.

**Key infrastructure inherited:** Batch-processing pattern for AI analysis of large datasets, Supabase upsert patterns, stance override system, progressive batch processing with progress tracking.

#### X/Twitter Feed Aggregation (Multiple Feeds)
Real-time social media intelligence from curated X/Twitter accounts across multiple categories:
- **OSINT Feed:** Think tanks, analysts, and government sources
- **Senate & House Feeds:** All 535+ members of Congress
- **Foreign Ministers Feed:** 150+ foreign ministry and head-of-state accounts across 8 regions
- **Influencer Feed:** MAGA, Democratic, and Venezuelan influencer accounts
- **SOUTHCOM & US Gov Feed:** 49 official US government accounts
- **Regime Feed:** Venezuelan government officials and state media

**Key infrastructure inherited:** X API batch querying with rate limiting, semantic relevance scoring (keyword + OpenAI embeddings), Supabase tweet caching layer, relevance threshold filtering.

#### Global Intelligence Monitoring
Monitors international diplomatic activity via both RSS feeds (Google News) and direct X/Twitter monitoring from foreign governments across all regions. Includes government domain-to-country mapping for 80+ nations and relevance scoring.

**Key infrastructure inherited:** Google News RSS parsing, multi-region search patterns, government source domain registry, OpenAI embedding-based relevance scoring.

#### Media Monitoring
Aggregates news coverage from 100+ outlets across English, Spanish, Venezuelan, World, and Regime media categories. Uses GPT web search for article discovery with topic classification.

**Key infrastructure inherited:** Multi-language media monitoring, topic classification system, outlet categorization, Google News RSS integration.

### Shared Technical Foundation

| Component | Technology | Purpose |
|---|---|---|
| Framework | Next.js 16 (App Router) | Application framework |
| Database | Supabase (PostgreSQL) | Persistent storage for all feeds and indices |
| UI | shadcn/ui + Tailwind CSS v4 | Component library and styling |
| Design System | Mofeta Design System | Monochromatic, glass-morphism Palantir-inspired aesthetic |
| Deployment | Vercel | Hosting, serverless functions, cron jobs |
| AI (Stance Analysis) | OpenAI GPT-5.1 with web search | Congressional and diplomatic stance analysis |
| AI (Relevance) | OpenAI text-embedding-3-small | Semantic relevance scoring |
| Social Media | X API (Basic tier) | Real-time tweet monitoring |


### What Carries Forward

The Transition Tracker will directly leverage:

1. **The LLM pipeline pattern:** batch processing, progress tracking, error recovery, database upsert
2. **The semantic relevance scoring system:** keyword matching + embedding-based similarity scoring
3. **The Supabase data layer:** tweet/article caching, feed metadata, upsert patterns
4. **The design system and UI components:** glass cards, skewed indicators, monochromatic palette, feed layouts
5. **The X API integration patterns:** batch querying, rate limiting, media extraction, quoted tweet handling
6. **The Google News RSS infrastructure:** site filtering, date filtering, multi-language support
7. **The deployment and cron infrastructure:** Vercel serverless functions with scheduled refreshes

---

## Technical Approach

### LLM Strategy

We use a **tiered LLM approach** optimized for cost and capability:

| Task | Model | Rationale |
|---|---|---|
| Bulk sentiment classification | Claude Haiku | High throughput, low cost for simple classification tasks |
| Editorial analysis & reasoning | Claude Sonnet | Nuanced understanding of political context, tool use for fact-checking |
| Text embeddings | OpenAI text-embedding-3-small | Industry-standard embeddings for topic clustering and similarity |
| Cross-referencing & report generation | Claude Sonnet | Complex reasoning for comparing claims against evidence |

---

## Dissemination & Open Source Strategy

### Code & Data

- **All code** will be open sourced in this repository
- **All artifacts** (scrapers, pipelines, model prompts, embedding configurations) will be documented and reproducible
- **Findings page** will be publicly accessible, publishing all index values with methodology explanations

### Distribution

- Index values and reports distributed via the **Miranda Center's network** to appropriate media organizations
- Regular social media updates sharing findings and methodology
- **Research paper** outlining findings, methodology, and validation, submitted for external publication with self-publishing as fallback

### Community

- Open issues and pull requests welcome
- Methodology documentation sufficient for independent reproduction
- Data artifacts published alongside code for verification

---

## Getting Started (Development)

### Prerequisites

- Node.js >= 20
- pnpm
- Supabase account (for database)
- Vercel account (for deployment)

### Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI / LLM
OPENAI_API_KEY=          # For embeddings and GPT-based analysis
# ANTHROPIC_API_KEY=     # For Claude Haiku/Sonnet pipelines (Pillar 1, 2, 3)

# Social Media
X_API_BEARER_TOKEN=      # X/Twitter API for social media monitoring

# Satellite & Maritime (Pillar 3)
# MARINETRAFFIC_API_KEY= # AIS maritime tracking
# GOOGLE_EARTH_ENGINE=   # Satellite processing

# Auth
AUTH_SECRET=
CRON_SECRET=
```

### Installation

```bash
pnpm install
pnpm dev
```

### Database Setup

Run the SQL migration scripts in `scripts/` in order to set up the Supabase schema.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

**Built by Mofeta and the Miranda Center**
