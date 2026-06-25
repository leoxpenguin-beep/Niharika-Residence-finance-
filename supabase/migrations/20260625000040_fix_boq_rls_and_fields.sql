-- Add missing fields for BOQ matrix to units
ALTER TABLE units 
  ADD COLUMN IF NOT EXISTS manufacturing_mode text DEFAULT 'site_carpentry',
  ADD COLUMN IF NOT EXISTS chargeable_sqft numeric;

-- Fix missing WITH CHECK clauses for insert on BOQ tables
drop policy if exists "Allow full access to authenticated users" on units;
create policy "Allow full access to authenticated users" on units 
  for all 
  using (auth.role() = 'authenticated') 
  with check (auth.role() = 'authenticated');

drop policy if exists "Allow full access to authenticated users" on unit_cost_sections;
create policy "Allow full access to authenticated users" on unit_cost_sections 
  for all 
  using (auth.role() = 'authenticated') 
  with check (auth.role() = 'authenticated');

drop policy if exists "Allow full access to authenticated users" on unit_cost_line_items;
create policy "Allow full access to authenticated users" on unit_cost_line_items 
  for all 
  using (auth.role() = 'authenticated') 
  with check (auth.role() = 'authenticated');
