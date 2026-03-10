-- Pillar 1: Freedom of the Press — Video tracking table
-- Tracks YouTube videos that have been downloaded and transcribed

CREATE TABLE IF NOT EXISTS pillar1_videos (
  video_id TEXT PRIMARY KEY,
  channel_id TEXT NOT NULL,
  title TEXT,
  upload_date TIMESTAMPTZ,
  duration INTEGER,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pillar1_channel ON pillar1_videos(channel_id);
CREATE INDEX IF NOT EXISTS idx_pillar1_status ON pillar1_videos(status);

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION update_pillar1_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_pillar1_videos_updated_at ON pillar1_videos;
CREATE TRIGGER trigger_pillar1_videos_updated_at
  BEFORE UPDATE ON pillar1_videos
  FOR EACH ROW
  EXECUTE FUNCTION update_pillar1_videos_updated_at();
