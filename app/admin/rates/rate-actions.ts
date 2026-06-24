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
