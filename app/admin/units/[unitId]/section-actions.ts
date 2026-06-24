"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { roundClientPrice } from "@/lib/formatters/currency";
import type { UnitCostLineItem, ClientCostSection } from "@/types/costing";

// ─── Calc helper ─────────────────────────────────────────────────────────────

function calcLineItem(item: Partial<UnitCostLineItem>) {
  const qty = Number(item.quantity ?? 1);
  const rate = Number(item.unit_rate ?? 0);
  const line_base_cost = qty * rate;
  
  const wastage_pct = Number(item.wastage_percentage ?? 0);
  const wastage_amount = line_base_cost * (wastage_pct / 100);
  
  const internal_total = line_base_cost + wastage_amount;
  
  const margin_pct = Number(item.margin_percentage ?? 0);
  const margin_amount = internal_total * (margin_pct / 100);
  
  const client_total = item.include_in_client_price ? (internal_total + margin_amount) : 0;
  
  return { line_base_cost, wastage_amount, internal_total, margin_amount, client_total };
}

// ─── Save full cost breakdown ────────────────────────────────────────────────


export interface CostBreakdownPayload {
  sections: ClientCostSection[];
  finalClientPriceOverride: number | null;
  manufacturingMode: string;
  costingTemplate: string;
  chargeableSqft: number;
}

export async function saveFullCostBreakdown(
  unitId: string,
  payload: CostBreakdownPayload
): Promise<{ error?: string }> {
  const supabase = await createClient();

  // 1. Delete all existing sections (cascades to line items)
  const { error: deleteError } = await supabase
    .from("unit_cost_sections")
    .delete()
    .eq("unit_id", unitId);

  if (deleteError) return { error: deleteError.message };

  let unit_internal_total = 0;
  let unit_margin_total = 0;
  let unit_suggested_client_price = 0;

  // 2. Insert sections and line items
  for (let i = 0; i < payload.sections.length; i++) {
    const sec = payload.sections[i];
    
    // Insert section
    const { data: newSection, error: secError } = await supabase
      .from("unit_cost_sections")
      .insert({
        unit_id: unitId,
        section_name: sec.section_name || "Unnamed Section",
        section_type: sec.section_type || "structure",
        sort_order: i,
        notes: sec.notes || "",
      })
      .select("id")
      .single();

    if (secError) return { error: secError.message };

    // Prepare line items
    if (sec.lineItems && sec.lineItems.length > 0) {
      const lineItemRows = sec.lineItems.map((li, liIndex) => {
        const computed = calcLineItem(li);
        
        unit_internal_total += computed.internal_total;
        unit_margin_total += computed.margin_amount;
        unit_suggested_client_price += computed.client_total;

        return {
          section_id: newSection.id,
          unit_id: unitId,
          item_name: li.item_name || "Unnamed Item",
          category: li.category || "miscellaneous",
          vendor_name: li.vendor_name || "",
          brand_name: li.brand_name || "",
          specification: li.specification || "",
          cost_basis: li.cost_basis || "fixed",
          quantity: Number(li.quantity ?? 1),
          unit_rate: Number(li.unit_rate ?? 0),
          wastage_percentage: Number(li.wastage_percentage ?? 0),
          margin_percentage: Number(li.margin_percentage ?? 25),
          rate_library_source_id: li.rate_library_source_id || null,
          rate_library_source_type: li.rate_library_source_type || null,
          line_base_cost: computed.line_base_cost,
          wastage_amount: computed.wastage_amount,
          internal_total: computed.internal_total,
          margin_amount: computed.margin_amount,
          client_total: computed.client_total,
          include_in_client_price: li.include_in_client_price ?? true,
          notes: li.notes || "",
          sort_order: liIndex,
        };
      });

      const { error: lineError } = await supabase
        .from("unit_cost_line_items")
        .insert(lineItemRows);

      if (lineError) return { error: lineError.message };
    }
  }

  // 3. Update unit totals
  const chargeable_sqft = Number(payload.chargeableSqft) || 1; // avoid div by 0
  
  const final_client_price =
    payload.finalClientPriceOverride !== null && payload.finalClientPriceOverride > 0
      ? payload.finalClientPriceOverride
      : roundClientPrice(unit_suggested_client_price);

  const internal_rate_per_sqft = unit_internal_total / chargeable_sqft;
  const client_rate_per_sqft = final_client_price / chargeable_sqft;

  const { error: unitError } = await supabase
    .from("units")
    .update({
      manufacturing_mode: payload.manufacturingMode || "site_carpentry",
      costing_template: payload.costingTemplate || "custom",
      chargeable_sqft: payload.chargeableSqft || 0,
      internal_total_cost: unit_internal_total,
      margin_total: unit_margin_total,
      suggested_client_price: unit_suggested_client_price,
      final_client_price,
      internal_rate_per_sqft,
      client_rate_per_sqft,
    })
    .eq("id", unitId);

  if (unitError) return { error: unitError.message };

  revalidatePath(`/admin/units/${unitId}`);
  revalidatePath("/admin/units");
  revalidatePath("/admin/costing");
  revalidatePath("/admin");

  return {};
}
