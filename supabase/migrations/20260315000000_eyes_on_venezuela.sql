-- ============================================================
-- Eyes on Venezuela — isolated tables (prefix: eov_)
-- Safe to run multiple times (IF NOT EXISTS / ON CONFLICT)
-- ============================================================

-- 1. Feed metadata
CREATE TABLE IF NOT EXISTS eov_feed_metadata (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_type       text UNIQUE NOT NULL,
  last_fetched_at timestamptz,
  newest_id       text,
  lookback_hours  integer,
  updated_at      timestamptz DEFAULT now()
);

INSERT INTO eov_feed_metadata (feed_type) VALUES
  ('osint'),
  ('us-officials'),
  ('influencers'),
  ('foreign-ministers'),
  ('congressional-stances'),
  ('media')
ON CONFLICT (feed_type) DO NOTHING;

-- 2. Tweets (Senate X, House X, OSINT, foreign ministers)
CREATE TABLE IF NOT EXISTS eov_tweets (
  id               text PRIMARY KEY,
  feed_type        text NOT NULL,
  author           text NOT NULL,
  handle           text NOT NULL,
  content          text NOT NULL,
  avatar           text,
  profile_image    text,
  role             text,
  category         text,
  verified         boolean DEFAULT false,
  tweet_time       timestamptz NOT NULL,
  link             text NOT NULL,
  images           jsonb DEFAULT '[]',
  metrics          jsonb DEFAULT '{"likes":0,"retweets":0,"replies":0}',
  quoted_tweet     jsonb,
  subgroups        jsonb DEFAULT '[]',
  affiliation      text,
  relevance_score  numeric,
  relevance_method text,
  fetched_at       timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS eov_tweets_feed_type_idx  ON eov_tweets(feed_type);
CREATE INDEX IF NOT EXISTS eov_tweets_tweet_time_idx ON eov_tweets(tweet_time DESC);

-- 3. Congressional stances
CREATE TABLE IF NOT EXISTS eov_congressional_stances (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_name    text NOT NULL,
  chamber        text NOT NULL,
  party          text,
  state          text,
  district       text,
  stance         text,
  confidence     numeric DEFAULT 0,
  analysis_notes text,
  evidence       jsonb DEFAULT '[]',
  last_updated   timestamptz DEFAULT now(),
  UNIQUE (member_name, chamber)
);
CREATE INDEX IF NOT EXISTS eov_congressional_stances_chamber_idx ON eov_congressional_stances(chamber);
CREATE INDEX IF NOT EXISTS eov_congressional_stances_stance_idx  ON eov_congressional_stances(stance);

-- 4. Congressional stance overrides
CREATE TABLE IF NOT EXISTS eov_congressional_stance_overrides (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_name     text NOT NULL,
  chamber         text NOT NULL,
  override_stance text,
  user_notes      text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  UNIQUE (member_name, chamber)
);

-- 5. Global intel
CREATE TABLE IF NOT EXISTS eov_global_intel (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  leader_name    text NOT NULL,
  leader_title   text,
  country        text,
  statement      text NOT NULL,
  stance         text,
  context        text,
  source         text,
  source_url     text,
  statement_date timestamptz DEFAULT now(),
  fetched_at     timestamptz DEFAULT now(),
  UNIQUE (leader_name, statement)
);
CREATE INDEX IF NOT EXISTS eov_global_intel_country_idx        ON eov_global_intel(country);
CREATE INDEX IF NOT EXISTS eov_global_intel_statement_date_idx ON eov_global_intel(statement_date DESC);

-- 6. Media articles
CREATE TABLE IF NOT EXISTS eov_media_articles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  snippet         text,
  source          text,
  url             text UNIQUE NOT NULL,
  image_url       text,
  published_at    timestamptz DEFAULT now(),
  category        text,
  relevance_score numeric,
  topics          jsonb DEFAULT '[]',
  fetched_at      timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS eov_media_articles_published_at_idx ON eov_media_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS eov_media_articles_category_idx     ON eov_media_articles(category);
