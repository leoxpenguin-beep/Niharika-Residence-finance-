import { createClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
import { Building2, User, Tag, Eye, Calendar, ExternalLink } from "lucide-react";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function ProjectDetailsPage() {
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .single();

  // Build the client URL from request headers (works in SSR)
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const clientUrl = `${protocol}://${host}/client`;

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No project found.
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    draft: "bg-muted text-muted-foreground",
    active: "bg-blue-100 text-blue-700",
    published: "bg-status-approved/10 text-status-approved",
    archived: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-border/50 pb-4">
        <h1 className="text-3xl font-heading text-foreground mb-1">Project Details</h1>
        <p className="text-muted-foreground">Core settings and metadata for the active project.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Identifiers</h2>
          <div className="space-y-4">
            <DetailRow icon={Tag} label="Project Code" value={project.project_code} />
            <DetailRow icon={Building2} label="Project Name" value={project.project_name} />
            <DetailRow icon={User} label="Client Name" value={project.client_name} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Client Facing</h2>
          <div className="space-y-4">
            <DetailRow icon={Eye} label="Concept Name" value={project.concept_name} />
            <DetailRow icon={Eye} label="Client Page Title" value={project.client_page_title} />
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mt-0.5">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status] || "bg-muted text-muted-foreground"}`}>
                  {project.status}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Client Page URL</h2>
        <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between gap-4">
          <code className="text-sm text-ink font-mono break-all">{clientUrl}</code>
          <a
            href="/client"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-taupe hover:text-taupe/80 underline underline-offset-2 whitespace-nowrap"
          >
            Open <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <p className="text-xs text-muted-foreground mt-2">This is the live link you share with {project.client_name}.</p>
      </Card>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mt-0.5">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}
