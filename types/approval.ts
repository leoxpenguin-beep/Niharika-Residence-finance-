// ─── Client Approval ────────────────────────────────────────────────────────

/**
 * The four actions a client can take on any published unit.
 * Labels are mapped in lib/formatters/status.ts
 */
export type ApprovalAction =
  | "approved"
  | "need_discussion"
  | "hold"
  | "remove";

/**
 * A single client approval event — immutable once created.
 * Full history is stored (not overwritten on re-approval).
 */
export interface ClientApproval {
  id: string;
  unit_id: string;
  client_action: ApprovalAction;
  client_note?: string;          // optional note from client
  client_name: string;           // collected via text input at first action
  created_at: string;
}

/**
 * The latest approval for a unit — used for display on client unit page.
 */
export interface LatestApproval {
  unit_id: string;
  client_action: ApprovalAction;
  client_note?: string;
  client_name: string;
  created_at: string;
}

// ─── Approval Totals ─────────────────────────────────────────────────────────

/**
 * Aggregated approval state for a project, floor, or area.
 */
export interface ApprovalTotals {
  approved_count: number;
  approved_value: number;
  discussion_count: number;
  discussion_value: number;
  hold_count: number;
  hold_value: number;
  removed_count: number;
  removed_value: number;
  pending_count: number;         // published but no action taken yet
  pending_value: number;
}
