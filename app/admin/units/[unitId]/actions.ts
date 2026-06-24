"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Updates the client-facing info and status fields of a unit.
 * Does NOT touch costing fields — those are managed by CostComposer / section-actions.ts.
 */
export async function updateUnit(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const short_description = formData.get("short_description") as string;
  const design_purpose = formData.get("design_purpose") as string;
  const material_direction = formData.get("material_direction") as string;
  const status = formData.get("status") as string;
  const cost_confidence = formData.get("cost_confidence") as string;
  const is_client_visible = formData.get("is_client_visible") === "true";

  const { error } = await supabase
    .from("units")
    .update({
      name,
      short_description,
      design_purpose,
      material_direction,
      status,
      cost_confidence,
      is_client_visible,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/units");
  revalidatePath("/admin/costing");
  revalidatePath("/admin");
  redirect("/admin/units");
}
