-- ─── Unit Cost Sections ───────────────────────────────────────────────────────
-- Migration: 20260624000020_unit_cost_sections.sql
-- Admin-only table. Never exposed to client routes.
-- RLS: authenticated users only.

create table if not exists unit_cost_sections (
  id                uuid primary key default gen_random_uuid(),
  unit_id           uuid not null references units(id) on delete cascade,
  section_name      text not null default '',
  section_type      text not null default 'structure',
  -- e.g. 'structure','shutter','hardware','accessory','labour','installation','wastage_buffer'
  cost_basis        text not null default 'fixed',
  -- e.g. 'fixed','per_sqft','per_rft','per_number','per_unit'

  -- Dimension fields (for carpentry/box units)
  width_mm          numeric(10,2) default 0,
  height_mm         numeric(10,2) default 0,
  depth_mm          numeric(10,2) default 0,
  quantity          numeric(10,3) default 1,
  area_sqft         numeric(10,3) default 0,  -- auto or manual
  running_feet      numeric(10,3) default 0,  -- auto or manual

  -- Rate & cost
  unit_rate         numeric(12,2) default 0,
  material_cost     numeric(12,2) default 0,
  labour_cost       numeric(12,2) default 0,

  -- Percentages
  wastage_percentage  numeric(5,2) default 0,
  margin_percentage   numeric(5,2) default 0,

  -- Computed totals (stored for fast reads & audit trail)
  section_base_cost   numeric(12,2) generated always as (material_cost + labour_cost) stored,
  wastage_amount      numeric(12,2) default 0,
  internal_total      numeric(12,2) default 0,
  margin_amount       numeric(12,2) default 0,
  client_total        numeric(12,2) default 0,

  notes             text default '',
  sort_order        integer default 0,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Index for fast unit lookups
create index if not exists unit_cost_sections_unit_id_idx
  on unit_cost_sections(unit_id);

-- RLS: admin only (authenticated users)
alter table unit_cost_sections enable row level security;

drop policy if exists "Authenticated users can manage cost sections" on unit_cost_sections;
create policy "Authenticated users can manage cost sections"
  on unit_cost_sections
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- updated_at trigger
create or replace function update_unit_cost_sections_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists unit_cost_sections_updated_at on unit_cost_sections;
create trigger unit_cost_sections_updated_at
  before update on unit_cost_sections
  for each row execute function update_unit_cost_sections_updated_at();
