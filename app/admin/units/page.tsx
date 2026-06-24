import { createClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";


export const dynamic = "force-dynamic";
export default async function UnitsManagerPage() {
  const supabase = await createClient();
  const { data: units } = await supabase
    .from("units")
    .select("*, areas(name, floors(name))")
    .order("unit_code");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-border/50 pb-4">
        <div>
          <h1 className="text-3xl font-heading text-foreground mb-1">Units Matrix</h1>
          <p className="text-muted-foreground">Manage all BOQ units, margins, status, and internal pricing.</p>
        </div>
        <Button variant="primary">Add Unit</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {units?.map((unit) => (
          <Card key={unit.id} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">{unit.unit_code}</span>
                  <h3 className="text-lg font-medium text-ink">{unit.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    unit.status === 'published' ? 'bg-status-approved/10 text-status-approved' :
                    unit.status === 'client_approved' ? 'bg-status-approved/20 text-status-approved font-medium' :
                    unit.status === 'draft' ? 'bg-taupe/10 text-taupe' :
                    'bg-status-pending/10 text-status-pending'
                  }`}>
                    {unit.status.replace('_', ' ').toUpperCase()}
                  </span>
                  {!unit.is_client_visible && (
                    <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">Hidden</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {unit.areas?.floors?.name} • {unit.areas?.name}
                </p>
                <div className="flex items-center gap-6 mt-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Internal Cost</p>
                    <p className="font-medium text-ink-soft">₹{(unit.internal_total_cost || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Client Price</p>
                    <p className="font-medium text-gold-warm">₹{(unit.final_client_price || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Margin</p>
                    <p className="font-medium text-sage">{unit.margin_value}{unit.margin_type === 'percentage' ? '%' : ' INR'}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Link href={`/admin/units/${unit.id}`}>
                  <Button variant="outline" className="w-full">Open Editor</Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
