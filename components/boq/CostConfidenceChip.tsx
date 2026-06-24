import Badge from "@/components/ui/Badge";
import { getConfidenceLabel, getConfidenceBadge } from "@/lib/formatters/status";
import type { CostConfidence } from "@/types/boq";

interface CostConfidenceChipProps {
  confidence: CostConfidence;
  className?: string;
}

export function CostConfidenceChip({ confidence, className }: CostConfidenceChipProps) {
  return (
    <Badge variant={getConfidenceBadge(confidence)} className={className}>
      {getConfidenceLabel(confidence)}
    </Badge>
  );
}
