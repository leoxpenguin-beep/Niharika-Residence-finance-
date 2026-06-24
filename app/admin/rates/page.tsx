import { createClient } from "@/lib/supabase/server";
import RateLibraryManager from "./RateLibraryManager";

export const dynamic = "force-dynamic";

export default async function RateLibraryPage() {
  const supabase = await createClient();

  const [
    { data: materials },
    { data: hardwares },
    { data: accessories },
    { data: labours },
    { data: vendors }
  ] = await Promise.all([
    supabase.from("material_rates").select("*").order("category").order("item_name"),
    supabase.from("hardware_rates").select("*").order("category").order("item_name"),
    supabase.from("accessory_rates").select("*").order("category").order("item_name"),
    supabase.from("labour_rates").select("*").order("category").order("item_name"),
    supabase.from("vendor_rates").select("*").order("category").order("item_name"),
  ]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-border/50 pb-4">
        <h1 className="text-3xl font-heading text-foreground mb-1">Rate Library</h1>
        <p className="text-muted-foreground">Manage master rates for materials, hardware, accessories, labour, and vendors used in BOQ costing calculations.</p>
      </div>

      <RateLibraryManager 
        materials={materials || []}
        hardwares={hardwares || []}
        accessories={accessories || []}
        labours={labours || []}
        vendors={vendors || []}
      />
    </div>
  );
}
