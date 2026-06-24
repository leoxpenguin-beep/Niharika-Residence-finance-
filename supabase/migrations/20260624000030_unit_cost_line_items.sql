-- ─── Migration: 20260624000030_unit_cost_line_items ───────────────────────────
-- Upgrades the cost composer from section-level to full line-item BOQ.
-- ADMIN ONLY: unit_cost_sections and unit_cost_line_items are never exposed
-- to client routes. Client only ever receives final_client_price from units.

-- Step 1: Drop and recreate unit_cost_sections (simplified — no cost columns)
-- The old table had generated column section_base_cost which we no longer need.

DROP TABLE IF EXISTS unit_cost_line_items CASCADE;
DROP TABLE IF EXISTS unit_cost_sections CASCADE;

CREATE TABLE unit_cost_sections (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id     uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  section_name text NOT NULL DEFAULT '',
  section_type text NOT NULL DEFAULT 'structure',
  sort_order  integer NOT NULL DEFAULT 0,
  notes       text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX unit_cost_sections_unit_id_idx ON unit_cost_sections(unit_id);

-- Step 2: Create unit_cost_line_items
-- Each line item belongs to a section and stores full BOQ detail.

CREATE TABLE unit_cost_line_items (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id            uuid NOT NULL REFERENCES unit_cost_sections(id) ON DELETE CASCADE,
  unit_id               uuid NOT NULL REFERENCES units(id) ON DELETE CASCADE,

  -- Item identification
  item_name             text NOT NULL DEFAULT '',
  category              text NOT NULL DEFAULT 'miscellaneous',
  vendor_name           text NOT NULL DEFAULT '',
  brand_name            text NOT NULL DEFAULT '',
  specification         text NOT NULL DEFAULT '',

  -- Costing inputs
  cost_basis            text NOT NULL DEFAULT 'fixed',
  quantity              numeric(10,3) NOT NULL DEFAULT 1,
  unit_rate             numeric(12,2) NOT NULL DEFAULT 0,
  wastage_percentage    numeric(5,2)  NOT NULL DEFAULT 0,
  margin_percentage     numeric(5,2)  NOT NULL DEFAULT 25,

  -- Computed totals (stored for audit trail + fast reads)
  line_base_cost        numeric(12,2) NOT NULL DEFAULT 0,
  wastage_amount        numeric(12,2) NOT NULL DEFAULT 0,
  internal_total        numeric(12,2) NOT NULL DEFAULT 0,
  margin_amount         numeric(12,2) NOT NULL DEFAULT 0,
  client_total          numeric(12,2) NOT NULL DEFAULT 0,

  -- Client price inclusion
  include_in_client_price boolean NOT NULL DEFAULT true,

  notes                 text NOT NULL DEFAULT '',
  sort_order            integer NOT NULL DEFAULT 0,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX unit_cost_line_items_section_id_idx ON unit_cost_line_items(section_id);
CREATE INDEX unit_cost_line_items_unit_id_idx ON unit_cost_line_items(unit_id);

-- Step 3: Add new columns to units table if they don't exist

ALTER TABLE units ADD COLUMN IF NOT EXISTS manufacturing_mode text NOT NULL DEFAULT 'site_carpentry';
ALTER TABLE units ADD COLUMN IF NOT EXISTS chargeable_sqft     numeric(10,3) NOT NULL DEFAULT 0;
ALTER TABLE units ADD COLUMN IF NOT EXISTS margin_total        numeric(12,2) NOT NULL DEFAULT 0;
ALTER TABLE units ADD COLUMN IF NOT EXISTS internal_rate_per_sqft numeric(10,2) NOT NULL DEFAULT 0;
ALTER TABLE units ADD COLUMN IF NOT EXISTS client_rate_per_sqft   numeric(10,2) NOT NULL DEFAULT 0;

-- Step 4: RLS — authenticated only, no public access

ALTER TABLE unit_cost_sections   ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_cost_line_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_cost_sections"
  ON unit_cost_sections FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "admin_cost_line_items"
  ON unit_cost_line_items FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Step 5: updated_at triggers

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER unit_cost_sections_updated_at
  BEFORE UPDATE ON unit_cost_sections
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER unit_cost_line_items_updated_at
  BEFORE UPDATE ON unit_cost_line_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
