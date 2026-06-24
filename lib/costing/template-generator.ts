import type { ClientCostSection, ManufacturingMode } from "@/types/costing";
import type { CostingTemplateType } from "@/types/boq";

type SectionDefinition = { name: string; type: ClientCostSection["section_type"] };

export function generateBoqSections(
  templateType: CostingTemplateType,
  manufacturingMode: ManufacturingMode | string,
  unitId: string
): (ClientCostSection & { _key: string })[] {
  let sections: SectionDefinition[] = [];

  // Special templates that override standard manufacturing mode structures
  if (templateType === "vendor_quote") {
    sections = [
      { name: "Vendor Quote", type: "structure" },
      { name: "Transport / Loading", type: "structure" },
      { name: "Installation", type: "installation" },
    ];
  } else if (templateType === "loose_furniture") {
    sections = [
      { name: "Furniture Cost", type: "structure" },
      { name: "Transport / Loading", type: "structure" },
    ];
  } else if (templateType === "false_ceiling") {
    sections = [
      { name: "Ceiling Framework & Board", type: "structure" },
      { name: "Surface Finish", type: "shutter" },
      { name: "Labour", type: "labour" },
      { name: "Wastage / Buffer", type: "wastage_buffer" },
    ];
  } else if (templateType === "paneling") {
    if (manufacturingMode === "factory_modular") {
      sections = [
        { name: "Factory Supply (Panels)", type: "structure" },
        { name: "Factory Finish", type: "shutter" },
        { name: "Transport", type: "structure" },
        { name: "Site Installation", type: "installation" },
        { name: "Wastage / Buffer", type: "wastage_buffer" },
      ];
    } else {
      sections = [
        { name: "Structure / Framework", type: "structure" },
        { name: "Surface Finish", type: "shutter" },
        { name: "Carpenter Labour", type: "labour" },
        { name: "Installation", type: "installation" },
        { name: "Wastage / Buffer", type: "wastage_buffer" },
      ];
    }
  } else {
    // Standard box storage items (wardrobe, shoe_rack, tv_unit, kitchen_base, kitchen_wall)
    if (manufacturingMode === "factory_modular") {
      sections = [
        { name: "Factory Supply", type: "structure" },
        { name: "Factory Shutters / Finish", type: "shutter" },
        { name: "Hardware", type: "hardware" },
        { name: "Accessories", type: "accessory" },
        { name: "Transport", type: "structure" }, // fallback to something valid
        { name: "Site Installation", type: "installation" },
        { name: "Wastage / Buffer", type: "wastage_buffer" },
      ];
    } else if (manufacturingMode === "hybrid") {
      sections = [
        { name: "Site Carcass", type: "structure" },
        { name: "Factory / Vendor Shutters", type: "shutter" },
        { name: "Shutter Finish Vendor", type: "shutter" },
        { name: "Hardware", type: "hardware" },
        { name: "Accessories", type: "accessory" },
        { name: "Carpenter Labour", type: "labour" },
        { name: "Vendor Installation", type: "installation" },
        { name: "Transport", type: "structure" },
        { name: "Wastage / Buffer", type: "wastage_buffer" },
      ];
    } else {
      // site_carpentry or default
      sections = [
        { name: "Structure / Carcass", type: "structure" },
        { name: "Surface Finish", type: "shutter" },
        { name: "Hardware", type: "hardware" },
        { name: "Accessories", type: "accessory" },
        { name: "Carpenter Labour", type: "labour" },
        { name: "Installation", type: "installation" },
        { name: "Transport / Loading", type: "structure" },
        { name: "Wastage / Buffer", type: "wastage_buffer" },
      ];
    }

    // Adjust standard templates if they don't typically have accessories
    if (templateType === "kitchen_wall" || templateType === "tv_unit") {
      // Optional: Could remove 'Accessories' but keeping it as empty section is fine
    }
  }

  // Ensure type is strictly valid per SectionType, fallback to "structure" if custom
  const validSectionTypes = ["structure", "shutter", "hardware", "accessory", "labour", "installation", "wastage_buffer"];

  return sections.map((def, idx) => ({
    _key: crypto.randomUUID(),
    unit_id: unitId,
    section_name: def.name,
    section_type: validSectionTypes.includes(def.type) ? def.type : "structure",
    sort_order: idx,
    notes: "",
    lineItems: [],
  }));
}
