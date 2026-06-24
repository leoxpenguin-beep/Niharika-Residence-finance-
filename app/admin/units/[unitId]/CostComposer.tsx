"use client";

import { useState, useCallback, useTransition } from "react";
import { Trash2, Copy, ChevronDown, ChevronUp, Save, AlertCircle } from "lucide-react";
import { saveFullCostBreakdown } from "./section-actions";
import { roundClientPrice } from "@/lib/formatters/currency";
import type { 
  UnitCostSection, UnitCostLineItem, SectionType, CostBasis,
  LineItemCategory, NewUnitCostLineItem,
  ClientCostSection
} from "@/types/costing";
import type { CostingTemplateType, Unit } from "@/types/boq";
import { generateBoqSections } from "@/lib/costing/template-generator";
import { calculateDerivedMetrics } from "@/lib/costing/derived-calculations";

// ─── Constants ───────────────────────────────────────────────────────────────

const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  structure: "Structure / Carcass",
  shutter: "Shutters / Finish",
  hardware: "Hardware",
  accessory: "Accessories",
  labour: "Labour",
  installation: "Installation",
  wastage_buffer: "Wastage / Buffer",
};

const CATEGORY_LABELS: Record<LineItemCategory, string> = {
  board_material: "Board / Carcass",
  surface_finish: "Laminate / Surface",
  shutter_material: "Shutter Material",
  shutter_finish_vendor: "Shutter Finish Vendor",
  hardware: "Hardware",
  accessory: "Accessory",
  carpenter_labour: "Carpenter Labour",
  vendor_supply: "Vendor / Factory Supply",
  installation_labour: "Installation Labour",
  transport: "Transport / Loading",
  wastage: "Wastage / Buffer",
  miscellaneous: "Miscellaneous",
};

const COST_BASIS_LABELS: Record<CostBasis, string> = {
  fixed: "Fixed",
  per_sqft: "Per SqFt",
  per_rft: "Per RFt",
  per_number: "Per No",
  per_set: "Per Set",
  per_unit: "Per Unit",
  vendor_quote: "Quote",
};

const COSTING_TEMPLATE_LABELS: Record<CostingTemplateType, string> = {
  wardrobe: "Wardrobe / Tall Storage",
  tv_unit: "TV Base Unit",
  shoe_rack: "Shoe Rack",
  kitchen_base: "Kitchen Base Cabinet",
  kitchen_wall: "Kitchen Wall Cabinet",
  paneling: "Wall Paneling",
  false_ceiling: "False Ceiling",
  loose_furniture: "Loose Furniture",
  vendor_quote: "Vendor Quote",
  custom: "Custom Unit",
};

// ─── Calc helpers ─────────────────────────────────────────────────────────────

function calcLineItem(item: Partial<UnitCostLineItem>) {
  const qty = Number(item.quantity ?? 1);
  const rate = Number(item.unit_rate ?? 0);
  const base = qty * rate;
  const wpct = Number(item.wastage_percentage ?? 0);
  const mpct = Number(item.margin_percentage ?? 0);
  const wamt = base * (wpct / 100);
  const itot = base + wamt;
  const mamt = itot * (mpct / 100);
  const ctot = item.include_in_client_price ? (itot + mamt) : 0;
  return { base, wamt, itot, mamt, ctot };
}

