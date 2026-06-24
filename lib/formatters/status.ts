import type { UnitStatus, CostConfidence } from "@/types/boq";
import type { ApprovalAction } from "@/types/approval";
import type { BadgeVariant } from "./status.types";

// ─── Unit Status → Client Label ──────────────────────────────────────────────

/**
 * Maps internal UnitStatus values to calm client-facing labels.
 * Per AGENTS.md: use "Need discussion" not "Rejected", etc.
 */
export const UNIT_STATUS_LABELS: Record<UnitStatus, string> = {
  draft:              "Draft",
  measurement_pending: "Measurement Pending",
  spec_pending:       "Specification Pending",
  design_approved:    "Design Approved",
  price_ready:        "Price Ready",
  published:          "Ready for Review",
  client_approved:    "Approved",
  need_discussion:    "Need Discussion",
  hold:               "On Hold",
  removed:            "Removed",
};

/**
 * Maps UnitStatus to the Badge variant for colour coding.
 */
export const UNIT_STATUS_BADGE: Record<UnitStatus, BadgeVariant> = {
  draft:              "draft",
  measurement_pending: "pending",
  spec_pending:       "pending",
  design_approved:    "sage",
  price_ready:        "sage",
  published:          "sage",
  client_approved:    "approved",
  need_discussion:    "discussion",
  hold:               "hold",
  removed:            "removed",
};

// ─── Cost Confidence → Client Label ─────────────────────────────────────────

/**
 * Maps internal CostConfidence values to calm client-facing labels.
 */
export const COST_CONFIDENCE_LABELS: Record<CostConfidence, string> = {
  concept_estimate:   "Concept Estimate",
  measurement_based:  "Measurement-Based",
  vendor_checked:     "Vendor Checked",
  final_locked:       "Final Locked",
};

export const COST_CONFIDENCE_BADGE: Record<CostConfidence, BadgeVariant> = {
  concept_estimate:   "taupe",
  measurement_based:  "pending",
  vendor_checked:     "sage",
  final_locked:       "approved",
};

// ─── Approval Action → Client Label ─────────────────────────────────────────

/**
 * Maps ApprovalAction to the label shown on approval buttons and history.
 */
export const APPROVAL_ACTION_LABELS: Record<ApprovalAction, string> = {
  approved:        "Approved",
  need_discussion: "Need Discussion",
  hold:            "On Hold",
  remove:          "Removed from Scope",
};

export const APPROVAL_ACTION_BADGE: Record<ApprovalAction, BadgeVariant> = {
  approved:        "approved",
  need_discussion: "discussion",
  hold:            "hold",
  remove:          "removed",
};

// ─── Helper functions ────────────────────────────────────────────────────────

export function getStatusLabel(status: UnitStatus): string {
  return UNIT_STATUS_LABELS[status] ?? status;
}

export function getStatusBadge(status: UnitStatus): BadgeVariant {
  return UNIT_STATUS_BADGE[status] ?? "default";
}

export function getConfidenceLabel(confidence: CostConfidence): string {
  return COST_CONFIDENCE_LABELS[confidence] ?? confidence;
}

export function getConfidenceBadge(confidence: CostConfidence): BadgeVariant {
  return COST_CONFIDENCE_BADGE[confidence] ?? "taupe";
}

export function getApprovalLabel(action: ApprovalAction): string {
  return APPROVAL_ACTION_LABELS[action] ?? action;
}

export function getApprovalBadge(action: ApprovalAction): BadgeVariant {
  return APPROVAL_ACTION_BADGE[action] ?? "default";
}
