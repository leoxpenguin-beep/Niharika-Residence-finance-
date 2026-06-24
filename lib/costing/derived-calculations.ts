import type { CostingTemplateType } from "@/types/boq";

export function calculateDerivedMetrics(
  width_mm: number,
  height_mm: number,
  depth_mm: number,
  quantity: number,
  templateType: CostingTemplateType | string
) {
  const w = width_mm || 0;
  const h = height_mm || 0;
  const d = depth_mm || 0;
  const q = quantity || 1;

  const width_ft = w / 304.8;
  const height_ft = h / 304.8;
  const depth_ft = d / 304.8;

  const front_area_sqft = (w > 0 && h > 0) ? width_ft * height_ft * q : 0;
  const running_feet = (w > 0) ? width_ft * q : 0;
  const surface_sqft = front_area_sqft; // Often the same mathematically for front projection

  let recommended_chargeable_sqft = 0;

  switch (templateType) {
    case "wardrobe":
    case "shoe_rack":
    case "kitchen_base":
    case "kitchen_wall":
      recommended_chargeable_sqft = front_area_sqft;
      break;
    case "tv_unit":
      recommended_chargeable_sqft = running_feet; // Or could be front_area depending on specific practice, UI will let admin override
      break;
    case "paneling":
      recommended_chargeable_sqft = surface_sqft;
      break;
    case "false_ceiling":
    case "loose_furniture":
    case "vendor_quote":
    case "custom":
    default:
      recommended_chargeable_sqft = 0; // Usually manual override required
      break;
  }

  return {
    width_ft: Math.round(width_ft * 100) / 100,
    height_ft: Math.round(height_ft * 100) / 100,
    depth_ft: Math.round(depth_ft * 100) / 100,
    front_area_sqft: Math.round(front_area_sqft * 100) / 100,
    running_feet: Math.round(running_feet * 100) / 100,
    surface_sqft: Math.round(surface_sqft * 100) / 100,
    recommended_chargeable_sqft: Math.round(recommended_chargeable_sqft * 100) / 100,
  };
}
