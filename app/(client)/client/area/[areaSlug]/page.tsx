import { notFound } from "next/navigation";
import { getAreaBySlug } from "@/lib/supabase/queries";
import ClientShell from "@/components/layout/ClientShell";
import { UnitCard } from "@/components/boq/UnitCard";
import { PriceSummary } from "@/components/boq/PriceSummary";
import { areaTotal, areaUnitCount } from "@/lib/calculations/totals";
import Breadcrumb from "@/components/layout/Breadcrumb";
import EmptyState from "@/components/ui/EmptyState";

export default async function AreaPage({
  params,
}: {
  params: Promise<{ areaSlug: string }>;
}) {
  const { areaSlug } = await params;
  const result = await getAreaBySlug(areaSlug);
  if (!result) notFound();

  const { area, floor } = result;
  const total = areaTotal(area);
  const count = areaUnitCount(area);

  // Filter out removed units for the client view
  const visibleUnits = area.units.filter(u => u.status !== "removed");

  return (
    <ClientShell>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/client" },
          { label: floor.name, href: `/client/floor/${floor.slug}` },
          { label: area.name },
        ]}
      />

      <div className="py-6 border-b border-border/50 mb-6">
        <h1 className="text-3xl font-heading text-foreground mb-2">
          {area.name}
        </h1>
        <p className="text-muted-foreground mb-6">{area.design_role}</p>

        <div className="flex items-end justify-between bg-muted/20 p-4 rounded-lg">
          <PriceSummary price={total} label="Area Investment" large />
          <div className="text-sm text-muted-foreground">{count} Units</div>
        </div>
      </div>

      <div className="space-y-4 pb-12">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Scope Items
        </h2>
        {visibleUnits.length === 0 ? (
          <EmptyState
            title="No items currently in scope"
            description="Items may have been removed or are pending design."
          />
        ) : (
          visibleUnits.map((unit) => (
            <UnitCard key={unit.id} unit={unit} />
          ))
        )}
      </div>
    </ClientShell>
  );
}
