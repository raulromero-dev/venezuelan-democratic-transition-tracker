-- Migration: Update congressional_stances from 5-category to 3-category system
-- New categories: ally, neutral, normalizer

-- 1. Drop the existing constraint
ALTER TABLE congressional_stances DROP CONSTRAINT IF EXISTS congressional_stances_stance_check;

-- 2. Migrate existing data to new categories
UPDATE congressional_stances SET stance = 'ally' WHERE stance IN ('ally-hawk', 'ally-dove');
UPDATE congressional_stances SET stance = 'neutral' WHERE stance IN ('none', 'pro-regime', '');

-- 3. Add new constraint with only the 3 valid values
ALTER TABLE congressional_stances ADD CONSTRAINT congressional_stances_stance_check 
  CHECK (stance IN ('ally', 'neutral', 'normalizer'));

-- 4. Also update any overrides that reference old stance values
UPDATE congressional_stance_overrides SET override_stance = 'ally' WHERE override_stance IN ('ally-hawk', 'ally-dove');
UPDATE congressional_stance_overrides SET override_stance = 'neutral' WHERE override_stance IN ('none', 'pro-regime');
