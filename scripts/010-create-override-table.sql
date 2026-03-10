-- Create congressional stance overrides table with proper constraints
-- This table stores manual overrides and notes for congressional member stances

-- Drop existing table if it exists (to recreate with proper constraints)
DROP TABLE IF EXISTS congressional_stance_overrides;

-- Create the table with a unique constraint on member_name + chamber
CREATE TABLE congressional_stance_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_name TEXT NOT NULL,
  chamber TEXT NOT NULL CHECK (chamber IN ('Senate', 'House')),
  override_stance TEXT, -- Can be null if only adding notes without changing stance
  user_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint required for upsert operations
  CONSTRAINT congressional_stance_overrides_member_chamber_unique UNIQUE (member_name, chamber)
);

-- Create index for faster lookups
CREATE INDEX idx_stance_overrides_member ON congressional_stance_overrides(member_name);
CREATE INDEX idx_stance_overrides_chamber ON congressional_stance_overrides(chamber);

-- Add comment
COMMENT ON TABLE congressional_stance_overrides IS 'Manual overrides and notes for congressional member Venezuela stances';
