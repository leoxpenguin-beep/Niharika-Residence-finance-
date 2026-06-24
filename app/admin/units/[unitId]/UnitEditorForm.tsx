"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { updateUnit } from "./actions";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import CostComposer from "./CostComposer";
import { ArrowLeft, Save } from "lucide-react";
import type { UnitCostSection, UnitCostLineItem } from "@/types/costing";
import type { Unit } from "@/types/boq";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "measurement_pending", label: "Measurement Pending" },
  { value: "spec_pending", label: "Spec Pending" },
  { value: "need_discussion", label: "Needs Discussion" },
  { value: "published", label: "Published" },
  { value: "hold", label: "On Hold" },
  { value: "client_approved", label: "Client Approved" },
];

const CONFIDENCE_OPTIONS = [
  { value: "concept_estimate", label: "Concept Estimate" },
  { value: "measurement_based", label: "Measurement Based" },
  { value: "vendor_checked", label: "Vendor Checked" },
  { value: "final_locked", label: "Final Locked" },
];

const selectClass =
  "w-full border border-input rounded-xl px-4 py-3 text-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-taupe/40";

export default function UnitEditorForm({
  unit,
  initialSections,
  initialLineItems,
  rateLibrary,
}: {
  unit: Unit;
  initialSections: UnitCostSection[];
  initialLineItems: UnitCostLineItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rateLibrary: any;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateUnit(unit.id, formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="max-w-3xl space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border/50 pb-4">
        <Link
          href="/admin/units"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-heading text-foreground">{unit.name}</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            <span className="font-mono">{unit.unit_code}</span>
            {" · "}
            {/* @ts-expect-error - relations aren't typed perfectly in Unit */}
            {unit.areas?.floors?.name} › {unit.areas?.name}
          </p>
        </div>
      </div>

      {/* ── Section 1: Client-Facing Information ─────────────────────────── */}
      <form action={handleSubmit} className="space-y-8">
        <section className="bg-parchment/60 border border-border/50 rounded-2xl p-6 space-y-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Client-Facing Information
          </h2>

          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Unit Name</label>
            <Input name="name" defaultValue={unit.name} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Short Description</label>
            <Input name="short_description" defaultValue={unit.short_description} />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">
              Design Purpose{" "}
              <span className="text-xs font-normal text-muted-foreground">(shown to client)</span>
            </label>
            <textarea
              name="design_purpose"
              defaultValue={unit.design_purpose}
              className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-taupe/40 resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Material Direction</label>
            <Input name="material_direction" defaultValue={unit.material_direction} />
          </div>
        </section>

        {/* ── Section 3: Status & Visibility ──────────────────────────────── */}
        <section className="bg-parchment/60 border border-border/50 rounded-2xl p-6 space-y-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Status & Visibility
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1">Unit Status</label>
              <select name="status" defaultValue={unit.status} className={selectClass}>
                {STATUS_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1">Cost Confidence</label>
              <select name="cost_confidence" defaultValue={unit.cost_confidence} className={selectClass}>
                {CONFIDENCE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1">Client Visibility</label>
              <select
                name="is_client_visible"
                defaultValue={unit.is_client_visible ? "true" : "false"}
                className={selectClass}
              >
                <option value="true">Visible to Client</option>
                <option value="false">Hidden from Client</option>
              </select>
            </div>
          </div>
        </section>

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-xl">{error}</div>
        )}

        <div className="flex items-center gap-3">
          <Button type="submit" variant="primary" disabled={isPending} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {isPending ? "Saving…" : "Save Info & Status"}
          </Button>
          <Link href="/admin/units">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
        </div>
      </form>

      <CostComposer 
        unitId={unit.id} 
        unit={unit} 
        initialSections={initialSections} 
        initialLineItems={initialLineItems} 
        rateLibrary={rateLibrary}
      />
    </div>
  );
}
