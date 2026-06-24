import React from "react";
import Card from "@/components/ui/Card";
import Accordion from "@/components/ui/Accordion";
import { StatusChip } from "./StatusChip";
import { CostConfidenceChip } from "./CostConfidenceChip";
import { PriceSummary } from "./PriceSummary";
import { InclusionsList } from "./InclusionsList";
import { MaterialDirectionBlock } from "./MaterialDirectionBlock";
import { UpgradeOption } from "./UpgradeOption";
import type { ClientSafeUnit } from "@/lib/security/client-safe-selectors";

interface UnitDetailProps {
  unit: ClientSafeUnit;
}

export function UnitDetail({ unit }: UnitDetailProps) {
  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header section */}
      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          <StatusChip status={unit.status as React.ComponentProps<typeof StatusChip>["status"]} />
          <CostConfidenceChip confidence={unit.cost_confidence as React.ComponentProps<typeof CostConfidenceChip>["confidence"]} />
        </div>
        <h1 className="text-3xl font-heading text-foreground mb-2">
          {unit.name}
        </h1>
        <p className="text-muted-foreground">{unit.short_description}</p>
      </div>

      {/* Main content card */}
      <Card className="p-5 flex flex-col gap-6">
        <div>
          <h3 className="text-sm font-medium text-foreground mb-1">Design Purpose</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {unit.design_purpose}
          </p>
        </div>

        <MaterialDirectionBlock direction={unit.material_direction} />

        <Accordion 
          items={[
            {
              id: "inclusions",
              title: "View Included Scope",
              content: <InclusionsList inclusions={unit.included_scope} />
            }
          ]} 
        />

        {unit.upgrade_label && unit.upgrade_price ? (
          <UpgradeOption
            label={unit.upgrade_label}
            price={unit.upgrade_price}
            description={unit.upgrade_description}
          />
        ) : null}
      </Card>
      
      {/* Price Summary */}
      <div className="flex items-center justify-between p-4 bg-muted/20 border border-border/50 rounded-lg">
        <PriceSummary price={unit.final_client_price} large />
      </div>
    </div>
  );
}
