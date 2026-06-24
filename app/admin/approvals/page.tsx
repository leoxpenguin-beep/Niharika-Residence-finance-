import { createClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
import { CheckCircle, MessageSquare, PauseCircle, Clock } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminApprovalsPage() {
  const supabase = await createClient();

  const { data: approvals } = await supabase
    .from("client_approvals")
    .select(`
      id, decision, client_name, note, created_at,
      units(id, unit_code, name, areas(name, floors(name)))
    `)
    .order("created_at", { ascending: false });

  const total = approvals?.length || 0;
  const approved = approvals?.filter(a => a.decision === "approved").length || 0;
  const discussed = approvals?.filter(a => a.decision === "discuss").length || 0;
  const held = approvals?.filter(a => a.decision === "hold").length || 0;

  const decisionConfig: Record<string, { icon: React.ElementType; label: string; color: string; bg: string }> = {
    approved: { icon: CheckCircle, label: "Approved", color: "text-status-approved", bg: "bg-status-approved/10" },
    discuss: { icon: MessageSquare, label: "Discussion", color: "text-status-pending", bg: "bg-status-pending/10" },
    hold: { icon: PauseCircle, label: "On Hold", color: "text-destructive", bg: "bg-destructive/10" },
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-border/50 pb-4">
        <h1 className="text-3xl font-heading text-foreground mb-1">Client Approvals</h1>
        <p className="text-muted-foreground">Track all decisions submitted by Niharika on the client portal.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-semibold text-ink">{total}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Decisions</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-semibold text-status-approved">{approved}</p>
          <p className="text-xs text-muted-foreground mt-1">Approved</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-semibold text-status-pending">{discussed}</p>
          <p className="text-xs text-muted-foreground mt-1">Needs Discussion</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-semibold text-destructive">{held}</p>
          <p className="text-xs text-muted-foreground mt-1">On Hold</p>
        </Card>
      </div>

      {/* Approval List */}
      <Card className="p-6">
        {total === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-ink mb-1">No decisions yet</p>
            <p className="text-sm">Once Niharika reviews units on the client portal, her decisions will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {approvals?.map((approval) => {
              const config = decisionConfig[approval.decision] || decisionConfig.hold;
              const Icon = config.icon;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const unit = Array.isArray(approval.units) ? approval.units[0] : approval.units as any;
              const area = Array.isArray(unit?.areas) ? unit?.areas[0] : unit?.areas;
              const floor = Array.isArray(area?.floors) ? area?.floors[0] : area?.floors;

              return (
                <div key={approval.id} className="flex items-start gap-4 p-4 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors">
                  <div className={`w-9 h-9 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <span className="font-medium text-ink">{unit?.name || "Unknown Unit"}</span>
                        <span className="text-xs font-mono text-muted-foreground ml-2">{unit?.unit_code}</span>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bg} ${config.color} whitespace-nowrap`}>
                        {config.label}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mb-1">
                      {floor?.name} › {area?.name}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>By <strong className="text-ink-soft">{approval.client_name}</strong></span>
                      <span>·</span>
                      <span>{new Date(approval.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>

                    {approval.note && (
                      <div className="mt-2 p-2.5 bg-muted/40 rounded-lg">
                        <p className="text-xs text-ink-soft italic">&quot;{approval.note}&quot;</p>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/admin/units/${unit?.id}`}
                    className="text-xs text-taupe hover:underline whitespace-nowrap flex-shrink-0"
                  >
                    View Unit →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
