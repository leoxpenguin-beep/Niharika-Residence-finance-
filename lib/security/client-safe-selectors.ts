import type { Unit, UnitStatus } from "@/types/boq";
import type { LatestApproval } from "@/types/approval";

// ─── Client-Safe Unit ────────────────────────────────────────────────────────

/**
 * The ONLY unit shape that may be used on client-facing routes and components.
 *
 * This type structurally OMITS all internal cost fields using TypeScript's
 * Omit utility type. This makes it impossible to accidentally pass internal
 * costing data to a client component — the TypeScript compiler will reject it.
 *
 * Fields removed from client view:
 *   - internal_base_cost
 *   - internal_labour_cost
 *   - internal_accessory_cost
 *   - internal_total_cost
 *   - margin_type
 *   - margin_value
 *   - suggested_client_price
 *   - width_mm, height_mm, depth_mm (internal dimensions)
 *   - calculation_type (internal formula reference)
 */
export type ClientSafeUnit = Omit<
  Unit,
  | "internal_total_cost"
  | "margin_total"
  | "internal_rate_per_sqft"
  | "client_rate_per_sqft"
  | "suggested_client_price"
  | "manufacturing_mode"
  | "chargeable_sqft"
  | "calculation_type"
  | "costing_template"
  | "width_mm"
  | "height_mm"
  | "depth_mm"
  | "is_client_visible"
  | "updated_at"
>;

// ─── Client-Safe Unit with context ──────────────────────────────────────────

/**
 * ClientSafeUnit enriched with floor and area display context.
 * Used on floor, area, and unit detail client pages.
 */
export interface ClientSafeUnitWithContext extends ClientSafeUnit {
  area_name: string;
  area_slug: string;
  floor_name: string;
  floor_slug: string;
  floor_emotional_label: string;
  latest_approval?: LatestApproval;
}

// ─── Client-Safe Area ────────────────────────────────────────────────────────

/**
 * Area shape safe for client pages — no internal admin fields.
 */
export interface ClientSafeArea {
  id: string;
  floor_id: string;
  name: string;
  slug: string;
  sequence: number;
  design_role: string;
  description?: string;
  units: ClientSafeUnit[];
}

// ─── Client-Safe Floor ───────────────────────────────────────────────────────

/**
 * Floor shape safe for client pages.
 */
export interface ClientSafeFloor {
  id: string;
  project_id: string;
  name: string;
  slug: string;
  sequence: number;
  emotional_label: string;
  description?: string;
  areas: ClientSafeArea[];
}

// ─── Client-Safe Project ─────────────────────────────────────────────────────

/**
 * Project shape safe for client pages — no internal IDs or admin data.
 */
export interface ClientSafeProject {
  project_code: string;
  project_name: string;
  client_name: string;
  concept_name: string;
  client_page_title: string;
  status: string;
  floors: ClientSafeFloor[];
}

// ─── Selector function ───────────────────────────────────────────────────────

/**
 * Strips all internal cost fields from a full Unit record.
 * Use this in server components when transforming DB results for client pages.
 *
 * @example
 * const clientUnit = toClientSafeUnit(adminUnit);
 */
export function toClientSafeUnit(unit: Unit): ClientSafeUnit {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    internal_total_cost,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    margin_total,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    internal_rate_per_sqft,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    client_rate_per_sqft,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    suggested_client_price,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    manufacturing_mode,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    chargeable_sqft,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    calculation_type,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    costing_template,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    width_mm,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    height_mm,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    depth_mm,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    is_client_visible,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updated_at,
    ...clientSafe
  } = unit;

  return clientSafe;
}

// ─── Status visibility guard ─────────────────────────────────────────────────

/**
 * Returns true if a unit's status makes it eligible for client display.
 * Mirrors the WHERE clause in the client_visible_units DB view.
 */
export function isClientVisible(
  unit: Pick<Unit, "is_client_visible" | "status">
): boolean {
  const clientStatuses: UnitStatus[] = [
    "published",
    "client_approved",
    "need_discussion",
    "hold",
  ];
  return (
    unit.is_client_visible === true &&
    clientStatuses.includes(unit.status as UnitStatus)
  );
}

// ─── Cost confidence display guard ───────────────────────────────────────────

/**
 * Returns true if the unit has a final price ready to show to the client.
 */
export function hasFinalPrice(unit: Pick<Unit, "final_client_price">): boolean {
  return unit.final_client_price > 0;
}
