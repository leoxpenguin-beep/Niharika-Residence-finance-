import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const envLocal = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
const urlMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = envLocal.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabase = createClient(
  urlMatch ? urlMatch[1] : supabaseUrl,
  keyMatch ? keyMatch[1] : supabaseKey
);

const csvData = `rate_type,item_name,category,brand_name,vendor_name,specification,cost_basis,unit_rate,default_margin_percentage,default_wastage_percentage,notes,source_file_name,quotation_number,quotation_date,is_active
material_rate,Merino Calplus 0.8mm 13020 Rainer Walnut NPL,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft NPL,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13023 Cerro Walnut SGL,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft SGL,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 10394 Dark Zembra SF,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft SF,per_sheet,1001,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 21028 Chocolate MT,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft MT,per_sheet,1001,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 21066 Black MT,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft MT,per_sheet,1001,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13007 Salween Oak RND,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft RND,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13019 Salton Wood RND,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft RND,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13008 Rossal Oak RND,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft RND,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13021 Timor Oak SF,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft SF,per_sheet,1001,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13022 Barent Oak SF,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft SF,per_sheet,1001,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 12904 Basswood SGL,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft SGL,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13025 Murray Wood SGL,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft SGL,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13024 Yokon Wood SGL,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft SGL,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13020 Rainer Walnut SGL,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft SGL,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 12905 Dark Woods SGL,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft SGL,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13027 Celebes Wood SGL,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft SGL,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 21444 Magenta DSY,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft DSY,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 10484 Bison Woodcut Oak OTL,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft OTL,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13014 Dusk Chink DMD,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft DMD,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13006 Celtic Walnut WDY,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft WDY,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 21465 Neo Crimson DSY TST_0,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft DSY TST_0,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 10406 Redwood Plum FLM,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft FLM,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13016 Bering Wood DST,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft DST,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 10438 Pemba Pine RIG,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft RIG,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 10336 Belize Teak FWD,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft FWD,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13013 Tirichy Walnut WCT,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft WCT,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 10458 Mondo Blockwood UWD,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft UWD,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13023 Cerro Walnut TD,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft TD,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13012 Kara Wood CRC,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft CRC,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13011 Tigris Oak LMB,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft LMB,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13005 Fleece SCP,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft SCP,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13014 Dusk Chink GLZ,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft GLZ,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 10376 Classic Walnut CNL,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft CNL,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 12901 Branco Marble LOM,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft LOM,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 42004 White Marble MT,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft MT,per_sheet,1001,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13003 Dim Tectile MT,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft MT,per_sheet,1001,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 10468 Cloudy Floreto SGL 0_FB,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft SGL 0_FB,per_sheet,1150,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 13005 Fleece MT,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft MT,per_sheet,1001,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 55906 Reed Style Silver MT,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft MT,per_sheet,1001,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 55641 Teton Wood SF,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft SF,per_sheet,1001,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 10489 Arenal Wood SF,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft SF,per_sheet,1001,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true
material_rate,Merino Calplus 0.8mm 10277 Belarus Cherry SF,laminate_sheet_0_8mm,Merino Calplus,Khidki Homes KYZO,8ftx4ft SF,per_sheet,1001,25,5,Tax inclusive quote rate,Quote-2627-012285 (1).pdf,Quote-2627-012285,2026-06-12,true`;

const mapRateTypeToTable = (type) => {
  switch(type) {
    case "vendor_factory_rate": return "vendor_rates";
    case "material_rate": return "material_rates";
    case "hardware_rate": return "hardware_rates";
    case "accessory_rate": return "accessory_rates";
    case "labour_rate": return "labour_rates";
    default: return "material_rates";
  }
};

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

  let count = 0;
  
  for (const row of rows) {
    const targetTable = mapRateTypeToTable(row.rate_type);
    
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
      const { error } = await supabase.from(targetTable).update(cleanRow).eq("id", existing.id);
      if (error) console.error("Error updating:", error.message);
    } else {
      const { error } = await supabase.from(targetTable).insert(cleanRow);
      if (error) console.error("Error inserting:", error.message);
    }
    count++;
  }
  
  console.log(`Successfully imported ${count} rates.`);
}

run().catch(console.error);
