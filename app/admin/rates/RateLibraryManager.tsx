"use client";

import { useState, useTransition } from "react";
import { Plus, Edit2, Trash2, Search, Power, PowerOff, Filter } from "lucide-react";
import { saveRate, deleteRate, toggleRateActive } from "./rate-actions";

type RateTableType = "material_rates" | "hardware_rates" | "accessory_rates" | "labour_rates" | "vendor_rates";

const COST_BASIS_OPTIONS = [
  { value: "per_sqft", label: "Per SqFt" },
  { value: "per_rft", label: "Per RFt" },
  { value: "per_number", label: "Per No" },
  { value: "per_sheet", label: "Per Sheet" },
  { value: "per_unit", label: "Per Unit" },
  { value: "fixed", label: "Fixed" },
  { value: "vendor_quote", label: "Quote" }
];

export interface RateItem {
  id: string;
  item_name: string;
  category?: string;
  brand_name?: string;
  vendor_name?: string;
  specification?: string;
  thickness_mm?: string;
  cost_basis: string;
  unit_rate: number;
  default_wastage_percentage?: number;
  default_margin_percentage: number;
  notes?: string;
  is_active: boolean;
}

export default function RateLibraryManager({
  materials, hardwares, accessories, labours, vendors
}: {
  materials: RateItem[]; hardwares: RateItem[]; accessories: RateItem[]; labours: RateItem[]; vendors: RateItem[];
}) {
  const [activeTab, setActiveTab] = useState<RateTableType>("material_rates");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  
  const [editingItem, setEditingItem] = useState<Partial<RateItem> | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const getActiveData = () => {
    switch (activeTab) {
      case "material_rates": return materials;
      case "hardware_rates": return hardwares;
      case "accessory_rates": return accessories;
      case "labour_rates": return labours;
      case "vendor_rates": return vendors;
      default: return [];
    }
  };

  const currentData = getActiveData().filter(item => {
    const matchSearch = item.item_name?.toLowerCase().includes(search.toLowerCase()) || 
                        item.brand_name?.toLowerCase().includes(search.toLowerCase()) ||
                        item.vendor_name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter ? item.category === categoryFilter : true;
    return matchSearch && matchCat;
  });

  const uniqueCategories = Array.from(new Set(getActiveData().map(i => i.category).filter(Boolean)));

  const handleOpenModal = (item?: RateItem) => {
    setEditingItem(item || { cost_basis: "fixed", default_margin_percentage: 25, default_wastage_percentage: 0, is_active: true });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    startTransition(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await saveRate(activeTab, editingItem as any);
      setModalOpen(false);
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rate?")) return;
    startTransition(async () => {
      await deleteRate(activeTab, id);
    });
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    startTransition(async () => {
      await toggleRateActive(activeTab, id, currentState);
    });
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-taupe/30 focus:border-taupe";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2 p-1 bg-muted/20 rounded-xl border border-border/50 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "material_rates", label: "Materials" },
            { id: "hardware_rates", label: "Hardware" },
            { id: "accessory_rates", label: "Accessories" },
            { id: "labour_rates", label: "Labour" },
            { id: "vendor_rates", label: "Vendors / Factory" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as RateTableType); setCategoryFilter(""); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? "bg-white text-ink shadow-sm" : "text-muted-foreground hover:text-ink hover:bg-white/50"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-taupe text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-taupe/90 whitespace-nowrap shrink-0">
          <Plus className="w-4 h-4" /> Add New Rate
        </button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search items, brands, vendors..." value={search} onChange={e => setSearch(e.target.value)} className={`${inputClass} pl-9`} />
        </div>
        <div className="relative w-48 shrink-0">
          <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className={`${inputClass} pl-9 appearance-none`}>
            <option value="">All Categories</option>
            {uniqueCategories.map((c: string | undefined) => c && <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/10 border-b border-border/50">
              <tr>
                <th className="py-3 px-4 font-medium text-muted-foreground">Item Name</th>
                <th className="py-3 px-4 font-medium text-muted-foreground">Category</th>
                {activeTab !== "labour_rates" && <th className="py-3 px-4 font-medium text-muted-foreground">Brand/Vendor</th>}
                <th className="py-3 px-4 font-medium text-muted-foreground">Basis</th>
                <th className="py-3 px-4 font-medium text-muted-foreground text-right">Unit Rate (₹)</th>
                <th className="py-3 px-4 font-medium text-muted-foreground text-center">Status</th>
                <th className="py-3 px-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">No rates found.</td>
                </tr>
              ) : (
                currentData.map(item => (
                  <tr key={item.id} className={`hover:bg-muted/5 transition-colors ${!item.is_active ? "opacity-60" : ""}`}>
                    <td className="py-3 px-4 font-medium text-ink">{item.item_name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{item.category || "—"}</td>
                    {activeTab !== "labour_rates" && (
                      <td className="py-3 px-4 text-muted-foreground">
                        {item.brand_name && <span className="block text-xs font-medium text-ink">{item.brand_name}</span>}
                        {item.vendor_name && <span className="block text-xs">{item.vendor_name}</span>}
                        {!item.brand_name && !item.vendor_name && "—"}
                      </td>
                    )}
                    <td className="py-3 px-4 text-muted-foreground">{item.cost_basis}</td>
                    <td className="py-3 px-4 text-right font-semibold text-ink">₹{item.unit_rate}</td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => handleToggleActive(item.id, item.is_active)} disabled={isPending} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${item.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {item.is_active ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                        {item.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(item)} className="p-1.5 text-muted-foreground hover:bg-muted hover:text-ink rounded-lg"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-border/50 flex items-center justify-between bg-muted/10">
              <h3 className="font-semibold text-lg text-ink">{editingItem.id ? "Edit Rate" : "Add New Rate"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-ink text-xl leading-none">&times;</button>
            </div>
            <div className="p-5 overflow-y-auto">
              <form id="rateForm" onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase">Item Name *</label>
                    <input required className={inputClass} value={editingItem.item_name || ""} onChange={e => setEditingItem({...editingItem, item_name: e.target.value})} />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase">Category</label>
                    <input className={inputClass} value={editingItem.category || ""} onChange={e => setEditingItem({...editingItem, category: e.target.value})} placeholder="e.g. plywood, hinge..." />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase">Cost Basis *</label>
                    <select required className={inputClass} value={editingItem.cost_basis} onChange={e => setEditingItem({...editingItem, cost_basis: e.target.value})}>
                      {COST_BASIS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>

                  {activeTab !== "labour_rates" && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase">Brand Name</label>
                        <input className={inputClass} value={editingItem.brand_name || ""} onChange={e => setEditingItem({...editingItem, brand_name: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase">Vendor Name</label>
                        <input className={inputClass} value={editingItem.vendor_name || ""} onChange={e => setEditingItem({...editingItem, vendor_name: e.target.value})} />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase">Unit Rate (₹) *</label>
                    <input type="number" step="any" required className={inputClass} value={editingItem.unit_rate || ""} onChange={e => setEditingItem({...editingItem, unit_rate: parseFloat(e.target.value)})} />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase">Default Margin %</label>
                    <input type="number" step="any" className={inputClass} value={editingItem.default_margin_percentage || 0} onChange={e => setEditingItem({...editingItem, default_margin_percentage: parseFloat(e.target.value)})} />
                  </div>

                  {activeTab === "material_rates" && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase">Thickness (mm)</label>
                        <input type="number" step="any" className={inputClass} value={editingItem.thickness_mm || ""} onChange={e => setEditingItem({...editingItem, thickness_mm: e.target.value})} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase">Default Wastage %</label>
                        <input type="number" step="any" className={inputClass} value={editingItem.default_wastage_percentage || 0} onChange={e => setEditingItem({...editingItem, default_wastage_percentage: parseFloat(e.target.value)})} />
                      </div>
                    </>
                  )}
                  
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase">Specification / Notes</label>
                    <textarea rows={2} className={inputClass} value={editingItem.specification || ""} onChange={e => setEditingItem({...editingItem, specification: e.target.value})} />
                  </div>
                </div>
              </form>
            </div>
            <div className="p-5 border-t border-border/50 bg-muted/10 flex justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-ink">Cancel</button>
              <button type="submit" form="rateForm" disabled={isPending} className="px-5 py-2 bg-taupe text-white rounded-xl text-sm font-medium hover:bg-taupe/90 disabled:opacity-50">
                {isPending ? "Saving..." : "Save Rate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
