-- Add 'senators' and 'house' to the feed_type check constraint
-- This migration allows Senate and House feeds to save tweets to the database

-- First, drop the existing constraint
ALTER TABLE tweets DROP CONSTRAINT IF EXISTS tweets_feed_type_check;

-- Add the new constraint with additional feed types
ALTER TABLE tweets ADD CONSTRAINT tweets_feed_type_check 
  CHECK (feed_type IN ('osint', 'us-officials', 'influencers', 'senators', 'house'));

-- Update feed_metadata to include new feed types
INSERT INTO feed_metadata (feed_type, lookback_hours) VALUES 
  ('senators', 12),
  ('house', 12)
ON CONFLICT (feed_type) DO NOTHING;
