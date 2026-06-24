import { createClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";

export const dynamic = "force-dynamic";
export default async function FloorsManagerPage() {
  const supabase = await createClient();
  const { data: floors } = await supabase.from("floors").select("*").order("sequence");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-border/50 pb-4">
        <div>
          <h1 className="text-3xl font-heading text-foreground mb-1">Floors</h1>
          <p className="text-muted-foreground">Manage the top-level spatial hierarchy of the project.</p>
        </div>
        <Button variant="primary">Add Floor</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {floors?.map((floor) => (
          <Card key={floor.id} className="p-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">Seq {floor.sequence}</span>
                <h3 className="text-lg font-medium text-ink">{floor.name}</h3>
                {!floor.client_visible && (
                  <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">Hidden from Client</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{floor.emotional_label}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Link href={`/admin/floors/${floor.id}`}>
                <Button variant="outline">Edit</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
