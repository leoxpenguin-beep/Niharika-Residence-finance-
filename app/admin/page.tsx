import { createClient } from "@/lib/supabase/server";
import { PriceSummary } from "@/components/boq/PriceSummary";
import Card from "@/components/ui/Card";
import { Layers, Grid, CheckSquare } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: floorCount },
    { count: areaCount },
    { count: unitCount },
    { data: units }
  ] = await Promise.all([
    supabase.from("floors").select("*", { count: "exact", head: true }),
    supabase.from("areas").select("*", { count: "exact", head: true }),
    supabase.from("units").select("*", { count: "exact", head: true }),
    supabase.from("units").select("internal_total_cost, final_client_price")
  ]);

  const totalInternal = units?.reduce((sum, u) => sum + Number(u.internal_total_cost || 0), 0) || 0;
  const totalClient = units?.reduce((sum, u) => sum + Number(u.final_client_price || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-border/50 pb-4">
        <div>
          <h1 className="text-3xl font-heading text-foreground mb-1">Dashboard</h1>
          <p className="text-muted-foreground">Overview of LEORA-P004 Niharika Residence</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-taupe/10 flex items-center justify-center text-taupe">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Hierarchy</p>
            <p className="font-medium text-lg">{floorCount} Floors, {areaCount} Areas</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center text-status-approved">
            <Grid className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Scope</p>
            <p className="font-medium text-lg">{unitCount} Units Managed</p>
          </div>
        </Card>

        <Card className="p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gold-warm/10 flex items-center justify-center text-gold-warm">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending Approvals</p>
            <p className="font-medium text-lg">0 Awaiting Review</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-muted/30 border border-border/50 p-6 rounded-2xl">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Financial Overview (Internal)</h3>
          <div className="space-y-4">
            <PriceSummary price={totalInternal} label="Total Internal Cost" />
            <PriceSummary price={totalClient} label="Total Client Price" large />
          </div>
        </div>

        <div className="bg-muted/30 border border-border/50 p-6 rounded-2xl">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link href="/admin/units" className="block p-3 bg-white border border-border/50 rounded-lg hover:border-taupe transition-colors">
              <span className="block font-medium">Manage Unit Matrix</span>
              <span className="text-sm text-muted-foreground">Edit internal costs, formulas, and margins</span>
            </Link>
            <Link href="/admin/publish" className="block p-3 bg-white border border-border/50 rounded-lg hover:border-taupe transition-colors">
              <span className="block font-medium">Publish to Client</span>
              <span className="text-sm text-muted-foreground">Push new revisions to the live client link</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
