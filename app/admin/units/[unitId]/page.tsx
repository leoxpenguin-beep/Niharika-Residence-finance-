import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import UnitEditorForm from "./UnitEditorForm";
import type { UnitCostSection, UnitCostLineItem } from "@/types/costing";

export const dynamic = "force-dynamic";

export default async function AdminUnitEditorPage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const { unitId } = await params;
  const supabase = await createClient();

  const [
    { data: unit }, 
    { data: sections },
    { data: lineItems },
    { data: materials },
    { data: hardwares },
    { data: accessories },
    { data: labours },
    { data: vendors }
  ] = await Promise.all([
    supabase
      .from("units")
      .select("*, areas(name, floors(name))")
      .eq("id", unitId)
      .single(),
    supabase
      .from("unit_cost_sections")
      .select("*")
      .eq("unit_id", unitId)
      .order("sort_order"),
    supabase
      .from("unit_cost_line_items")
      .select("*")
      .eq("unit_id", unitId)
      .order("sort_order"),
    supabase.from("material_rates").select("*").eq("is_active", true),
    supabase.from("hardware_rates").select("*").eq("is_active", true),
    supabase.from("accessory_rates").select("*").eq("is_active", true),
    supabase.from("labour_rates").select("*").eq("is_active", true),
    supabase.from("vendor_rates").select("*").eq("is_active", true),
  ]);

  if (!unit) notFound();

  return (
    <UnitEditorForm
      unit={unit}
      initialSections={(sections as UnitCostSection[]) ?? []}
      initialLineItems={(lineItems as UnitCostLineItem[]) ?? []}
      rateLibrary={{
        materials: materials || [],
        hardwares: hardwares || [],
        accessories: accessories || [],
        labours: labours || [],
        vendors: vendors || []
      }}
    />
  );
}
