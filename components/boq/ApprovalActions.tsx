"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import Input from "@/components/ui/Input";
import type { ApprovalAction } from "@/types/approval";
import type { ClientSafeUnit } from "@/lib/security/client-safe-selectors";

interface ApprovalActionsProps {
  unit: ClientSafeUnit;
}

export function ApprovalActions({ unit }: ApprovalActionsProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ApprovalAction | null>(null);
  const [note, setNote] = useState("");
  const [clientName, setClientName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleActionClick = (action: ApprovalAction) => {
    setSelectedAction(action);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedAction || !clientName.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/client-approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unit_id: unit.id,
          client_action: selectedAction,
          client_note: note,
          client_name: clientName,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit approval");

      router.push("/client/approval/thank-you");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("There was an error saving your action. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };

  const actionConfig: Record<ApprovalAction, { title: string; color: string }> = {
    approved: { title: "Approve Scope", color: "bg-approved text-approved-foreground hover:bg-approved/90" },
    need_discussion: { title: "Request Discussion", color: "bg-discussion text-discussion-foreground hover:bg-discussion/90" },
    hold: { title: "Put on Hold", color: "bg-hold text-hold-foreground hover:bg-hold/90" },
    remove: { title: "Remove from Scope", color: "bg-removed text-removed-foreground hover:bg-removed/90" },
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 mt-6">
        <Button
          onClick={() => handleActionClick("approved")}
          className="col-span-2 w-full h-12 bg-approved text-approved-foreground hover:bg-approved/90 text-base"
        >
          Approve Scope
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleActionClick("need_discussion")}
          className="w-full text-discussion-foreground border-discussion/50 hover:bg-discussion/10"
        >
          Discuss
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleActionClick("hold")}
          className="w-full text-hold-foreground border-hold/50 hover:bg-hold/10"
        >
          Hold
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={selectedAction ? actionConfig[selectedAction].title : "Confirm Action"}
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            You are making a decision on: <br />
            <strong className="text-foreground">{unit.name}</strong> ({unit.unit_code})
          </p>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Your Name *
            </label>
            <Input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="E.g. Niharika"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Note (Optional)
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any specific questions or comments..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !clientName.trim()}
              className={selectedAction ? actionConfig[selectedAction].color : ""}
            >
              {isSubmitting ? "Saving..." : "Confirm Action"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
