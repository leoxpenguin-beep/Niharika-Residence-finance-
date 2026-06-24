import type { ClientSafeProject } from "@/lib/security/client-safe-selectors";

// Static seed for Stages 1–3 (before Supabase connection)
// Uses ClientSafeProject shape — no internal cost fields

export const NIHARIKA_PROJECT: ClientSafeProject = {
  project_code: "LEORA-P004",
  project_name: "Niharika Residence",
  client_name: "Niharika",
  concept_name: "Soft Heritage Contemporary",
  client_page_title: "Niharika Residence — Scope & Investment Journey",
  status: "draft",
  floors: [
    {
      id: "floor-gf",
      project_id: "proj-001",
      name: "Ground Floor",
      slug: "ground-floor",
      sequence: 1,
      emotional_label: "Arrival / Hospitality / Guest Comfort",
      areas: [
        {
          id: "area-gf-fyr",
          floor_id: "floor-gf",
          name: "Foyer",
          slug: "foyer",
          sequence: 1,
          design_role: "Warm arrival and devotional calm",
          units: [
            { id: "GF-FYR-SR-01", area_id: "area-gf-fyr", unit_code: "GF-FYR-SR-01", name: "Shoe Rack with Shutters", short_description: "Daily-use storage with clean arrival experience.", design_purpose: "Keeps the arrival zone calm and organised for daily use.", included_scope: "Storage structure, shutters, laminate finish, ventilation, hardware, installation.", material_direction: "Warm wood laminate with soft ivory tone.", status: "measurement_pending", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "GF-FYR-POOJA-01", area_id: "area-gf-fyr", unit_code: "GF-FYR-POOJA-01", name: "Pooja Base Storage", short_description: "Devotional storage at floor level.", design_purpose: "Provides organised storage for pooja essentials below the main niche.", included_scope: "Base cabinet, drawers, laminate finish, hardware.", material_direction: "Soft ivory or warm white with wood grain accent.", status: "measurement_pending", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "GF-FYR-NICHE-01", area_id: "area-gf-fyr", unit_code: "GF-FYR-NICHE-01", name: "Krishna Idol Niche / Backdrop", short_description: "Devotional focal point at the foyer entrance.", design_purpose: "Creates a calm, sacred focal point that welcomes with intention.", included_scope: "Niche frame, back panel, warm accent lighting, finish.", material_direction: "Fluted panel or textured back with warm cove lighting.", status: "spec_pending", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "GF-FYR-PANEL-01", area_id: "area-gf-fyr", unit_code: "GF-FYR-PANEL-01", name: "Wall Paneling / Soft Edge Treatment", short_description: "Textured wall surface treatment for the foyer.", design_purpose: "Adds warmth and craft to the arrival experience.", included_scope: "Panel framework, surface finish, edge detailing, installation.", material_direction: "Soft fluted or ribbed panel in warm taupe or ivory.", status: "spec_pending", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "GF-FYR-CEIL-01", area_id: "area-gf-fyr", unit_code: "GF-FYR-CEIL-01", name: "False Ceiling / Warm Light Detail", short_description: "Designed ceiling with cove or profile light.", design_purpose: "Sets the tone for the entire home through warm overhead light.", included_scope: "Gypsum framework, cove detail, LED profile, paint finish.", material_direction: "Off-white gypsum with warm CCT LED cove.", status: "measurement_pending", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "GF-FYR-ACC-01", area_id: "area-gf-fyr", unit_code: "GF-FYR-ACC-01", name: "Umbrella Stand, Hooks & Daily Accessories", short_description: "Practical arrival accessories.", design_purpose: "Keeps daily essentials accessible without cluttering the foyer.", included_scope: "Umbrella stand, coat hooks, key tray, installation.", material_direction: "Warm metal or cane with soft finish.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
          ],
        },
        {
          id: "area-gf-liv",
          floor_id: "floor-gf",
          name: "Living Area",
          slug: "living-area",
          sequence: 2,
          design_role: "Soft social comfort",
          units: [
            { id: "GF-LIV-TVU-01", area_id: "area-gf-liv", unit_code: "GF-LIV-TVU-01", name: "TV Base Unit", short_description: "Anchored media and storage unit below the TV.", design_purpose: "Grounds the living room with organised, beautiful storage.", included_scope: "Base cabinet, shutters, open niches, laminate finish, hardware.", material_direction: "Warm teak or oak laminate with soft close hardware.", status: "measurement_pending", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "GF-LIV-TVP-01", area_id: "area-gf-liv", unit_code: "GF-LIV-TVP-01", name: "TV Back Panel", short_description: "Designed backdrop behind the television.", design_purpose: "Creates a visual anchor and softens the wall behind the TV.", included_scope: "Panel framework, surface finish, LED profile if included.", material_direction: "Fluted panel with warm lighting behind.", status: "spec_pending", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "GF-LIV-SOFA-01", area_id: "area-gf-liv", unit_code: "GF-LIV-SOFA-01", name: "Sofa / Seating Package", short_description: "Primary seating for the living area.", design_purpose: "Sets the comfort and aesthetic tone for family and guest hosting.", included_scope: "Sofa, fabric selection, cushions, transport, installation.", material_direction: "Soft natural fabric — linen or cotton blend in warm ivory or sage.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined, upgrade_label: "Premium leather upgrade", upgrade_price: 0 },
            { id: "GF-LIV-CT-01", area_id: "area-gf-liv", unit_code: "GF-LIV-CT-01", name: "Center Table", short_description: "Living room center table.", design_purpose: "Provides functional surface and visual balance to the seating group.", included_scope: "Table, surface finish, transport, installation.", material_direction: "Reclaimed wood or cane with soft metal legs.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "GF-LIV-CEIL-01", area_id: "area-gf-liv", unit_code: "GF-LIV-CEIL-01", name: "Designed Ceiling", short_description: "Living room ceiling with light detail.", design_purpose: "Adds depth and premium feel to the main social space.", included_scope: "Gypsum framework, profile, LED, paint finish.", material_direction: "Stepped cove with warm LED — continuous with foyer.", status: "measurement_pending", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
          ],
        },
        {
          id: "area-gf-ust",
          floor_id: "floor-gf",
          name: "Under Staircase",
          slug: "under-staircase",
          sequence: 3,
          design_role: "Service access with discreet planning",
          units: [
            { id: "GF-UST-DOOR-01", area_id: "area-gf-ust", unit_code: "GF-UST-DOOR-01", name: "Ventilated Access Door", short_description: "Clean access door under staircase.", design_purpose: "Hides service zone while keeping access neat.", included_scope: "Door frame, shutter, ventilation, hardware, paint.", material_direction: "Painted finish matching wall tone.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "GF-UST-PANEL-01", area_id: "area-gf-ust", unit_code: "GF-UST-PANEL-01", name: "Louver / Grill / CNC Ventilation Panel", short_description: "Decorative ventilation panel.", design_purpose: "Provides airflow while maintaining visual continuity.", included_scope: "Panel, mounting, paint finish.", material_direction: "CNC or louvered panel in matching tone.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
          ],
        },
        {
          id: "area-gf-gbr",
          floor_id: "floor-gf",
          name: "Guest Bedroom",
          slug: "guest-bedroom",
          sequence: 4,
          design_role: "Welcoming and uncluttered guest comfort",
          units: [
            { id: "GF-GBR-BED-01", area_id: "area-gf-gbr", unit_code: "GF-GBR-BED-01", name: "Queen Bed", short_description: "Queen size bed for guest bedroom.", design_purpose: "Provides restful, comfortable sleep for guests.", included_scope: "Bed frame, headboard detail, laminate / upholstered finish.", material_direction: "Warm wood laminate with upholstered headboard panel.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "GF-GBR-WARD-01", area_id: "area-gf-gbr", unit_code: "GF-GBR-WARD-01", name: "Integrated Storage Cabinets", short_description: "Storage for guest bedroom.", design_purpose: "Provides sufficient storage without making the room feel heavy.", included_scope: "Wardrobe, shutters, internal fittings, hardware.", material_direction: "Warm ivory with soft wood tone contrast.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "GF-GBR-CEIL-01", area_id: "area-gf-gbr", unit_code: "GF-GBR-CEIL-01", name: "Simple False Ceiling", short_description: "Clean ceiling with light detail.", design_purpose: "Adds warmth without visual complexity.", included_scope: "Gypsum frame, cove, LED, paint.", material_direction: "Off-white with warm CCT light.", status: "measurement_pending", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
          ],
        },
      ],
    },
    {
      id: "floor-ff",
      project_id: "proj-001",
      name: "First Floor",
      slug: "first-floor",
      sequence: 2,
      emotional_label: "Daily Life / Family Connection / Practical Comfort",
      areas: [
        {
          id: "area-ff-kit",
          floor_id: "floor-ff",
          name: "Kitchen",
          slug: "kitchen",
          sequence: 1,
          design_role: "Practical heart of daily family life",
          units: [
            { id: "FF-KIT-BASE-01", area_id: "area-ff-kit", unit_code: "FF-KIT-BASE-01", name: "Base Cabinets", short_description: "Full run of kitchen base cabinetry.", design_purpose: "Provides the working surface and storage foundation of the kitchen.", included_scope: "Base units, shutters, internal fittings, counter support, hardware.", material_direction: "Warm laminate carcass, contrasting shutter in sage or taupe.", status: "measurement_pending", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "FF-KIT-WALL-01", area_id: "area-ff-kit", unit_code: "FF-KIT-WALL-01", name: "Wall Cabinets", short_description: "Upper kitchen cabinetry.", design_purpose: "Keeps dry storage accessible and the kitchen organised.", included_scope: "Wall units, shutters, internal shelves, hardware.", material_direction: "Lighter tone than base — ivory or soft white.", status: "measurement_pending", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "FF-KIT-TALL-01", area_id: "area-ff-kit", unit_code: "FF-KIT-TALL-01", name: "Tall Pantry Unit", short_description: "Full-height pantry storage.", design_purpose: "Maximises vertical storage for daily pantry needs.", included_scope: "Tall unit, shutters, adjustable shelves, pull-outs, hardware.", material_direction: "Matching base cabinet finish.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "FF-KIT-DRAW-01", area_id: "area-ff-kit", unit_code: "FF-KIT-DRAW-01", name: "Drawer System", short_description: "Full-extension drawer bank.", design_purpose: "Provides easy access to everyday utensils and cookware.", included_scope: "Drawer units, soft-close channels, internal organiser, hardware.", material_direction: "Matching base finish with clean metal pulls.", status: "measurement_pending", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "FF-KIT-BOTTLE-01", area_id: "area-ff-kit", unit_code: "FF-KIT-BOTTLE-01", name: "Bottle Pull-Out", short_description: "Narrow pull-out for bottles and oils.", design_purpose: "Uses slim spaces efficiently for daily-use items.", included_scope: "Pull-out unit, tray system, hardware.", material_direction: "Matching kitchen finish.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
          ],
        },
        {
          id: "area-ff-utl",
          floor_id: "floor-ff",
          name: "Utility",
          slug: "utility",
          sequence: 2,
          design_role: "Efficient and discreet service support",
          units: [
            { id: "FF-UTL-SINK-01", area_id: "area-ff-utl", unit_code: "FF-UTL-SINK-01", name: "Utility Sink Cabinet", short_description: "Sink and storage for utility area.", design_purpose: "Keeps cleaning and service tasks contained and organised.", included_scope: "Cabinet, sink, countertop, plumbing provision, hardware.", material_direction: "Durable laminate in practical tone — white or light grey.", status: "measurement_pending", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "FF-UTL-JAN-01", area_id: "area-ff-utl", unit_code: "FF-UTL-JAN-01", name: "Janitor / Cleaning Storage", short_description: "Tall storage for cleaning equipment.", design_purpose: "Keeps mops, brooms and cleaning supplies hidden and accessible.", included_scope: "Tall unit, hooks, shelf, ventilation, hardware.", material_direction: "Plain painted finish.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "FF-UTL-PULL-01", area_id: "area-ff-utl", unit_code: "FF-UTL-PULL-01", name: "Grain Pull-Out / Thin Storage", short_description: "Slim pull-out for grains and dry goods.", design_purpose: "Maximises every millimetre of utility space.", included_scope: "Pull-out unit, tray, hardware.", material_direction: "Matching utility finish.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
          ],
        },
        {
          id: "area-ff-din",
          floor_id: "floor-ff",
          name: "Open Dining",
          slug: "open-dining",
          sequence: 3,
          design_role: "Warm family gathering space",
          units: [
            { id: "FF-DIN-TABLE-01", area_id: "area-ff-din", unit_code: "FF-DIN-TABLE-01", name: "Dining Table", short_description: "Family dining table.", design_purpose: "The anchor of daily family meals and celebrations.", included_scope: "Table, surface, legs, transport, installation.", material_direction: "Solid wood or high-quality laminate — warm natural tone.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "FF-DIN-SEAT-01", area_id: "area-ff-din", unit_code: "FF-DIN-SEAT-01", name: "Dining Seating", short_description: "Chairs or bench seating for dining.", design_purpose: "Provides comfortable seating for family and guests.", included_scope: "Chairs or bench, fabric or finish, transport, installation.", material_direction: "Warm wood with linen or cane seat.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "FF-DIN-LIGHT-01", area_id: "area-ff-din", unit_code: "FF-DIN-LIGHT-01", name: "Dining Light", short_description: "Pendant or feature light over dining table.", design_purpose: "Creates mood and focus over the dining table.", included_scope: "Pendant fixture, wiring, installation.", material_direction: "Warm brass or cane pendant — natural material.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
          ],
        },
        {
          id: "area-ff-kid",
          floor_id: "floor-ff",
          name: "Kids Bedroom",
          slug: "kids-bedroom",
          sequence: 4,
          design_role: "Playful, focused and growable",
          units: [
            { id: "FF-KID-BED-01", area_id: "area-ff-kid", unit_code: "FF-KID-BED-01", name: "Bed", short_description: "Kids bedroom bed.", design_purpose: "Comfortable, safe and fun sleep space for children.", included_scope: "Bed frame, finish, hardware.", material_direction: "Warm wood with soft colour accent.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "FF-KID-STUDY-01", area_id: "area-ff-kid", unit_code: "FF-KID-STUDY-01", name: "Study Desk", short_description: "Study and work surface for children.", design_purpose: "Dedicated focus zone to support study habits.", included_scope: "Desk, storage hutch, overhead shelf, hardware.", material_direction: "Warm wood with clean white accent.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "FF-KID-WARD-01", area_id: "area-ff-kid", unit_code: "FF-KID-WARD-01", name: "Wardrobe", short_description: "Kids wardrobe with organised storage.", design_purpose: "Teaches organisation and keeps the room tidy.", included_scope: "Wardrobe, shutters, internal fittings, hardware.", material_direction: "Soft white or light wood with playful accent.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
          ],
        },
      ],
    },
    {
      id: "floor-sf",
      project_id: "proj-001",
      name: "Second Floor",
      slug: "second-floor",
      sequence: 3,
      emotional_label: "Privacy / Calm / Personal Retreat",
      areas: [
        {
          id: "area-sf-nm",
          floor_id: "floor-sf",
          name: "Niharika's Master",
          slug: "niharika-master",
          sequence: 1,
          design_role: "Personal calm and private retreat",
          units: [
            { id: "SF-NM-BED-01", area_id: "area-sf-nm", unit_code: "SF-NM-BED-01", name: "Bed", short_description: "Master bedroom bed — Niharika's retreat.", design_purpose: "The heart of personal rest and calm.", included_scope: "Bed frame, headboard, upholstered panel, hardware.", material_direction: "Warm linen headboard with wood frame — soft and grounded.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "SF-NM-WARD-01", area_id: "area-sf-nm", unit_code: "SF-NM-WARD-01", name: "Wardrobe", short_description: "Full wardrobe for master bedroom.", design_purpose: "Organised, beautiful storage for personal clothing and accessories.", included_scope: "Wardrobe, swing/sliding shutters, internal fittings, hardware.", material_direction: "Warm wood laminate with clean metal profile.", status: "measurement_pending", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "SF-NM-CEIL-01", area_id: "area-sf-nm", unit_code: "SF-NM-CEIL-01", name: "Ceiling / Lighting", short_description: "Calm ceiling design with warm light.", design_purpose: "Enhances rest with warm, dimmable lighting and soft ceiling detail.", included_scope: "Gypsum frame, cove, warm LED, paint finish.", material_direction: "Soft warm white ceiling with amber cove light.", status: "measurement_pending", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "SF-NM-HEAL-01", area_id: "area-sf-nm", unit_code: "SF-NM-HEAL-01", name: "Healing / Crystal Table", short_description: "Small surface for crystals and personal ritual.", design_purpose: "Supports personal wellness and intentional space use.", included_scope: "Side table or niche shelf, finish.", material_direction: "Natural stone top or reclaimed wood.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
          ],
        },
        {
          id: "area-sf-nmv",
          floor_id: "floor-sf",
          name: "Niharika's Vanity",
          slug: "niharika-vanity",
          sequence: 2,
          design_role: "Personal grooming and calm ritual space",
          units: [
            { id: "SF-NMV-VAN-01", area_id: "area-sf-nmv", unit_code: "SF-NMV-VAN-01", name: "Vanity Counter", short_description: "Personal grooming counter.", design_purpose: "A calm, beautiful space for daily grooming rituals.", included_scope: "Counter, cabinet below, countertop, hardware.", material_direction: "Warm stone or laminate top with painted or wood cabinet.", status: "measurement_pending", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "SF-NMV-MIR-01", area_id: "area-sf-nmv", unit_code: "SF-NMV-MIR-01", name: "Mirror with Task Light", short_description: "Vanity mirror with integrated lighting.", design_purpose: "Provides true-colour light for grooming.", included_scope: "Mirror, frame, task LED strip, wiring.", material_direction: "Frameless or warm brass-framed mirror.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "SF-NMV-DRAW-01", area_id: "area-sf-nmv", unit_code: "SF-NMV-DRAW-01", name: "Jewellery / Accessory Drawer", short_description: "Dedicated drawer for jewellery organisation.", design_purpose: "Keeps accessories organised and within reach.", included_scope: "Drawer unit, velvet or fabric liner, hardware.", material_direction: "Warm wood with velvet-lined interior.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
          ],
        },
        {
          id: "area-sf-hm",
          floor_id: "floor-sf",
          name: "His Master",
          slug: "his-master",
          sequence: 3,
          design_role: "Calm, uncluttered private space",
          units: [
            { id: "SF-HM-BED-01", area_id: "area-sf-hm", unit_code: "SF-HM-BED-01", name: "Bed", short_description: "His master bedroom bed.", design_purpose: "Restful personal sleep space.", included_scope: "Bed frame, headboard, finish.", material_direction: "Warm wood with understated headboard.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "SF-HM-WARD-01", area_id: "area-sf-hm", unit_code: "SF-HM-WARD-01", name: "Wardrobe", short_description: "His master wardrobe.", design_purpose: "Organised storage for daily clothing.", included_scope: "Wardrobe, shutters, internal fittings, hardware.", material_direction: "Clean wood or painted finish.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
          ],
        },
        {
          id: "area-sf-god",
          floor_id: "floor-sf",
          name: "Gods Room / Devotional Space",
          slug: "gods-room",
          sequence: 4,
          design_role: "Sacred, calm and intentional",
          units: [
            { id: "SF-GOD-POOJA-01", area_id: "area-sf-god", unit_code: "SF-GOD-POOJA-01", name: "Pooja Unit", short_description: "Dedicated pooja cabinet and altar.", design_purpose: "Provides a sacred, beautiful space for daily ritual.", included_scope: "Unit frame, shutters, niche, internal shelf, finish.", material_direction: "Warm ivory or soft gold accent with wood detail.", status: "spec_pending", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "SF-GOD-BACK-01", area_id: "area-sf-god", unit_code: "SF-GOD-BACK-01", name: "Devotional Backdrop", short_description: "Feature wall behind the pooja unit.", design_purpose: "Elevates the devotional space with a crafted background.", included_scope: "Panel, finish, optional LED cove.", material_direction: "Textured or carved panel with warm lighting.", status: "spec_pending", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "SF-GOD-LIGHT-01", area_id: "area-sf-god", unit_code: "SF-GOD-LIGHT-01", name: "Warm Lighting", short_description: "Devotional space lighting.", design_purpose: "Creates the right mood for prayer and reflection.", included_scope: "LED cove or spot fitting, wiring, installation.", material_direction: "Warm amber light — dimmable.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
          ],
        },
        {
          id: "area-sf-cbn",
          floor_id: "floor-sf",
          name: "Coffee / Breakfast Niche",
          slug: "coffee-niche",
          sequence: 5,
          design_role: "Quiet morning ritual space",
          units: [
            { id: "SF-CBN-COUNTER-01", area_id: "area-sf-cbn", unit_code: "SF-CBN-COUNTER-01", name: "Coffee Counter", short_description: "Compact morning beverage counter.", design_purpose: "Creates a calm niche for the morning ritual without going downstairs.", included_scope: "Counter, cabinet, countertop, appliance space, hardware.", material_direction: "Warm wood with stone top — natural and grounded.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
            { id: "SF-CBN-STOR-01", area_id: "area-sf-cbn", unit_code: "SF-CBN-STOR-01", name: "Concealed Storage", short_description: "Hidden storage for coffee niche.", design_purpose: "Keeps the niche clutter-free.", included_scope: "Cabinet, shutters, internal shelves, hardware.", material_direction: "Matching counter finish.", status: "draft", cost_confidence: "concept_estimate", final_client_price: 0, quantity: 1, created_at: "2026-06-14", published_at: undefined },
          ],
        },
      ],
    },
  ],
};

// ─── Lookup helpers ──────────────────────────────────────────────────────────

export function getFloorBySlug(slug: string) {
  return NIHARIKA_PROJECT.floors.find((f) => f.slug === slug) ?? null;
}

export function getAreaBySlug(slug: string) {
  for (const floor of NIHARIKA_PROJECT.floors) {
    const area = floor.areas.find((a) => a.slug === slug);
    if (area) return { area, floor };
  }
  return null;
}

export function getUnitById(id: string) {
  for (const floor of NIHARIKA_PROJECT.floors) {
    for (const area of floor.areas) {
      const unit = area.units.find((u) => u.id === id);
      if (unit) return { unit, area, floor };
    }
  }
  return null;
}

export function getAllUnits() {
  return NIHARIKA_PROJECT.floors.flatMap((f) => f.areas.flatMap((a) => a.units));
}

