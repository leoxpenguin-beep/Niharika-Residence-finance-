"use client";

import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, FileSpreadsheet } from "lucide-react";
import type { RateItem } from "./RateLibraryManager";
import { bulkSaveRates } from "./rate-actions";

interface BulkImportModalProps {
  onClose: () => void;
  existingData: RateItem[];
  defaultTab: string;
}

export default function BulkImportModal({ onClose, existingData, defaultTab }: BulkImportModalProps) {
  const [step, setStep] = useState<"paste" | "preview">("paste");
  const [csvData, setCsvData] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parsedRows, setParsedRows] = useState<Record<string, any>[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const parseCSV = () => {
    try {
      const lines = csvData.trim().split("\n");
      if (lines.length < 2) throw new Error("Please provide at least a header row and one data row.");
      
      const headers = lines[0].split(",").map(h => h.trim());
      
      const rows = lines.slice(1).map(line => {
        // Basic split, assumes no commas inside values for simplicity
        const values = line.split(",").map(v => v.trim());
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const row: any = {};
        headers.forEach((h, i) => {
          row[h] = values[i] !== undefined ? values[i] : "";
        });
        
        const targetTable = mapRateTypeToTable(row.rate_type) || defaultTab;
        
        // Match existing item in target tab
        const isExisting = existingData.some(
          ex => ex.item_name.toLowerCase() === row.item_name?.toLowerCase() &&
          // if it's the defaultTab, we only match if targetTable is also defaultTab
          defaultTab === targetTable
        );

        return {
          ...row,
          _target_table: targetTable,
          _action: isExisting ? "Update Existing" : "Create New"
        };
      });

      setParsedRows(rows);
      setStep("preview");
      setErrorMsg(null);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrorMsg(e.message);
      } else {
        setErrorMsg("Failed to parse CSV.");
      }
    }
  };

  const mapRateTypeToTable = (type: string) => {
    switch(type) {
      case "vendor_factory_rate": return "vendor_rates";
      case "material_rate": return "material_rates";
      case "hardware_rate": return "hardware_rates";
      case "accessory_rate": return "accessory_rates";
      case "labour_rate": return "labour_rates";
      default: return null;
    }
  };

  const handleImport = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    
    startTransition(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payloadByTable: Record<string, Record<string, any>[]> = {};
      
      parsedRows.filter(r => r._action !== "Skip").forEach(r => {
        const table = r._target_table;
        if (!payloadByTable[table]) payloadByTable[table] = [];
        
        const cleanRow = { ...r };
        delete cleanRow._target_table;
        delete cleanRow._action;
        
        // Clean numeric
        cleanRow.unit_rate = Number(cleanRow.unit_rate) || 0;
        cleanRow.default_margin_percentage = cleanRow.default_margin_percentage ? Number(cleanRow.default_margin_percentage) : 25;
        cleanRow.default_wastage_percentage = cleanRow.default_wastage_percentage ? Number(cleanRow.default_wastage_percentage) : 0;
        cleanRow.is_active = cleanRow.is_active === "false" ? false : true;
        
        // Strip out based on table
        if (table !== "material_rates") {
          delete cleanRow.thickness_mm;
        }
        if (table === "labour_rates") {
          delete cleanRow.brand_name;
          delete cleanRow.vendor_name;
        }
        
        payloadByTable[table].push(cleanRow);
      });
      
      const res = await bulkSaveRates(payloadByTable);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg("Rates imported successfully!");
        setTimeout(() => onClose(), 1500);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-border/50 flex items-center justify-between bg-muted/10">
          <h3 className="font-semibold text-lg text-ink flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-taupe" /> 
            Bulk Import Rates
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-ink text-xl leading-none">&times;</button>
        </div>
        
        <div className="p-5 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="mb-4 flex items-center gap-2 bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 flex items-center gap-2 bg-green-100 text-green-800 text-sm p-3 rounded-lg">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {successMsg}
            </div>
          )}
          
          {step === "paste" ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Paste your CSV-style data here. Must include headers.</p>
              <textarea 
                value={csvData}
                onChange={e => setCsvData(e.target.value)}
                className="w-full h-64 border border-gray-200 rounded-lg p-3 text-sm font-mono focus:ring-2 focus:ring-taupe/30 focus:border-taupe whitespace-pre"
                placeholder="rate_type,item_name,category,brand_name,vendor_name,specification,cost_basis,unit_rate,default_margin_percentage,default_wastage_percentage,notes,source_file_name,quotation_number,quotation_date,is_active..."
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Previewing {parsedRows.length} rows to import.</p>
                <button onClick={() => setStep("paste")} className="text-sm text-taupe hover:underline">Edit CSV</button>
              </div>
              <div className="border border-border/50 rounded-xl overflow-x-auto">
                <table className="w-full text-xs text-left whitespace-nowrap">
                  <thead className="bg-muted/10 border-b border-border/50">
                    <tr>
                      <th className="p-2 font-medium">Action</th>
                      <th className="p-2 font-medium">Table</th>
                      <th className="p-2 font-medium">Item Name</th>
                      <th className="p-2 font-medium">Rate</th>
                      <th className="p-2 font-medium">Margin</th>
                      <th className="p-2 font-medium">Wastage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {parsedRows.map((r, i) => (
                      <tr key={i}>
                        <td className="p-2">
                          <select 
                            value={r._action} 
                            onChange={(e) => {
                              const newRows = [...parsedRows];
                              newRows[i]._action = e.target.value;
                              setParsedRows(newRows);
                            }}
                            className={`border rounded p-1 text-xs ${r._action === "Skip" ? "bg-red-50 text-red-700" : r._action === "Update Existing" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}
                          >
                            <option value="Create New">Create New</option>
                            <option value="Update Existing">Update Existing</option>
                            <option value="Skip">Skip</option>
                          </select>
                        </td>
                        <td className="p-2">{r._target_table}</td>
                        <td className="p-2 font-medium">{r.item_name}</td>
                        <td className="p-2">₹{r.unit_rate}</td>
                        <td className="p-2">{r.default_margin_percentage}%</td>
                        <td className="p-2">{r.default_wastage_percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-5 border-t border-border/50 bg-muted/10 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-ink">Cancel</button>
          {step === "paste" ? (
            <button type="button" onClick={parseCSV} className="px-5 py-2 bg-taupe text-white rounded-xl text-sm font-medium hover:bg-taupe/90">
              Preview Import
            </button>
          ) : (
            <button type="button" onClick={handleImport} disabled={isPending} className="px-5 py-2 bg-taupe text-white rounded-xl text-sm font-medium hover:bg-taupe/90 disabled:opacity-50">
              {isPending ? "Importing..." : "Confirm Import"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
