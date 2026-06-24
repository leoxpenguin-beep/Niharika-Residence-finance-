import { createClient } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { CheckCircle2, AlertCircle, Eye, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export default async function PublishWorkflowPage() {
  const supabase = await createClient();
  const { data: units } = await supabase.from("units").select("id, unit_code, name, status, final_client_price, is_client_visible");


  const missingPrices = units?.filter(u => !u.final_client_price || u.final_client_price <= 0) || [];
  const draftUnits = units?.filter(u => u.status === 'draft') || [];
  const hiddenUnits = units?.filter(u => !u.is_client_visible) || [];

  const isReadyToPublish = missingPrices.length === 0 && draftUnits.length === 0;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-border/50 pb-4">
        <h1 className="text-3xl font-heading text-foreground mb-1">Publish to Client</h1>
        <p className="text-muted-foreground">Run final validation checks before updating the live client link.</p>
      </div>

      <Card className="p-6 md:p-8">
        <h2 className="text-xl font-medium text-ink mb-6">Pre-Flight Validation</h2>

        <div className="space-y-4">
          <ValidationItem 
            title="Pricing Complete"
            description={missingPrices.length > 0 ? `${missingPrices.length} units have no final client price set.` : "All units have a calculated client price."}
            status={missingPrices.length > 0 ? "error" : "success"}
          />
          <ValidationItem 
            title="Unit Status"
            description={draftUnits.length > 0 ? `${draftUnits.length} units are still marked as Draft.` : "All units have been moved out of Draft status."}
            status={draftUnits.length > 0 ? "warning" : "success"}
          />
          <ValidationItem 
            title="Visibility Check"
            description={`${hiddenUnits.length} units are currently hidden from the client view.`}
            status="info"
          />
        </div>

        <div className="mt-8 pt-8 border-t border-border/50">
          <div className="bg-muted/30 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-medium text-ink mb-1">Ready for Client Review?</h3>
              <p className="text-sm text-muted-foreground">This will update the live `leora.com/client` dashboard instantly.</p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview Link
              </Button>
              <Button variant="primary" disabled={!isReadyToPublish} className="flex items-center gap-2">
                Publish Updates
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ValidationItem({ title, description, status }: { title: string, description: string, status: 'success' | 'warning' | 'error' | 'info' }) {
  const Icon = status === 'success' ? CheckCircle2 : AlertCircle;
  
  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl border ${
      status === 'success' ? 'bg-status-approved/5 border-status-approved/20' :
      status === 'error' ? 'bg-destructive/5 border-destructive/20' :
      status === 'warning' ? 'bg-status-pending/5 border-status-pending/20' :
      'bg-muted/50 border-border/50'
    }`}>
      <Icon className={`w-5 h-5 mt-0.5 ${
        status === 'success' ? 'text-status-approved' :
        status === 'error' ? 'text-destructive' :
        status === 'warning' ? 'text-status-pending' :
        'text-muted-foreground'
      }`} />
      <div>
        <h4 className="font-medium text-ink mb-0.5">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
