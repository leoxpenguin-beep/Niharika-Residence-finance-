import Link from "next/link";
import Card from "@/components/ui/Card";
import { PriceSummary } from "./PriceSummary";
import type { ClientSafeFloor } from "@/lib/security/client-safe-selectors";
import { floorTotal, floorUnitCount } from "@/lib/calculations/totals";
import { ChevronRight } from "lucide-react";

interface FloorCardProps {
  floor: ClientSafeFloor;
}

export function FloorCard({ floor }: FloorCardProps) {
  const total = floorTotal(floor);
  const units = floorUnitCount(floor);

  return (
    <Link href={`/client/floor/${floor.slug}`} className="block">
      <Card className="hover:border-primary/50 transition-colors cursor-pointer p-5 group">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-heading text-foreground mb-1">
                {floor.name}
              </h3>
              <p className="text-sm text-muted-foreground">{floor.emotional_label}</p>
            </div>
            <div className="bg-muted text-muted-foreground w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex items-end justify-between pt-2 border-t border-border/50">
            <PriceSummary price={total} label="Estimated Investment" />
            <div className="text-sm text-muted-foreground">
              {floor.areas.length} Areas • {units} Units
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
