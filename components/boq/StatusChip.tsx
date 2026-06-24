import Badge from "@/components/ui/Badge";
import { getStatusLabel, getStatusBadge } from "@/lib/formatters/status";
import type { UnitStatus } from "@/types/boq";

interface StatusChipProps {
  status: UnitStatus;
  className?: string;
}

export function StatusChip({ status, className }: StatusChipProps) {
  return (
    <Badge variant={getStatusBadge(status)} className={className}>
      {getStatusLabel(status)}
    </Badge>
  );
}
