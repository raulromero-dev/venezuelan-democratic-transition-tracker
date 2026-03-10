-- Drop the existing check constraint on congressional_stances that's blocking inserts
ALTER TABLE congressional_stances DROP CONSTRAINT IF EXISTS congressional_stances_stance_check;

-- Add a new, more permissive constraint that allows all valid stance values
ALTER TABLE congressional_stances ADD CONSTRAINT congressional_stances_stance_check 
  CHECK (stance IN ('ally-hawk', 'ally-dove', 'normalizer', 'pro-regime', 'none', ''));
