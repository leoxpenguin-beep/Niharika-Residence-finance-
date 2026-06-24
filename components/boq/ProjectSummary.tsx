import Card from "@/components/ui/Card";
import { formatINRCompact } from "@/lib/formatters/currency";
import type { ApprovalSummary } from "@/lib/calculations/totals";

interface ProjectSummaryProps {
  summary: ApprovalSummary;
}

export function ProjectSummary({ summary }: ProjectSummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <Card className="p-4 bg-muted/20 border-border/50">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          Total Scope
        </div>
        <div className="text-lg font-medium text-foreground">
          {formatINRCompact(summary.total_published_value)}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {summary.approved.count + summary.discussion.count + summary.hold.count + summary.pending.count} Units
        </div>
      </Card>

      <Card className="p-4 bg-approved/10 border-approved/20">
        <div className="text-xs text-approved-foreground uppercase tracking-wider mb-1">
          Approved
        </div>
        <div className="text-lg font-medium text-approved-foreground">
          {formatINRCompact(summary.approved.value)}
        </div>
        <div className="text-xs text-approved-foreground/70 mt-1">
          {summary.approved.count} Units
        </div>
      </Card>

      <Card className="p-4 bg-discussion/10 border-discussion/20">
        <div className="text-xs text-discussion-foreground uppercase tracking-wider mb-1">
          Discussion
        </div>
        <div className="text-lg font-medium text-discussion-foreground">
          {formatINRCompact(summary.discussion.value)}
        </div>
        <div className="text-xs text-discussion-foreground/70 mt-1">
          {summary.discussion.count} Units
        </div>
      </Card>

      <Card className="p-4 bg-hold/10 border-hold/20">
        <div className="text-xs text-hold-foreground uppercase tracking-wider mb-1">
          On Hold
        </div>
        <div className="text-lg font-medium text-hold-foreground">
          {formatINRCompact(summary.hold.value)}
        </div>
        <div className="text-xs text-hold-foreground/70 mt-1">
          {summary.hold.count} Units
        </div>
      </Card>
    </div>
  );
}
