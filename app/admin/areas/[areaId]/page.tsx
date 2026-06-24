import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ArrowLeft } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AreaEditorPage({
  params,
}: {
  params: Promise<{ areaId: string }>;
}) {
  const { areaId } = await params;
  const supabase = await createClient();

  const { data: area } = await supabase
    .from("areas")
    .select("*, floors(id, name), units(id, unit_code, name, status, final_client_price)")
    .eq("id", areaId)
    .single();

  if (!area) notFound();

  async function updateArea(formData: FormData) {
    "use server";
    const supabase = await createClient();
    await supabase.from("areas").update({
      name: formData.get("name"),
      design_role: formData.get("design_role"),
      client_visible: formData.get("client_visible") === "true",
    }).eq("id", areaId);
    revalidatePath("/admin/areas");
    redirect("/admin/areas");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4 border-b border-border/50 pb-4">
        <Link href="/admin/areas" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-heading">Edit Area</h1>
          <p className="text-muted-foreground text-sm">{area.floors?.name} › {area.name}</p>
        </div>
      </div>

      <form action={updateArea} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Area Details</h2>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Area Name</label>
            <Input name="name" defaultValue={area.name} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Design Role <span className="text-xs text-muted-foreground">(shown to client)</span></label>
            <Input name="design_role" defaultValue={area.design_role} />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Client Visibility</label>
            <select name="client_visible" defaultValue={area.client_visible ? "true" : "false"}
              className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-taupe/40">
              <option value="true">Visible to Client</option>
              <option value="false">Hidden from Client</option>
            </select>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Units in this Area ({area.units?.length || 0})</h2>
          <div className="space-y-2">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {area.units?.map((unit: any) => (
              <div key={unit.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <span className="font-mono text-xs text-muted-foreground mr-2">{unit.unit_code}</span>
                  <span className="text-sm font-medium text-ink">{unit.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {Number(unit.final_client_price) > 0 ? `₹${Number(unit.final_client_price).toLocaleString("en-IN")}` : "Unpriced"}
                  </span>
                  <Link href={`/admin/units/${unit.id}`} className="text-xs text-taupe hover:underline">Edit →</Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex gap-3 pb-8">
          <Button type="submit" variant="primary">Save Changes</Button>
          <Link href="/admin/areas"><Button variant="outline" type="button">Cancel</Button></Link>
        </div>
      </form>
    </div>
  );
}
