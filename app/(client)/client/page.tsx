import { fetchClientProjectData } from "@/lib/supabase/queries";
import { buildApprovalSummary } from "@/lib/calculations/totals";
import { ProjectSummary } from "@/components/boq/ProjectSummary";
import { FloorCard } from "@/components/boq/FloorCard";
import Badge from "@/components/ui/Badge";
import ClientShell from "@/components/layout/ClientShell";
import { notFound } from "next/navigation";

export default async function ClientDashboardPage() {
  const project = await fetchClientProjectData();
  if (!project) notFound();

  const allUnits = project.floors.flatMap(f => f.areas.flatMap(a => a.units));
  const summary = buildApprovalSummary(allUnits);

  return (
    <ClientShell>
      {/* Hero Section */}
      <div className="py-8">
        <Badge variant="taupe" className="mb-4">
          Investment & Scope
        </Badge>
        <h1 className="text-4xl font-heading text-foreground mb-2">
          {project.project_name}
        </h1>
        <p className="text-muted-foreground text-lg">
          {project.concept_name}
        </p>
      </div>

      {/* Summary Cards */}
      <ProjectSummary summary={summary} />

      {/* Progress Bar */}
      <div className="mb-8 p-4 bg-muted/20 border border-border/50 rounded-lg">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Review Progress</span>
          <span className="font-medium">
            {summary.approved.count} / {allUnits.length} Units
          </span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-approved" 
            style={{ width: `${(summary.approved.count / allUnits.length) * 100}%` }}
          />
          <div 
            className="h-full bg-discussion" 
            style={{ width: `${(summary.discussion.count / allUnits.length) * 100}%` }}
          />
          <div 
            className="h-full bg-hold" 
            style={{ width: `${(summary.hold.count / allUnits.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Floors List */}
      <div className="space-y-4 pb-12">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Browse by Floor
        </h2>
        {project.floors.map((floor) => (
          <FloorCard key={floor.id} floor={floor} />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground text-center pb-8 opacity-70">
        Prices are estimates and subject to final measurement and material selection.
      </div>
    </ClientShell>
  );
}
