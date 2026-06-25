"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function fetchRates(table: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select("*").order("category").order("item_name");
  if (error) {
    console.error(`Error fetching ${table}:`, error);
    return [];
  }
  return data;
}

export async function saveRate(table: string, payload: Record<string, unknown>) {
  const supabase = await createClient();
  
  if (payload.id) {
    const { id, ...updateData } = payload;
    const { error } = await supabase.from(table).update(updateData).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from(table).insert(payload);
    if (error) return { error: error.message };
  }
  
  revalidatePath("/admin/rates");
  return { success: true };
}

export async function deleteRate(table: string, id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) return { error: error.message };
  
  revalidatePath("/admin/rates");
  return { success: true };
}

export async function toggleRateActive(table: string, id: string, currentState: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from(table).update({ is_active: !currentState }).eq("id", id);
  if (error) return { error: error.message };
  
  revalidatePath("/admin/rates");
  return { success: true };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function bulkSaveRates(payloadByTable: Record<string, any[]>) {
  const supabase = await createClient();
  
  for (const [table, rows] of Object.entries(payloadByTable)) {
    if (rows.length === 0) continue;
    
    // Simple loop for updates/inserts
    for (const row of rows) {
      // Find existing
      const { data: existing } = await supabase.from(table).select("id").eq("item_name", row.item_name).maybeSingle();
      
      if (existing) {
        const { error } = await supabase.from(table).update(row).eq("id", existing.id);
        if (error) return { error: `Failed to update ${row.item_name} in ${table}: ${error.message}` };
      } else {
        const { error } = await supabase.from(table).insert(row);
        if (error) return { error: `Failed to insert ${row.item_name} into ${table}: ${error.message}` };
      }
    }
  }
  
  revalidatePath("/admin/rates");
  return { success: true };
}
