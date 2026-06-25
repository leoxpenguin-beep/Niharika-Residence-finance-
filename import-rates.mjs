import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Assuming local dev has anon key printed in standard supabase start, but we can just use the DB directly or fetch it
// Since we are running outside Next.js, let's just parse the env files
const envLocal = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
const urlMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(
  urlMatch ? urlMatch[1] : supabaseUrl,
  keyMatch ? keyMatch[1] : supabaseKey
);

const csvData = `rate_type,item_name,category,brand_name,vendor_name,specification,cost_basis,unit_rate,default_margin_percentage,default_wastage_percentage,notes,source_file_name,quotation_number,quotation_date,is_active
vendor_factory_rate,Asian Paints Melamine Spray Polish - Fresh,new_wood_polish,Asian Paints,Deccan Clap,Sanding + touch-up/crack filling + sanding sealer 1 coat + sanding + colour polish + 2 coats melamine spray; 7 years warranty; matt/shine finish,per_sqft,110,25,0,Fresh new wood polish rate,Deccan Clap - Woodpolish & Deco Paint Brochure.pdf,,2026-06-25,true
vendor_factory_rate,Asian Paints Melamine Spray Polish - Re Polish,wood_repolish,Asian Paints,Deccan Clap,Old wood repolish; 7 years warranty; waterproof and weatherproof,per_sqft,70,25,0,Old wood polish rate,Deccan Clap - Woodpolish & Deco Paint Brochure.pdf,,2026-06-25,true
vendor_factory_rate,Asian Paints PU Spray Polish - Fresh,pu_polish,Asian Paints,Deccan Clap,Sanding + touch-up/crack filling + sanding sealer 1 coat + sanding + colour polish + spray coats; 10 years warranty; waterproof/weatherproof,per_sqft,140,25,0,Fresh PU polish rate,Deccan Clap - Woodpolish & Deco Paint Brochure.pdf,,2026-06-25,true
vendor_factory_rate,Asian Paints PU Spray Polish - Re Polish,pu_repolish,Asian Paints,Deccan Clap,PU repolish; 10 years warranty; matt/high shine finish,per_sqft,100,25,0,PU repolish rate,Deccan Clap - Woodpolish & Deco Paint Brochure.pdf,,2026-06-25,true
vendor_factory_rate,Sheenlac Hand Wood Re Polish + Asian Paints Touchwood,wood_repolish,Sheenlac + Asian Paints,Deccan Clap,Sanding at required places + touch-ups + 2 coats colour polish + 2 coats Asian Paints Touchwood,per_sqft,20,25,0,For area above 200 sqft,Deccan Clap - Woodpolish & Deco Paint Brochure.pdf,,2026-06-25,true
vendor_factory_rate,Main Door Re Polish,door_repolish,Sheenlac + Asian Paints,Deccan Clap,Main door repolish with Touchwood shine/protection,per_door,1200,25,0,Main door repolish rate,Deccan Clap - Woodpolish & Deco Paint Brochure.pdf,,2026-06-25,true
vendor_factory_rate,Old Bedroom Door Re Polish,door_repolish,Sheenlac + Asian Paints,Deccan Clap,Old bedroom door repolish; source text says Rs 1000,per_door,1000,25,0,Verify unit basis before final BOQ; brochure text appears inconsistent,Deccan Clap - Woodpolish & Deco Paint Brochure.pdf,,2026-06-25,true
vendor_factory_rate,Deco Spray Paint - Fresh,deco_paint,ESDEE / Deco,Deccan Clap,Sanding + touch-up/crack filling + sanding sealer + primer + 2 coats deco spray; 10 years warranty,per_sqft,180,25,0,Fresh deco spray paint rate,Deccan Clap - Woodpolish & Deco Paint Brochure.pdf,,2026-06-25,true
vendor_factory_rate,Deco Spray Paint - Repaint,deco_repaint,ESDEE / Deco,Deccan Clap,Deco repaint,per_sqft,100,25,0,Deco repaint rate,Deccan Clap - Woodpolish & Deco Paint Brochure.pdf,,2026-06-25,true
vendor_factory_rate,Deco Spray Paint with NC Putty on Plywood,deco_paint_with_nc_putty,ESDEE / Deco,Deccan Clap,Deco spray paint with NC putty on plywood,per_sqft,220,25,0,For plywood surface,Deccan Clap - Woodpolish & Deco Paint Brochure.pdf,,2026-06-25,true
vendor_factory_rate,Deco Spray Paint with NC Putty on Iron Surface,deco_paint_with_nc_putty,ESDEE / Deco,Deccan Clap,Deco spray paint with NC putty on iron surface,per_sqft,180,25,0,For iron surface,Deccan Clap - Woodpolish & Deco Paint Brochure.pdf,,2026-06-25,true
vendor_factory_rate,Asian Paints PU Palette 2 Coats - Fresh,pu_spray_paint,Asian Paints,Deccan Clap,PU spray paint; sanding + primer + water paper sanding + 2 coats PU spray; 10 years warranty,per_sqft,200,25,0,Fresh PU spray paint rate,Deccan Clap - Woodpolish & Deco Paint Brochure.pdf,,2026-06-25,true
vendor_factory_rate,Asian Paints PU Palette 2 Coats - Repaint,pu_spray_repaint,Asian Paints,Deccan Clap,PU spray repaint,per_sqft,110,25,0,PU spray repaint rate,Deccan Clap - Woodpolish & Deco Paint Brochure.pdf,,2026-06-25,true
vendor_factory_rate,PU Spray Paint with NC Putty,pu_spray_with_nc_putty,Asian Paints,Deccan Clap,PU spray paint with NC putty,per_sqft,230,25,0,PU spray with NC putty,Deccan Clap - Woodpolish & Deco Paint Brochure.pdf,,2026-06-25,true
vendor_factory_rate,Asian Paints PU Emporio with Deco Spray Paint,pu_emporio_deco,Asian Paints,Deccan Clap,Deco spray paint + PU Emporio coats; 10 years warranty,per_sqft,240,25,0,PU Emporio with Deco spray paint,Deccan Clap - Woodpolish & Deco Paint Brochure.pdf,,2026-06-25,true
vendor_factory_rate,Asian Paints PU Emporio with PU Palette Spray Paint,pu_emporio_pu,Asian Paints,Deccan Clap,PU spray paint + PU Emporio coats; 10 years warranty,per_sqft,250,25,0,PU Emporio with PU Palette spray paint,Deccan Clap - Woodpolish & Deco Paint Brochure.pdf,,2026-06-25,true
vendor_factory_rate,Lamination Deco Paint,lamination_deco_paint,Deco / Lamination,Deccan Clap,Sanding + sealer + NC putty + deco spray + epoxy clear + lamination clear coats + buffing; 20 years warranty,per_sqft,500,25,0,Lamination deco paint rate,Deccan Clap - Woodpolish & Deco Paint Brochure.pdf,,2026-06-25,true
vendor_factory_rate,Lamination Polish,lamination_polish,Asian Paints PU / Lamination,Deccan Clap,Colour polish + Asian Paints PU spray + epoxy clear + lamination clear coats + buffing; 20 years warranty,per_sqft,450,25,0,Lamination polish rate,Deccan Clap - Woodpolish & Deco Paint Brochure.pdf,,2026-06-25,true
vendor_factory_rate,Polyester Paint,polyester_paint,Polyester,Deccan Clap,Epoxy clear + crack filling + acrylic paste + primer + NC putty + multiple polyester coats + buffing; 20 years warranty,per_sqft,650,25,0,Polyester paint rate,Deccan Clap - Woodpolish & Deco Paint Brochure.pdf,,2026-06-25,true
vendor_factory_rate,Gypsum Board False Ceiling with Regular Channels,false_ceiling_package,Gypsum,Deccan Clap,Gypsum company boards with regular channels,per_sqft,50,25,0,Basic false ceiling package,False Ceiling.pdf,,2026-06-25,true
vendor_factory_rate,Oman Board and Oman Channels False Ceiling,false_ceiling_package,Oman,Deccan Clap,Oman company board and Oman company channels,per_sqft,55,25,0,Oman board/channel false ceiling package,False Ceiling.pdf,,2026-06-25,true
vendor_factory_rate,Saint Gobain Gyproc False Ceiling with Regular Channels,false_ceiling_package,Saint Gobain Gyproc,Deccan Clap,Saint Gobain Gyproc gypsum false ceiling with regular channels; recommended product,per_sqft,65,25,0,Recommended product in source,False Ceiling.pdf,,2026-06-25,true
vendor_factory_rate,Saint Gobain Gyproc False Ceiling with Saint Gobain Channels,false_ceiling_package,Saint Gobain Gyproc,Deccan Clap,Saint Gobain Gyproc gypsum false ceiling with Saint Gobain channels; recommended product,per_sqft,110,25,0,Recommended product in source,False Ceiling.pdf,,2026-06-25,true
vendor_factory_rate,Saint Gobain Gyproc False Ceiling with JSW Channels,false_ceiling_package,Saint Gobain Gyproc / JSW,Deccan Clap,Saint Gobain Gyproc gypsum false ceiling with JSW channels; recommended product,per_sqft,110,25,0,Recommended product in source,False Ceiling.pdf,,2026-06-25,true`;

async function run() {
  const lines = csvData.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim());
    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i] !== undefined ? values[i] : "";
    });
    return row;
  });

  const targetTable = "vendor_rates"; // since all are vendor_factory_rate
  let count = 0;
  
  for (const row of rows) {
    const cleanRow = { ...row };
    delete cleanRow.rate_type;
    
    cleanRow.unit_rate = Number(cleanRow.unit_rate) || 0;
    cleanRow.default_margin_percentage = Number(cleanRow.default_margin_percentage) || 25;
    cleanRow.default_wastage_percentage = Number(cleanRow.default_wastage_percentage) || 0;
    cleanRow.is_active = true;
    cleanRow.quotation_date = cleanRow.quotation_date || null;
    if (cleanRow.quotation_number === "") cleanRow.quotation_number = null;

    const { data: existing } = await supabase.from(targetTable).select("id").eq("item_name", cleanRow.item_name).maybeSingle();
    
    if (existing) {
      await supabase.from(targetTable).update(cleanRow).eq("id", existing.id);
    } else {
      await supabase.from(targetTable).insert(cleanRow);
    }
    count++;
  }
  
  console.log(`Successfully imported ${count} vendor rates.`);
}

run().catch(console.error);
