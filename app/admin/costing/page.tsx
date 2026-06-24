import { createClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { Calculator, AlertCircle, ChevronRight } from "lucide-react";
import { formatClientPrice } from "@/lib/formatters/currency";

export const dynamic = "force-dynamic";

export default async function CostingEnginePage() {
  const supabase = await createClient();
  const { data: units } = await supabase
    .from("units")
    .select(`
      id, unit_code, name, status, cost_confidence,
      internal_base_cost, margin_type, margin_value,
      internal_total_cost, final_client_price,
      areas(name, floors(name))
    `)
    .order("unit_code");

  const totalUnits = units?.length || 0;
  const priced = units?.filter(u => (u.final_client_price || 0) > 0).length || 0;
  const needsCosting = units?.filter(u => !u.final_client_price || u.final_client_price === 0) || [];

  const totalInternal = units?.reduce((s, u) => s + Number(u.internal_total_cost || 0), 0) || 0;
  const totalClient = units?.reduce((s, u) => s + Number(u.final_client_price || 0), 0) || 0;

  const confidenceColors: Record<string, string> = {
    high: "text-status-approved",
    medium: "text-status-pending",
    low: "text-destructive",
    concept_estimate: "text-muted-foreground",
    spec_pending: "text-muted-foreground",
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-border/50 pb-4">
        <h1 className="text-3xl font-heading text-foreground mb-1">Costing Engine</h1>
        <p className="text-muted-foreground">Review internal costs, margins, and client prices across all units.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-semibold text-ink">{totalUnits}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Units</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-semibold text-status-approved">{priced}</p>
          <p className="text-xs text-muted-foreground mt-1">Priced</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-semibold text-status-pending">{totalUnits - priced}</p>
          <p className="text-xs text-muted-foreground mt-1">Needs Pricing</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-semibold text-taupe">{formatClientPrice(totalClient)}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Client Price</p>
        </Card>
      </div>

      {/* Units Needing Costing */}
      {needsCosting.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-status-pending" />
            <h2 className="font-medium text-ink">Units Awaiting Pricing ({needsCosting.length})</h2>
          </div>
          <div className="space-y-2">
            {needsCosting.slice(0, 10).map(unit => (
              <Link
                key={unit.id}
                href={`/admin/units/${unit.id}`}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-32">{unit.unit_code}</span>
                  <span className="text-sm font-medium text-ink">{unit.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs ${confidenceColors[unit.cost_confidence] || "text-muted-foreground"}`}>
                    {unit.cost_confidence?.replace("_", " ")}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
            {needsCosting.length > 10 && (
              <p className="text-sm text-muted-foreground text-center pt-2">+ {needsCosting.length - 10} more units</p>
            )}
          </div>
        </Card>
      )}

      {/* Full Units Table */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-4 h-4 text-taupe" />
          <h2 className="font-medium text-ink">All Units — Cost Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Code</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Name</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Area</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground">Internal</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground">Client Price</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Margin</th>
                <th className="py-2 px-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {units?.map(unit => (
                <tr key={unit.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-xs text-muted-foreground">{unit.unit_code}</td>
                  <td className="py-2.5 px-3 font-medium text-ink">{unit.name}</td>
                  <td className="py-2.5 px-3 text-muted-foreground hidden md:table-cell">
                    {/* @ts-expect-error - areas is technically populated via relation but types don't reflect it perfectly */}
                    {unit.areas?.name}
                  </td>
                  <td className="py-2.5 px-3 text-right text-muted-foreground">
                    {Number(unit.internal_total_cost) > 0 ? formatClientPrice(unit.internal_total_cost) : "—"}
                  </td>
                  <td className={`py-2.5 px-3 text-right font-medium ${Number(unit.final_client_price) > 0 ? "text-status-approved" : "text-destructive"}`}>
                    {Number(unit.final_client_price) > 0 ? formatClientPrice(unit.final_client_price) : "Unpriced"}
                  </td>
                  <td className="py-2.5 px-3 text-right text-muted-foreground hidden md:table-cell">
                    {unit.margin_value ? `${unit.margin_value}%` : "—"}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <Link href={`/admin/units/${unit.id}`} className="text-xs text-taupe hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-border/50 bg-muted/20">
                <td colSpan={3} className="py-3 px-3 text-xs font-medium text-muted-foreground">Totals</td>
                <td className="py-3 px-3 text-right text-sm font-semibold text-ink">{formatClientPrice(totalInternal)}</td>
                <td className="py-3 px-3 text-right text-sm font-semibold text-taupe">{formatClientPrice(totalClient)}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
}
