import type { ClientSafeUnit } from "@/lib/security/client-safe-selectors";
import type { ClientSafeArea, ClientSafeFloor, ClientSafeProject } from "@/lib/security/client-safe-selectors";

// ─── Unit-level totals ───────────────────────────────────────────────────────

/**
 * Returns the final client price for a single unit.
 * Returns 0 if no price is set.
 */
export function unitTotal(unit: ClientSafeUnit): number {
  return unit.final_client_price ?? 0;
}

// ─── Area-level totals ───────────────────────────────────────────────────────

/**
 * Sums final client prices for all visible units in an area.
 * Excludes removed units from the total.
 */
export function areaTotal(area: ClientSafeArea): number {
  return area.units
    .filter((u) => u.status !== "removed")
    .reduce((sum, u) => sum + (u.final_client_price ?? 0), 0);
}

/**
 * Returns count of published/visible units in an area.
 */
export function areaUnitCount(area: ClientSafeArea): number {
  return area.units.filter((u) => u.status !== "removed").length;
}

// ─── Floor-level totals ──────────────────────────────────────────────────────

/**
 * Sums area totals for all areas in a floor.
 */
export function floorTotal(floor: ClientSafeFloor): number {
  return floor.areas.reduce((sum, area) => sum + areaTotal(area), 0);
}

/**
 * Returns total unit count across all areas in a floor.
 */
export function floorUnitCount(floor: ClientSafeFloor): number {
  return floor.areas.reduce((sum, area) => sum + areaUnitCount(area), 0);
}

// ─── Project-level totals ────────────────────────────────────────────────────

/**
 * Sums all floor totals for the full project estimate.
 */
export function projectTotal(project: ClientSafeProject): number {
  return project.floors.reduce((sum, floor) => sum + floorTotal(floor), 0);
}

// ─── Approval-based totals ───────────────────────────────────────────────────

/**
 * Returns total value of units the client has approved.
 */
export function approvedTotal(units: ClientSafeUnit[]): number {
  return units
    .filter((u) => u.status === "client_approved")
    .reduce((sum, u) => sum + (u.final_client_price ?? 0), 0);
}

/**
 * Returns total value of units marked "Need Discussion".
 */
export function discussionTotal(units: ClientSafeUnit[]): number {
  return units
    .filter((u) => u.status === "need_discussion")
    .reduce((sum, u) => sum + (u.final_client_price ?? 0), 0);
}

/**
 * Returns total value of units on hold.
 */
export function holdTotal(units: ClientSafeUnit[]): number {
  return units
    .filter((u) => u.status === "hold")
    .reduce((sum, u) => sum + (u.final_client_price ?? 0), 0);
}

/**
 * Returns total value of units removed from scope.
 * These are excluded from the project total but tracked separately.
 */
export function removedTotal(units: ClientSafeUnit[]): number {
  return units
    .filter((u) => u.status === "removed")
    .reduce((sum, u) => sum + (u.final_client_price ?? 0), 0);
}

/**
 * Returns total value of published units with no client action yet.
 */
export function pendingTotal(units: ClientSafeUnit[]): number {
  return units
    .filter((u) => u.status === "published")
    .reduce((sum, u) => sum + (u.final_client_price ?? 0), 0);
}

// ─── Approval counts ─────────────────────────────────────────────────────────

export interface ApprovalSummary {
  approved: { count: number; value: number };
  discussion: { count: number; value: number };
  hold: { count: number; value: number };
  removed: { count: number; value: number };
  pending: { count: number; value: number };
  total_published_value: number;
}

/**
 * Returns a full approval summary from a flat list of client-safe units.
 * Used to power the summary cards on the client dashboard.
 */
export function buildApprovalSummary(units: ClientSafeUnit[]): ApprovalSummary {
  const published = units.filter((u) => u.status !== "removed");

  const approved    = published.filter((u) => u.status === "client_approved");
  const discussion  = published.filter((u) => u.status === "need_discussion");
  const hold        = published.filter((u) => u.status === "hold");
  const removed     = units.filter((u) => u.status === "removed");
  const pending     = published.filter((u) => u.status === "published");

  const sum = (list: ClientSafeUnit[]) =>
    list.reduce((s, u) => s + (u.final_client_price ?? 0), 0);

  return {
    approved:   { count: approved.length,   value: sum(approved) },
    discussion: { count: discussion.length, value: sum(discussion) },
    hold:       { count: hold.length,       value: sum(hold) },
    removed:    { count: removed.length,    value: sum(removed) },
    pending:    { count: pending.length,    value: sum(pending) },
    total_published_value: sum(published),
  };
}

// ─── Flatten helpers ─────────────────────────────────────────────────────────

/**
 * Flattens all units from a project into a single array.
 * Useful for computing project-wide approval summaries.
 */
export function flattenProjectUnits(project: ClientSafeProject): ClientSafeUnit[] {
  return project.floors.flatMap((f) => f.areas.flatMap((a) => a.units));
}

/**
 * Flattens all units from a floor.
 */
export function flattenFloorUnits(floor: ClientSafeFloor): ClientSafeUnit[] {
  return floor.areas.flatMap((a) => a.units);
}
