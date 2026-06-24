import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { NIHARIKA_PROJECT } from "../data/seed-niharika";

// ID Mappings
const projId = randomUUID();
const floorIds: Record<string, string> = {};
const areaIds: Record<string, string> = {};

let sql = `-- Seed file generated from data/seed-niharika.ts\n\n`;

// Insert Project
sql += `INSERT INTO projects (id, project_code, project_name, client_name, concept_name, client_page_title, status) VALUES\n`;
sql += `('${projId}', '${NIHARIKA_PROJECT.project_code}', '${NIHARIKA_PROJECT.project_name}', '${NIHARIKA_PROJECT.client_name}', '${NIHARIKA_PROJECT.concept_name}', '${NIHARIKA_PROJECT.client_page_title}', 'published');\n\n`;

// Insert Floors
const floorValues = NIHARIKA_PROJECT.floors.map(f => {
  const fId = randomUUID();
  floorIds[f.id] = fId;
  return `('${fId}', '${projId}', '${f.name}', '${f.slug}', ${f.sequence}, '${f.emotional_label}', true)`;
});
sql += `INSERT INTO floors (id, project_id, name, slug, sequence, emotional_label, client_visible) VALUES\n`;
sql += floorValues.join(",\n") + `;\n\n`;

// Insert Areas
const areaValues = NIHARIKA_PROJECT.floors.flatMap(f => 
  f.areas.map(a => {
    const aId = randomUUID();
    areaIds[a.id] = aId;
    return `('${aId}', '${floorIds[f.id]}', '${a.name}', '${a.slug}', ${a.sequence}, '${a.design_role}', 'published', true)`;
  })
);
sql += `INSERT INTO areas (id, floor_id, name, slug, sequence, design_role, status, client_visible) VALUES\n`;
sql += areaValues.join(",\n") + `;\n\n`;

// Insert Units
const unitValues = NIHARIKA_PROJECT.floors.flatMap(f => 
  f.areas.flatMap(a => 
    a.units.map(u => {
      const uId = randomUUID();
      const esc = (str: string | undefined | null) => str ? str.replace(/'/g, "''") : "";
      return `('${uId}', '${areaIds[a.id]}', '${esc(u.unit_code)}', '${esc(u.name)}', '${esc(u.short_description)}', '${esc(u.design_purpose)}', '${esc(u.included_scope)}', '${esc(u.material_direction)}', ${u.quantity}, '${u.status}', '${u.cost_confidence}', ${u.final_client_price}, true)`;
    })
  )
);
sql += `INSERT INTO units (id, area_id, unit_code, name, short_description, design_purpose, included_scope, material_direction, quantity, status, cost_confidence, final_client_price, is_client_visible) VALUES\n`;
sql += unitValues.join(",\n") + `;\n\n`;

const outPath = path.join(__dirname, "../../../supabase/seed.sql");
fs.writeFileSync(outPath, sql);
console.log(`Successfully wrote seed SQL to ${outPath}`);
