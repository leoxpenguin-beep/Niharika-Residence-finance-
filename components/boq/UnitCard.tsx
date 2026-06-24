import React from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { PriceSummary } from "./PriceSummary";
import { StatusChip } from "./StatusChip";
import { CostConfidenceChip } from "./CostConfidenceChip";
import type { ClientSafeUnit } from "@/lib/security/client-safe-selectors";

interface UnitCardProps {
  unit: ClientSafeUnit;
}

export function UnitCard({ unit }: UnitCardProps) {
  return (
    <Link href={`/client/unit/${unit.id}`} className="block">
      <Card className="hover:border-primary/50 transition-colors cursor-pointer p-4 group flex flex-col gap-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-1 font-mono">{unit.unit_code}</span>
            <h4 className="font-medium text-foreground">{unit.name}</h4>
          </div>
          <StatusChip status={unit.status as React.ComponentProps<typeof StatusChip>["status"]} />
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {unit.short_description}
        </p>

        <div className="flex items-end justify-between mt-2 pt-3 border-t border-border/50">
          <PriceSummary price={unit.final_client_price} label="Price" />
          <CostConfidenceChip confidence={unit.cost_confidence as React.ComponentProps<typeof CostConfidenceChip>["confidence"]} />
        </div>
      </Card>
    </Link>
  );
}