function formatINR(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function newLineItem(cat: LineItemCategory = "miscellaneous"): NewUnitCostLineItem & { _key: string } {
  return {
    _key: crypto.randomUUID(),
    unit_id: "",
    section_id: "",
    sort_order: 0,
    item_name: "",
    category: cat,
    vendor_name: "",
    brand_name: "",
    specification: "",
    cost_basis: "fixed",
    quantity: 1,
    unit_rate: 0,
    wastage_percentage: 0,
    margin_percentage: 25,
    line_base_cost: 0, wastage_amount: 0, internal_total: 0, margin_amount: 0, client_total: 0,
    include_in_client_price: true,
    notes: "",
  };
}

function newSection(unitId: string, order: number): EditorCostSection {
  return {
    _key: crypto.randomUUID(),
    unit_id: unitId,
    section_name: "",
    section_type: "structure",
    sort_order: order,
    notes: "",
    lineItems: [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyRateSnapshot(item: NewUnitCostLineItem, rate: any, type: string) {
  return {
    ...item,
    item_name: rate.item_name || "",
    category: item.category, // Keep the category we assigned from dropdown
    brand_name: rate.brand_name || "",
    vendor_name: rate.vendor_name || "",
    specification: rate.specification || "",
    cost_basis: rate.cost_basis || "fixed",
    unit_rate: rate.unit_rate || 0,
    wastage_percentage: rate.default_wastage_percentage || 0,
    margin_percentage: rate.default_margin_percentage || 25,
    notes: rate.notes || "",
    rate_library_source_id: rate.id,
    rate_library_source_type: type,
  };
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-taupe/30 focus:border-taupe transition-colors";
const labelClass = "block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide";

type EditorLineItem = NewUnitCostLineItem & { _key: string; rate_library_source_id?: string; rate_library_source_type?: string };
type EditorCostSection = Omit<ClientCostSection, "lineItems"> & { _key: string; lineItems: EditorLineItem[] };

function LineItemRow({
  item,
  onChange,
  onDuplicate,
  onRemove,
  onRefresh,
}: {
  item: NewUnitCostLineItem & { _key: string; rate_library_source_id?: string; rate_library_source_type?: string };
  onChange: (key: string, updates: Partial<NewUnitCostLineItem>) => void;
  onDuplicate: (key: string) => void;
  onRemove: (key: string) => void;
  onRefresh?: (key: string) => void;
}) {
  const set = (field: keyof NewUnitCostLineItem, value: unknown) => onChange(item._key, { [field]: value });
  const calc = calcLineItem(item);

  return (
    <div className="border border-border/40 rounded-xl bg-white p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="col-span-3">
          <label className={labelClass}>Item Name</label>
          <input className={inputClass} value={item.item_name} onChange={e => set("item_name", e.target.value)} placeholder="18mm Ply" />
        </div>
        <div className="col-span-3">
          <label className={labelClass}>Category</label>
          <select className={inputClass} value={item.category} onChange={e => set("category", e.target.value)}>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Brand</label>
          <input className={inputClass} value={item.brand_name} onChange={e => set("brand_name", e.target.value)} placeholder="Greenply" />
        </div>
        <div className="col-span-4 flex items-end justify-end gap-2">
           {item.rate_library_source_id && onRefresh && (
             <button type="button" onClick={() => onRefresh(item._key)} className="text-[10px] uppercase tracking-wider font-semibold bg-taupe/10 text-taupe px-2 py-1.5 rounded hover:bg-taupe/20 transition-colors">
               Refresh Rate
             </button>
           )}
           <button type="button" onClick={() => onDuplicate(item._key)} className="p-2 text-muted-foreground hover:bg-muted/50 rounded-lg"><Copy className="w-4 h-4" /></button>
           <button type="button" onClick={() => onRemove(item._key)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
        <div>
          <label className={labelClass}>Basis</label>
          <select className={inputClass} value={item.cost_basis} onChange={e => set("cost_basis", e.target.value)}>
            {Object.entries(COST_BASIS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Qty</label>
          <input type="number" className={inputClass} value={item.quantity} onChange={e => set("quantity", parseFloat(e.target.value) || 0)} step="any" />
        </div>
        <div>
          <label className={labelClass}>Rate (₹)</label>
          <input type="number" className={inputClass} value={item.unit_rate} onChange={e => set("unit_rate", parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <label className={labelClass}>Wastage %</label>
          <input type="number" className={inputClass} value={item.wastage_percentage} onChange={e => set("wastage_percentage", parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <label className={labelClass}>Margin %</label>
          <input type="number" className={inputClass} value={item.margin_percentage} onChange={e => set("margin_percentage", parseFloat(e.target.value) || 0)} />
        </div>
        <div className="flex items-center pt-5">
           <label className="flex items-center gap-2 text-sm text-ink-soft cursor-pointer">
             <input type="checkbox" checked={item.include_in_client_price} onChange={e => set("include_in_client_price", e.target.checked)} className="rounded text-taupe focus:ring-taupe" />
             Client Pays
           </label>
        </div>
      </div>

      <div className="flex gap-4 text-xs">
        <span className="text-muted-foreground">Base: <strong className="text-ink">{formatINR(calc.base)}</strong></span>
        <span className="text-muted-foreground">Waste: <strong className="text-ink">{formatINR(calc.wamt)}</strong></span>
        <span className="text-muted-foreground">Internal: <strong className="text-ink">{formatINR(calc.itot)}</strong></span>
        <span className="text-muted-foreground">Margin: <strong className="text-ink">{formatINR(calc.mamt)}</strong></span>
        <span className="text-gold-warm font-medium">Client: {formatINR(calc.ctot)}</span>
      </div>
    </div>
  );
}

function SectionPanel({
  section,
  index,
  onChange,

  onRemove,
  onOpenRateModal,
  onRefreshRate,
}: {
  section: EditorCostSection;
  index: number;
  onChange: (key: string, updates: Partial<EditorCostSection>) => void;

  onRemove: (key: string) => void;
  onOpenRateModal: (sectionKey: string, category: string) => void;
  onRefreshRate: (sectionKey: string, itemKey: string) => void;
}) {
  const [open, setOpen] = useState(true);

  const set = (field: keyof EditorCostSection, value: unknown) => onChange(section._key, { [field]: value });

  const handleLineItemChange = (liKey: string, updates: Partial<NewUnitCostLineItem>) => {
    set("lineItems", section.lineItems.map((li: EditorLineItem) => li._key === liKey ? { ...li, ...updates } : li));
  };
  
  const handleLineItemAdd = (cat: LineItemCategory) => set("lineItems", [...section.lineItems, newLineItem(cat)]);
  
  const handleLineItemDuplicate = (liKey: string) => {
    const items = [...section.lineItems] as EditorLineItem[];
    const idx = items.findIndex(li => li._key === liKey);
    if (idx !== -1) set("lineItems", [...items.slice(0, idx+1), { ...items[idx], _key: crypto.randomUUID() }, ...items.slice(idx+1)]);
  };
  const handleLineItemRemove = (liKey: string) => set("lineItems", section.lineItems.filter((li: EditorLineItem) => li._key !== liKey));

  const totalClient = section.lineItems.reduce((acc, li) => acc + calcLineItem(li).ctot, 0);

  return (
    <div className="border border-border/60 rounded-2xl bg-muted/5 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-3.5 bg-parchment/60 cursor-pointer select-none border-b border-border/30" onClick={() => setOpen(o => !o)}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{String(index + 1).padStart(2, "0")}</span>
          <span className="font-medium text-ink text-sm">{section.section_name || SECTION_TYPE_LABELS[section.section_type] || "New Section"}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-taupe">{formatINR(totalClient)}</span>
          <div className="flex gap-1">
             <button type="button" onClick={e => { e.stopPropagation(); onRemove(section._key); }} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
             {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {open && (
        <div className="p-5 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div>
               <label className={labelClass}>Section Name</label>
               <input className={inputClass} value={section.section_name} onChange={e => set("section_name", e.target.value)} />
             </div>
             <div>
               <label className={labelClass}>Section Type</label>
               <select className={inputClass} value={section.section_type} onChange={e => set("section_type", e.target.value)}>
                 {Object.entries(SECTION_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
               </select>
             </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-ink">Line Items</h4>
            {section.lineItems.map(li => (
               <LineItemRow key={(li as EditorLineItem)._key as string} item={li as unknown as EditorLineItem} onChange={handleLineItemChange} onDuplicate={handleLineItemDuplicate} onRemove={handleLineItemRemove} onRefresh={(k) => onRefreshRate(section._key, k)} />
            ))}
            
            <div className="flex flex-wrap gap-2 pt-2">
              <select 
                className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-1.5 text-taupe focus:outline-none focus:ring-2 hover:bg-muted/10 cursor-pointer"
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    if (e.target.value.startsWith("lib_")) {
                      onOpenRateModal(section._key, e.target.value.replace("lib_", ""));
                    } else {
                      handleLineItemAdd(e.target.value as LineItemCategory);
                    }
                  }
                }}
              >
                <option value="" disabled>Add Item...</option>
                <optgroup label="From Rate Library">
                  <option value="lib_materials">Add Material Rate</option>
                  <option value="lib_hardwares">Add Hardware Rate</option>
                  <option value="lib_accessories">Add Accessory Rate</option>
                  <option value="lib_labours">Add Labour Rate</option>
                  <option value="lib_vendors">Add Vendor / Factory Rate</option>
                </optgroup>
                <optgroup label="Custom Line Items">
                  <option value="miscellaneous">Add Custom Line Item</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Cost Composer ───────────────────────────────────────────────────────

export default function CostComposer({
  unitId,
  unit,
  initialSections,
  initialLineItems,
  rateLibrary,
}: {
  unitId: string;
  unit: Unit;
  initialSections: UnitCostSection[];
  initialLineItems: UnitCostLineItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rateLibrary: any;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const initSecs = initialSections.map(s => {
    const items = initialLineItems.filter(li => li.section_id === s.id);
    return { ...s, _key: s.id, lineItems: items.map(li => ({ ...li, _key: li.id })) };
  }) as EditorCostSection[];

  const [sections, setSections] = useState<EditorCostSection[]>(initSecs);
  
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [targetSectionKey, setTargetSectionKey] = useState<string | null>(null);
  const [targetRateType, setTargetRateType] = useState<string | null>(null);
  const [rateSearch, setRateSearch] = useState("");

  const handleOpenRateModal = (sectionKey: string, type: string) => {
    setTargetSectionKey(sectionKey);
    setTargetRateType(type);
    setRateSearch("");
    setRateModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectRate = (rate: any, type: string) => {
    if (!targetSectionKey) return;
    setSections(prev => prev.map(s => {
      if (s._key !== targetSectionKey) return s;
      
      let category: LineItemCategory = "miscellaneous";
      if (type === "materials") category = "board_material";
      else if (type === "hardwares") category = "hardware";
      else if (type === "accessories") category = "accessory";
      else if (type === "labours") category = "carpenter_labour";
      else if (type === "vendors") category = "vendor_supply";

      const newItem = { ...applyRateSnapshot(newLineItem(category), rate, type), _key: crypto.randomUUID() } as EditorLineItem;
      return { ...s, lineItems: [...s.lineItems, newItem] };
    }));
    setRateModalOpen(false);
    setSaved(false);
  };

  const handleRefreshRate = (sectionKey: string, itemKey: string) => {
    setSections(prev => prev.map(s => {
      if (s._key !== sectionKey) return s;
      return {
        ...s,
        lineItems: s.lineItems.map((li: EditorLineItem) => {
          if (li._key !== itemKey) return li;
          if (!li.rate_library_source_type || !li.rate_library_source_id) return li;
          const masterList = rateLibrary[li.rate_library_source_type] || [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const masterRate = masterList.find((r: any) => r.id === li.rate_library_source_id);
          if (!masterRate) {
            alert("Master rate no longer found in library.");
            return li;
          }
          return applyRateSnapshot(li, masterRate, li.rate_library_source_type) as EditorLineItem;
        })
      };
    }));
    setSaved(false);
  };

  const [mfgMode, setMfgMode] = useState<string>(unit.manufacturing_mode || "site_carpentry");
  const [templateType, setTemplateType] = useState<CostingTemplateType>(unit.costing_template || "custom");
  const [w, setW] = useState(unit.width_mm || 0);
  const [h, setH] = useState(unit.height_mm || 0);
  const [d, setD] = useState(unit.depth_mm || 0);
  const [qty, setQty] = useState(unit.quantity || 1);
  const [chSqft, setChSqft] = useState(unit.chargeable_sqft || 0);
  const [finalOverride, setFinalOverride] = useState<string>(unit.final_client_price?.toString() || "");

  const dims = calculateDerivedMetrics(w, h, d, qty, templateType);

  const handleGenerateTemplate = () => {
    const newSections = generateBoqSections(templateType, mfgMode, unitId) as unknown as EditorCostSection[];
    if (sections.length > 0) {
      const confirmMode = window.confirm("Sections already exist. Click OK to Append missing, or Cancel to Replace completely?");
      if (confirmMode) {
        // Append missing
        const existingNames = new Set(sections.map(s => s.section_name));
        const missing = newSections.filter(s => !existingNames.has(s.section_name));
        setSections(prev => [...prev, ...missing]);
      } else {
        // Replace
        if (window.confirm("Are you sure you want to replace all existing sections? This will delete existing items.")) {
          setSections(newSections);
        }
      }
    } else {
      setSections(newSections);
    }
  };

  // Grouped Summary
  let matTotal = 0, hwTotal = 0, accTotal = 0, labTotal = 0, vendTotal = 0, transTotal = 0, intTotal = 0, marTotal = 0, sugTotal = 0;
  
  sections.forEach(s => {
    s.lineItems.forEach(li => {
      const c = calcLineItem(li);
      intTotal += c.itot;
      marTotal += c.mamt;
      sugTotal += c.ctot;

      switch(li.category) {
        case "board_material":
        case "surface_finish":
        case "shutter_material":
          matTotal += c.itot; break;
        case "hardware": hwTotal += c.itot; break;
        case "accessory": accTotal += c.itot; break;
        case "carpenter_labour":
        case "installation_labour": labTotal += c.itot; break;
        case "shutter_finish_vendor":
        case "vendor_supply": vendTotal += c.itot; break;
        case "transport": transTotal += c.itot; break;
      }
    });
  });

  const suggestedRounded = roundClientPrice(sugTotal);
  const finalPrice = parseFloat(finalOverride) > 0 ? parseFloat(finalOverride) : suggestedRounded;
  const ratePerSqft = chSqft > 0 ? finalPrice / chSqft : 0;

  const handleChange = useCallback((key: string, updates: Partial<EditorCostSection>) => {
    setSections(prev => prev.map(s => s._key === key ? { ...s, ...updates } : s));
    setSaved(false);
  }, []);

  const handleSave = () => {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const payload = {
        sections: sections as unknown as ClientCostSection[],
        finalClientPriceOverride: parseFloat(finalOverride) || null,
        manufacturingMode: mfgMode,
        costingTemplate: templateType,
        chargeableSqft: chSqft,
      };
      // Note: we might want to also save costing_template, but UnitEditorForm will also do it.
      const result = await saveFullCostBreakdown(unitId, payload);
      if (result.error) setError(result.error);
      else setSaved(true);
    });
  };

  return (
    <section className="space-y-6">
      {/* Settings Panel */}
      <div className="bg-white border border-border/50 rounded-2xl p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h2 className="text-sm font-semibold text-ink uppercase tracking-widest">Unit Configuration</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           <div>
             <label className={labelClass}>Costing Template</label>
             <select className={inputClass} value={templateType} onChange={e => setTemplateType(e.target.value as CostingTemplateType)}>
               {Object.entries(COSTING_TEMPLATE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
             </select>
           </div>
           <div>
             <label className={labelClass}>Manufacturing Mode</label>
             <select className={inputClass} value={mfgMode} onChange={e => setMfgMode(e.target.value)}>
               <option value="site_carpentry">Site Carpentry</option>
               <option value="factory_modular">Factory Modular</option>
               <option value="hybrid">Hybrid</option>
             </select>
           </div>
           <div>
             <label className={labelClass}>Chargeable SqFt / RFt</label>
             <div className="flex gap-2">
                <input type="number" className={inputClass} value={chSqft} onChange={e => setChSqft(parseFloat(e.target.value)||0)} />
                <button type="button" onClick={() => setChSqft(dims.recommended_chargeable_sqft)} className="text-xs bg-muted/50 px-2 rounded hover:bg-muted text-taupe whitespace-nowrap">Use {dims.recommended_chargeable_sqft}</button>
             </div>
           </div>
        </div>
        <div className="bg-muted/30 rounded-xl p-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Dimensions</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div><label className={labelClass}>Width (mm)</label><input type="number" className={inputClass} value={w} onChange={e => setW(parseFloat(e.target.value)||0)} /></div>
            <div><label className={labelClass}>Height (mm)</label><input type="number" className={inputClass} value={h} onChange={e => setH(parseFloat(e.target.value)||0)} /></div>
            <div><label className={labelClass}>Depth (mm)</label><input type="number" className={inputClass} value={d} onChange={e => setD(parseFloat(e.target.value)||0)} /></div>
            <div><label className={labelClass}>Quantity</label><input type="number" className={inputClass} value={qty} onChange={e => setQty(parseFloat(e.target.value)||0)} /></div>
          </div>
          <p className="text-xs text-muted-foreground pt-1 flex gap-4">
            <span>Width: <strong>{dims.width_ft} ft</strong></span>
            <span>Height: <strong>{dims.height_ft} ft</strong></span>
            <span>Front Area: <strong>{dims.front_area_sqft} sqft</strong></span>
            <span>RFt: <strong>{dims.running_feet} ft</strong></span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Detailed BOQ — Admin Only</h2>
        <div className="flex gap-3">
          <button type="button" onClick={() => setSections(prev => [...prev, newSection(unitId, prev.length)])} className="text-xs font-medium bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors">
            + Add Section
          </button>
          <button type="button" onClick={handleGenerateTemplate} className="text-xs font-medium bg-taupe text-white px-3 py-1.5 rounded-lg hover:bg-taupe/90 transition-colors">
            Generate BOQ Template
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((s, i) => <SectionPanel key={s._key} section={s} index={i} onChange={handleChange} onRemove={(k) => setSections(prev => prev.filter(x => x._key !== k))} onOpenRateModal={handleOpenRateModal} onRefreshRate={handleRefreshRate} />)}
      </div>

      {/* Summary */}
      <div className="bg-ink text-cream rounded-2xl p-5 shadow-md">
        <p className="text-xs uppercase tracking-widest text-cream/60 mb-4 font-medium">BOQ Summary</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 mb-6 pb-6 border-b border-white/10">
          <div><p className="text-xs text-cream/50 mb-0.5">Material</p><p className="text-sm font-medium">{formatINR(matTotal)}</p></div>
          <div><p className="text-xs text-cream/50 mb-0.5">Hardware</p><p className="text-sm font-medium">{formatINR(hwTotal)}</p></div>
          <div><p className="text-xs text-cream/50 mb-0.5">Accessories</p><p className="text-sm font-medium">{formatINR(accTotal)}</p></div>
          <div><p className="text-xs text-cream/50 mb-0.5">Labour</p><p className="text-sm font-medium">{formatINR(labTotal)}</p></div>
          <div><p className="text-xs text-cream/50 mb-0.5">Vendor / Factory</p><p className="text-sm font-medium">{formatINR(vendTotal)}</p></div>
          <div><p className="text-xs text-cream/50 mb-0.5">Transport / Install</p><p className="text-sm font-medium">{formatINR(transTotal)}</p></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-4">
          <div><p className="text-xs text-cream/60 mb-0.5">Internal Total</p><p className="font-semibold text-lg">{formatINR(intTotal)}</p></div>
          <div><p className="text-xs text-cream/60 mb-0.5">Margin Total</p><p className="font-semibold text-lg">{formatINR(marTotal)}</p></div>
          <div>
             <p className="text-xs text-cream/60 mb-0.5">Suggested Price</p>
             <p className="font-semibold text-lg text-gold-warm">{formatINR(suggestedRounded)}</p>
          </div>
          <div>
             <p className="text-xs text-cream/60 mb-0.5">Final Client Price</p>
             <input type="number" value={finalOverride} onChange={e => setFinalOverride(e.target.value)} placeholder={String(Math.round(suggestedRounded))} className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-sm font-semibold text-cream focus:outline-none focus:ring-2 focus:ring-white/30" />
          </div>
          <div><p className="text-xs text-cream/60 mb-0.5">Rate / SqFt</p><p className="font-semibold text-lg">{formatINR(ratePerSqft)}</p></div>
        </div>
        {error && <div className="flex items-center gap-2 bg-destructive/20 text-cream text-sm p-3 rounded-lg mb-3"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}
        <div className="flex items-center gap-3 mt-4">
          <button type="button" onClick={handleSave} disabled={isPending} className="flex items-center gap-2 bg-cream text-ink px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-cream/90 transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" /> {isPending ? "Saving…" : "Save BOQ Breakdown"}
          </button>
          {saved && <span className="text-sm text-green-400 font-medium">✓ Saved successfully</span>}
        </div>
      </div>

      {/* Rate Library Modal */}
      {rateModalOpen && targetRateType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/10">
              <div>
                <h3 className="font-semibold text-lg text-ink capitalize">Select {targetRateType.replace(/s$/, '')} Rate</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Rates will be copied to your line item.</p>
              </div>
              <button onClick={() => setRateModalOpen(false)} className="text-muted-foreground hover:text-ink text-xl leading-none">&times;</button>
            </div>
            <div className="p-4 border-b border-border/30 bg-white">
              <input type="text" placeholder="Search rates..." value={rateSearch} onChange={e => setRateSearch(e.target.value)} className={inputClass} />
            </div>
            <div className="overflow-y-auto p-0 flex-1 bg-white">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/10 sticky top-0 border-b border-border/30">
                  <tr>
                    <th className="py-2 px-4 font-medium text-muted-foreground">Item Name</th>
                    <th className="py-2 px-4 font-medium text-muted-foreground">Category</th>
                    <th className="py-2 px-4 font-medium text-muted-foreground text-right">Unit Rate</th>
                    <th className="py-2 px-4 font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {rateLibrary[targetRateType]
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ?.filter((r: any) => 
                      r.item_name?.toLowerCase().includes(rateSearch.toLowerCase()) || 
                      r.brand_name?.toLowerCase().includes(rateSearch.toLowerCase()) ||
                      r.category?.toLowerCase().includes(rateSearch.toLowerCase())
                    )
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .map((r: any) => (
                      <tr key={r.id} className="hover:bg-muted/10 transition-colors">
                        <td className="py-3 px-4 font-medium text-ink">{r.item_name}
                           {(r.brand_name || r.vendor_name) && <span className="block text-xs text-muted-foreground font-normal">{r.brand_name} {r.vendor_name}</span>}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{r.category}</td>
                        <td className="py-3 px-4 text-right font-medium text-ink">₹{r.unit_rate} <span className="text-xs text-muted-foreground font-normal">/{r.cost_basis}</span></td>
                        <td className="py-3 px-4 text-right">
                          <button onClick={() => handleSelectRate(r, targetRateType)} className="text-xs bg-taupe/10 text-taupe hover:bg-taupe hover:text-white px-3 py-1.5 rounded-lg transition-colors font-medium">Select</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {(!rateLibrary[targetRateType] || rateLibrary[targetRateType].length === 0) && (
                <div className="p-8 text-center text-muted-foreground text-sm">No rates available in library.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
