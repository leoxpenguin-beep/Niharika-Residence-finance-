// ─── Admin types ─────────────────────────────────────────────────────────────

// ─── BOQ Version ─────────────────────────────────────────────────────────────

export type BOQVersionStatus =
  | "draft"
  | "internal_review"
  | "client_published"
  | "client_approved_snapshot"
  | "final_locked";

export interface BOQVersion {
  id: string;
  project_id: string;
  version_name: string;          // e.g. "Version 1 — June 2026"
  version_number: number;
  status: BOQVersionStatus;
  created_by: string;
  notes?: string;
  created_at: string;
}

export interface BOQVersionItem {
  id: string;
  version_id: string;
  unit_id: string;
  unit_code: string;
  name: string;
  floor_name: string;
  area_name: string;
  final_client_price: number;
  status: string;
  snapshot_at: string;
}

// ─── Admin Note ──────────────────────────────────────────────────────────────

export type AdminNoteCategory =
  | "measurement"
  | "material"
  | "client_discussion"
  | "vendor_quote"
  | "design_change"
  | "execution_risk"
  | "general";

export interface AdminNote {
  id: string;
  unit_id: string;
  category: AdminNoteCategory;
  note: string;
  created_by: string;
  created_at: string;
}

// ─── Admin Dashboard Summary ─────────────────────────────────────────────────

export interface AdminProjectSummary {
  total_units: number;
  published_units: number;
  draft_units: number;
  missing_price: number;         // units with final_client_price = 0
  missing_measurement: number;   // units with status = measurement_pending
  missing_spec: number;          // units with status = spec_pending
  total_internal_cost: number;
  total_client_value: number;
  client_approved_value: number;
  need_discussion_count: number;
  hold_count: number;
  removed_count: number;
}

// ─── Publish Validation ───────────────────────────────────────────────────────

export interface PublishValidationResult {
  unit_id: string;
  unit_code: string;
  unit_name: string;
  is_valid: boolean;
  issues: string[];              // e.g. ["Missing final price", "Missing inclusions"]
}
