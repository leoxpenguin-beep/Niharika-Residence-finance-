-- Fix missing WITH CHECK clauses for insert on rate tables
drop policy if exists "Allow full access to authenticated users" on material_rates;
create policy "Allow full access to authenticated users" on material_rates 
  for all 
  using (auth.role() = 'authenticated') 
  with check (auth.role() = 'authenticated');

drop policy if exists "Allow full access to authenticated users" on hardware_rates;
create policy "Allow full access to authenticated users" on hardware_rates 
  for all 
  using (auth.role() = 'authenticated') 
  with check (auth.role() = 'authenticated');

drop policy if exists "Allow full access to authenticated users" on accessory_rates;
create policy "Allow full access to authenticated users" on accessory_rates 
  for all 
  using (auth.role() = 'authenticated') 
  with check (auth.role() = 'authenticated');

drop policy if exists "Allow full access to authenticated users" on labour_rates;
create policy "Allow full access to authenticated users" on labour_rates 
  for all 
  using (auth.role() = 'authenticated') 
  with check (auth.role() = 'authenticated');

drop policy if exists "Allow full access to authenticated users" on vendor_rates;
create policy "Allow full access to authenticated users" on vendor_rates 
  for all 
  using (auth.role() = 'authenticated') 
  with check (auth.role() = 'authenticated');
