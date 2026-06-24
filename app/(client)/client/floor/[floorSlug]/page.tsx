import { notFound } from "next/navigation";
import { getFloorBySlug } from "@/lib/supabase/queries";
import ClientShell from "@/components/layout/ClientShell";
import { AreaCard } from "@/components/boq/AreaCard";
import { PriceSummary } from "@/components/boq/PriceSummary";
import { floorTotal, floorUnitCount } from "@/lib/calculations/totals";
import Breadcrumb from "@/components/layout/Breadcrumb";

export default async function FloorPage({
  params,
}: {
  params: Promise<{ floorSlug: string }>;
}) {
  const { floorSlug } = await params;
  const floor = await getFloorBySlug(floorSlug);
  if (!floor) notFound();

  const total = floorTotal(floor);
  const units = floorUnitCount(floor);

  return (
    <ClientShell>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/client" },
          { label: floor.name },
        ]}
      />

      <div className="py-6 border-b border-border/50 mb-6">
        <h1 className="text-3xl font-heading text-foreground mb-2">
          {floor.name}
        </h1>
        <p className="text-muted-foreground mb-6">{floor.emotional_label}</p>

        <div className="flex items-end justify-between bg-muted/20 p-4 rounded-lg">
          <PriceSummary price={total} label="Floor Investment" large />
          <div className="text-sm text-muted-foreground">{units} Units</div>
        </div>
      </div>

      <div className="space-y-4 pb-12">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Areas
        </h2>
        {floor.areas.map((area) => (
          <AreaCard key={area.id} area={area} />
        ))}
      </div>
    </ClientShell>
  );
}
