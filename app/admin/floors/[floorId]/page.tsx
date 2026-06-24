import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ArrowLeft } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FloorEditorPage({
  params,
}: {
  params: Promise<{ floorId: string }>;
}) {
  const { floorId } = await params;
  const supabase = await createClient();

  const { data: floor } = await supabase
    .from("floors")
    .select("*, areas(id, name, slug, sequence, client_visible)")
    .eq("id", floorId)
    .single();

  if (!floor) notFound();

  async function updateFloor(formData: FormData) {
    "use server";
    const supabase = await createClient();
    await supabase.from("floors").update({
      name: formData.get("name"),
      emotional_label: formData.get("emotional_label"),
      client_visible: formData.get("client_visible") === "true",
    }).eq("id", floorId);
    revalidatePath("/admin/floors");
    redirect("/admin/floors");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4 border-b border-border/50 pb-4">
        <Link href="/admin/floors" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-heading">Edit Floor</h1>
          <p className="text-muted-foreground text-sm">{floor.name}</p>
        </div>
      </div>

      <form action={updateFloor} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Floor Details</h2>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Floor Name</label>
            <Input name="name" defaultValue={floor.name} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Emotional Label <span className="text-xs text-muted-foreground">(shown to client)</span></label>
            <Input name="emotional_label" defaultValue={floor.emotional_label} />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Client Visibility</label>
            <select name="client_visible" defaultValue={floor.client_visible ? "true" : "false"}
              className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-taupe/40">
              <option value="true">Visible to Client</option>
              <option value="false">Hidden from Client</option>
            </select>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Areas on this Floor ({floor.areas?.length || 0})</h2>
          <div className="space-y-2">
            {floor.areas?.map((area: { id: string; name: string; slug: string; sequence: number; client_visible: boolean }) => (
              <div key={area.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm font-medium text-ink">{area.name}</span>
                <Link href={`/admin/areas/${area.id}`} className="text-xs text-taupe hover:underline">Edit →</Link>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex gap-3 pb-8">
          <Button type="submit" variant="primary">Save Changes</Button>
          <Link href="/admin/floors"><Button variant="outline" type="button">Cancel</Button></Link>
        </div>
      </form>
    </div>
  );
}
