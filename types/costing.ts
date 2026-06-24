// ─── Rate Library Types ──────────────────────────────────────────────────────
// All rate types are ADMIN ONLY.
// These types must never be imported into client components or client pages.

export type UnitMeasure =
  | "sqft"
  | "running_ft"
  | "nos"
  | "set"
  | "kg"
  | "lump_sum";

// ─── Material Rate ───────────────────────────────────────────────────────────

export interface MaterialRate {
  id: string;
  item_name: string;
  category?: string;
  brand_name?: string;
  vendor_name?: string;
  specification?: string;
  thickness_mm?: string;
  cost_basis: CostBasis;
  unit_rate: number;
  default_wastage_percentage: number;
  default_margin_percentage: number;
  notes?: string;
  is_active: boolean;
  created_at: string;
}

// ─── Hardware Rate ───────────────────────────────────────────────────────────

export interface HardwareRate {
  id: string;
  item_name: string;
  category?: string;
  brand_name?: string;
  vendor_name?: string;
  specification?: string;
  cost_basis: CostBasis;
  unit_rate: number;
  default_margin_percentage: number;
  notes?: string;
  is_active: boolean;
  created_at: string;
}

// ─── Accessory Rate ──────────────────────────────────────────────────────────

export interface AccessoryRate {
  id: string;
  item_name: string;
  category?: string;
  brand_name?: string;
  vendor_name?: string;
  specification?: string;
  cost_basis: CostBasis;
  unit_rate: number;
  default_margin_percentage: number;
  notes?: string;
  is_active: boolean;
  created_at: string;
}

// ─── Labour Rate ─────────────────────────────────────────────────────────────

export interface LabourRate {
  id: string;
  item_name: string;
  category?: string;
  cost_basis: CostBasis;
  unit_rate: number;
  default_margin_percentage: number;
  notes?: string;
  is_active: boolean;
  created_at: string;
}

// ─── Vendor / Factory Rate ───────────────────────────────────────────────────

export interface VendorRate {
  id: string;
  item_name: string;
  category?: string;
  vendor_name?: string;
  specification?: string;
  cost_basis: CostBasis;
  unit_rate: number;
  default_margin_percentage: number;
  notes?: string;
  is_active: boolean;
  created_at: string;
}

// ─── Margin Rule ─────────────────────────────────────────────────────────────

export type MarginRuleType = "percentage" | "fixed";

/**
 * Margin rule — admin only. NEVER on client routes.
 */
export interface MarginRule {
  id: string;
  rule_name: string;             // e.g. "Standard margin", "Furniture margin"
  applicable_to?: string;        // scope type or "global"
  margin_type: MarginRuleType;
  margin_value: number;
  active: boolean;
  created_at: string;
}

// ─── Unit Cost Section & Line Items ───────────────────────────────────────────
// ADMIN ONLY — must never be imported into client pages or client components.

export type CostBasis =
  | "fixed"
  | "per_sqft"
  | "per_rft"
  | "per_number"
  | "per_set"
  | "per_unit"
  | "vendor_quote";

export type SectionType =
  | "structure"
  | "shutter"
  | "hardware"
  | "accessory"
  | "labour"
  | "installation"
  | "wastage_buffer";

export type LineItemCategory =
  | "board_material"
  | "surface_finish"
  | "shutter_material"
  | "shutter_finish_vendor"
  | "hardware"
  | "accessory"
  | "carpenter_labour"
  | "vendor_supply"
  | "installation_labour"
  | "transport"
  | "wastage"
  | "miscellaneous";

export type ManufacturingMode = "site_carpentry" | "factory_modular" | "hybrid";

/**
 * A grouping section within a BOQ unit.
 */
export interface UnitCostSection {
  id: string;
  unit_id: string;
  section_name: string;
  section_type: SectionType;
  sort_order: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type NewUnitCostSection = Omit<UnitCostSection, "id" | "created_at" | "updated_at">;

export interface ClientCostSection extends NewUnitCostSection {
  lineItems: NewUnitCostLineItem[];
}

/**
 * A detailed line item inside a cost section.
 */
export interface UnitCostLineItem {
  id: string;
  section_id: string;
  unit_id: string;

  // Item identification
  item_name: string;
  category: LineItemCategory;
  vendor_name: string;
  brand_name: string;
  specification: string;

  // Costing inputs
  cost_basis: CostBasis;
  quantity: number;
  unit_rate: number;
  wastage_percentage: number;
  margin_percentage: number;

  rate_library_source_id?: string;
  rate_library_source_type?: string;

  // Computed
  line_base_cost: number;
  wastage_amount: number;
  internal_total: number;
  margin_amount: number;
  client_total: number;

  include_in_client_price: boolean;

  notes: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type NewUnitCostLineItem = Omit<UnitCostLineItem, "id" | "created_at" | "updated_at">;
