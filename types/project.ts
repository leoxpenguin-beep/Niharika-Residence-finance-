// ─── Project ────────────────────────────────────────────────────────────────

export type ProjectStatus =
  | "draft"
  | "active"
  | "final"
  | "archived";

export interface Project {
  id: string;
  project_code: string;          // e.g. "LEORA-P004"
  project_name: string;          // e.g. "Niharika Residence"
  client_name: string;           // e.g. "Niharika"
  concept_name: string;          // e.g. "Soft Heritage Contemporary"
  client_page_title: string;     // e.g. "Niharika Residence — Scope & Investment Journey"
  status: ProjectStatus;
  currency: string;              // "INR"
  created_at: string;
  updated_at: string;
}

// ─── Floor ──────────────────────────────────────────────────────────────────

export interface Floor {
  id: string;
  project_id: string;
  name: string;                  // e.g. "Ground Floor"
  slug: string;                  // e.g. "ground-floor"
  sequence: number;              // 1, 2, 3
  emotional_label: string;       // e.g. "Arrival / Hospitality / Guest Comfort"
  description?: string;
  client_visible: boolean;
  created_at: string;
}

// ─── Area ───────────────────────────────────────────────────────────────────

export type AreaStatus = "draft" | "active" | "final";

export interface Area {
  id: string;
  floor_id: string;
  name: string;                  // e.g. "Foyer"
  slug: string;                  // e.g. "foyer"
  sequence: number;
  design_role: string;           // e.g. "Warm arrival and devotional calm"
  description?: string;
  status: AreaStatus;
  client_visible: boolean;
  created_at: string;
}
