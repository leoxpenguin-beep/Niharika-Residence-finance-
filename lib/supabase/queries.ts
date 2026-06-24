import { createClient } from "./server";
import type { ClientSafeProject, ClientSafeFloor, ClientSafeArea, ClientSafeUnit } from "../security/client-safe-selectors";

// Using the seeded project ID for development
const SEED_PROJECT_ID = '6c3ffef3-628a-4acf-812c-87d9089fa107';

export async function fetchClientProjectData(projectId: string = SEED_PROJECT_ID): Promise<ClientSafeProject | null> {
  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (!project) return null;

  const { data: floors } = await supabase
    .from('floors')
    .select('*')
    .eq('project_id', projectId)
    .eq('client_visible', true)
    .order('sequence');

  const { data: areas } = await supabase
    .from('areas')
    .select('*')
    .eq('client_visible', true)
    .order('sequence');

  const { data: units } = await supabase
    .from('client_visible_units')
    .select('*');

  const safeFloors: ClientSafeFloor[] = (floors as unknown as ClientSafeFloor[])?.map((floor) => {
    const floorAreas = (areas as unknown as ClientSafeArea[])?.filter((a) => a.floor_id === floor.id) || [];
    
    const safeAreas: ClientSafeArea[] = floorAreas.map((area) => {
      const areaUnits = (units as unknown as ClientSafeUnit[])?.filter((u) => u.area_id === area.id) || [];
      return {
        ...area,
        units: areaUnits
      };
    });

    return {
      ...floor,
      areas: safeAreas
    };
  }) || [];

  return {
    ...project,
    floors: safeFloors
  };
}

export async function getFloorBySlug(slug: string) {
  const project = await fetchClientProjectData();
  if (!project) return null;
  return project.floors.find((f) => f.slug === slug) ?? null;
}

export async function getAreaBySlug(slug: string) {
  const project = await fetchClientProjectData();
  if (!project) return null;
  
  for (const floor of project.floors) {
    const area = floor.areas.find((a) => a.slug === slug);
    if (area) return { area, floor };
  }
  return null;
}

export async function getUnitById(id: string) {
  const project = await fetchClientProjectData();
  if (!project) return null;
  
  for (const floor of project.floors) {
    for (const area of floor.areas) {
      const unit = area.units.find((u) => u.id === id);
      if (unit) return { unit, area, floor };
    }
  }
  return null;
}
