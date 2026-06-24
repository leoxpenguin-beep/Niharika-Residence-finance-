import type { ManufacturingMode } from "./costing";

// ─── Unit Status ────────────────────────────────────────────────────────────

/**
 * Internal lifecycle status of a BOQ unit.
 * Maps to client-facing labels via lib/formatters/status.ts.
 */
export type UnitStatus =
  | "draft"
  | "measurement_pending"
  | "spec_pending"
  | "design_approved"
  | "price_ready"
  | "published"
  | "client_approved"
  | "need_discussion"
  | "hold"
  | "removed";

// ─── Cost Confidence ────────────────────────────────────────────────────────

/**
 * How confident LEORA is in the current price for this unit.
 * Maps to client-facing labels via lib/formatters/status.ts.
 */
export type CostConfidence =
  | "concept_estimate"
  | "measurement_based"
  | "vendor_checked"
  | "final_locked";

// ─── Calculation Type ────────────────────────────────────────────────────────

export type CalculationType =
  | "box_storage"      // wardrobes, shoe racks, cabinets
  | "paneling"         // TV panels, wall panels, bed back panels
  | "false_ceiling"    // gypsum, cove, profile light
  | "loose_furniture"  // sofa, dining table, chairs
  | "accessory_only"   // hooks, pull-outs, baskets
  | "manual_quote";    // vendor-supplied fixed price

// ─── Costing Template Type ───────────────────────────────────────────────────

export type CostingTemplateType =
  | "wardrobe"
  | "tv_unit"
  | "shoe_rack"
  | "kitchen_base"
  | "kitchen_wall"
  | "paneling"
  | "false_ceiling"
  | "loose_furniture"
  | "vendor_quote"
  | "custom";

// ─── Unit (full — admin view) ────────────────────────────────────────────────

/**
 * Full unit record including all internal cost fields.
 * ADMIN USE ONLY — must never be passed to client components.
 * Client pages must use ClientSafeUnit from lib/security/client-safe-selectors.ts
 */
export interface Unit {
  id: string;
  area_id: string;
  unit_code: string;             // e.g. "GF-FYR-SR-01"
  name: string;                  // e.g. "Shoe Rack with Shutters"
  short_description: string;
  design_purpose: string;        // why this is included
  included_scope: string;        // what is covered in the price
  material_direction: string;    // finish / brand direction for client
  width_mm?: number;
  height_mm?: number;
  depth_mm?: number;
  quantity: number;
  calculation_type: CalculationType;
  costing_template: CostingTemplateType;
  status: UnitStatus;
  cost_confidence: CostConfidence;

  manufacturing_mode: ManufacturingMode | string;
  chargeable_sqft: number;

  // ── Internal cost fields — NEVER on client routes ──────────────
  internal_total_cost: number;
  margin_total: number;
  internal_rate_per_sqft: number;
  client_rate_per_sqft: number;
  suggested_client_price: number;
  // ──────────────────────────────────────────────────────────────

  final_client_price: number;
  is_client_visible: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;

  // Optional upgrade
  upgrade_label?: string;
  upgrade_price?: number;
  upgrade_description?: string;
}

// ─── Unit Component ──────────────────────────────────────────────────────────

export type ComponentType =
  | "carcass"
  | "shutter"
  | "internal_finish"
  | "external_finish"
  | "edge_band"
  | "hardware"
  | "accessory"
  | "labour"
  | "electrical"
  | "installation";

/**
 * Per-component cost breakup for a unit.
 * ADMIN USE ONLY.
 */
export interface UnitComponent {
  id: string;
  unit_id: string;
  component_type: ComponentType;
  name: string;
  rate_source_type?: "material" | "hardware" | "accessory" | "labour" | "manual";
  rate_source_id?: string;
  quantity: number;
  unit_measure: string;          // "sqft", "running_ft", "nos", "set"
  formula_key?: string;
  calculated_cost: number;
  admin_notes?: string;
  created_at: string;
}

// ─── Unit Upgrade ────────────────────────────────────────────────────────────

/**
 * Optional upgrade offered to the client for a unit.
 * Only final upgrade price is client-visible — not internal cost.
 */
export interface UnitUpgrade {
  id: string;
  unit_id: string;
  label: string;                 // e.g. "Premium Hardware Upgrade"
  description: string;
  upgrade_client_price: number;  // only this field reaches client
  is_active: boolean;
}

// ─── Denormalised unit with floor/area context ───────────────────────────────

/**
 * Unit with floor and area names for display — admin list views.
 */
export interface UnitWithContext extends Unit {
  area_name: string;
  area_slug: string;
  floor_name: string;
  floor_slug: string;
  floor_emotional_label: string;
}
