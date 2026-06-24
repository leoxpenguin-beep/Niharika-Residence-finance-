import Link from "next/link";
import Card from "@/components/ui/Card";
import { PriceSummary } from "./PriceSummary";
import type { ClientSafeArea } from "@/lib/security/client-safe-selectors";
import { areaTotal, areaUnitCount } from "@/lib/calculations/totals";
import { ArrowRight } from "lucide-react";

interface AreaCardProps {
  area: ClientSafeArea;
}

export function AreaCard({ area }: AreaCardProps) {
  const total = areaTotal(area);
  const count = areaUnitCount(area);

  return (
    <Link href={`/client/area/${area.slug}`} className="block">
      <Card className="hover:border-primary/50 transition-colors cursor-pointer p-5 group">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-xl font-heading text-foreground mb-1">
              {area.name}
            </h3>
            <p className="text-sm text-muted-foreground">{area.design_role}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <PriceSummary price={total} label="Area Investment" />
            <div className="text-sm text-muted-foreground">
              {count} Units
            </div>
          </div>

          <div className="pt-3 mt-1 border-t border-border/50 flex items-center justify-between text-sm font-medium text-primary group-hover:underline underline-offset-4">
            View Scope
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
