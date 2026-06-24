import { createClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";

export const dynamic = "force-dynamic";
export default async function AreasManagerPage() {
  const supabase = await createClient();
  const { data: areas } = await supabase.from("areas").select("*, floors(name)").order("sequence");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-border/50 pb-4">
        <div>
          <h1 className="text-3xl font-heading text-foreground mb-1">Areas</h1>
          <p className="text-muted-foreground">Manage specific rooms and zones within each floor.</p>
        </div>
        <Button variant="primary">Add Area</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {areas?.map((area) => (
          <Card key={area.id} className="p-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">{area.floors?.name}</span>
                <span className="text-sm font-medium text-muted-foreground border border-border px-2 py-0.5 rounded">Seq {area.sequence}</span>
                <h3 className="text-lg font-medium text-ink">{area.name}</h3>
                {!area.client_visible && (
                  <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">Hidden</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link href={`/admin/areas/${area.id}`}>
                <Button variant="outline">Edit</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
