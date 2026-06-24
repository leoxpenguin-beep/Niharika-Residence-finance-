import { notFound } from "next/navigation";
import { getUnitById } from "@/lib/supabase/queries";
import ClientShell from "@/components/layout/ClientShell";
import { UnitDetail } from "@/components/boq/UnitDetail";
import { ApprovalActions } from "@/components/boq/ApprovalActions";
import Breadcrumb from "@/components/layout/Breadcrumb";

export default async function UnitPage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const { unitId } = await params;
  const result = await getUnitById(unitId);
  if (!result) notFound();

  const { unit, area, floor } = result;

  // Do not display removed units directly if somehow accessed
  if (unit.status === "removed") {
    return (
      <ClientShell>
        <div className="py-12 text-center text-muted-foreground">
          This unit has been removed from the scope.
        </div>
      </ClientShell>
    );
  }

  return (
    <ClientShell>
      <Breadcrumb
        items={[
          { label: floor.name, href: `/client/floor/${floor.slug}` },
          { label: area.name, href: `/client/area/${area.slug}` },
          { label: unit.unit_code },
        ]}
      />

      <div className="py-4">
        <UnitDetail unit={unit} />

        {/* Only show approval actions if it hasn't been finally locked/approved */}
        {unit.status !== "client_approved" && (
          <div className="mt-4 pt-6 border-t border-border/50">
            <h3 className="text-lg font-medium mb-2">Make a Decision</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Please review the scope and price above and confirm if we should proceed.
            </p>
            <ApprovalActions unit={unit} />
          </div>
        )}
      </div>
    </ClientShell>
  );
}
