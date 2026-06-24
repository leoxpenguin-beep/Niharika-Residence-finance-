import Link from "next/link";
import ClientShell from "@/components/layout/ClientShell";
import Button from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

export default function ThankYouPage() {
  return (
    <ClientShell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-approved/10 text-approved-foreground rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        
        <h1 className="text-3xl font-heading text-foreground mb-4">
          Decision Recorded
        </h1>
        
        <p className="text-muted-foreground max-w-md mb-8">
          Thank you for reviewing. Your decision has been saved and the LEORA team has been notified. 
          We will update the project scope accordingly.
        </p>

        <Link href="/client" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto px-8">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </ClientShell>
  );
}
